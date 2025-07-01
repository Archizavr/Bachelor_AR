#!/bin/bash

# Настройки для тестов
NUMBERS=(1 3 5)  # Массив чисел для числа запусков в цикле

SAR_DURATION=9  # Продолжительность работы команды sar в секундах
OUTPUT_DIR="./reports"
OUTPUT_DIR_CPU="./reports/cpu_test"
OUTPUT_DIR_IMG="./reports/images"

# Извлекаем значение среды из первого аргумента, если он передан
ENVIRONMENT=${1#env=}

# Если параметр не задан или пустой, устанавливаем значение по умолчанию
if [ -z "$ENVIRONMENT" ]; then
  ENVIRONMENT="dev"  # значение по умолчанию
fi

echo "Using environment: $ENVIRONMENT"

# Настройки файлов для каждой среды
case $ENVIRONMENT in
  dev)
    COLLECTION_FILE="./03_Get_all_products_REST.postman_collection.json"
    ENV_FILE="./BachDev.postman_environment.json"
    OUTPUT_DIR="./reports/Dev/REST"
    ;;
  test)
    COLLECTION_FILE="./03_Get_all_products_REST_Test.postman_collection.json"
    ENV_FILE="./BachTest.postman_environment.json"
    OUTPUT_DIR="./reports/Test/REST"
    ;;
  test2)
    COLLECTION_FILE="./03_Get_all_products_REST_Test2.postman_collection.json"
    ENV_FILE="./BachTest2.postman_environment.json"
    OUTPUT_DIR="./reports/Test2/REST"
    ;;
  cloud)
    COLLECTION_FILE="./03_Get_all_products_REST_Cloud.postman_collection.json"
    ENV_FILE="./BachCloud.postman_environment.json"
    OUTPUT_DIR="./reports/Cloud/REST"
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

# MODE="both"        # Режим: rest, gql, or both
MODE=${2#mode=}
if [ -z "$MODE" ]; then
  MODE="dev"  # значение по умолчанию
fi
echo "Running in mode: $MODE"

# Количество параллельных потоков
THREADS=${3#thread=}
if [ -z "$THREADS" ]; then
  THREADS=1  # значение по умолчанию
fi

# Убедимся, что директория для вывода существует
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR_CPU"
mkdir -p "$OUTPUT_DIR_IMG"


TOTAL_RUNS=8    # Общее количество запусков
# Расчёт количества запусков на цикл
RUNS_PER_CYCLE=$((TOTAL_RUNS / THREADS))

# Цикл по числам
for n in "${NUMBERS[@]}"; do
    echo "Запускаю тест для числа $n, запуск выполнится в $THREADS потоках"
    RUNS_PER_CYCLE=$((n / THREADS))
    
    COMMAND_TEMPLATE=""
    COMMAND_TEMPLATE="echo {n}"

    # echo "Running tests in $THREADS thread(s)"
    for thread in $(seq 1 $THREADS); do
    echo "   Выполняю поток $thread с числом $RUNS_PER_CYCLE ..." 
    # Параллельное выполнение RUNS_PER_CYCLE команд
        #   for i in $(seq 1 $RUNS_PER_CYCLE); do
        #   done

        OUTPUT_HTML=" $OUTPUT_DIR/output_${ENVIRONMENT}_${n}.html"
        OUTPUT_CSV=" $OUTPUT_DIR/statistics_${ENVIRONMENT}_${n}_REST.csv"

    # echo "Starting instance $i of cycle $cycle..." 
    # echo "Running $n times in $thread thread..." 
    # echo "Running $RUNS_PER_CYCLE times in $thread thread..." 
        # Подставляем значения в шаблон команды
        cmd=${COMMAND_TEMPLATE//\{n\}/$n}
        echo "      Выполняю команду: $cmd"
        cmd=${cmd//{output_html}\/$OUTPUT_HTML}
        # cmd=${cmd//{output_csv}/$OUTPUT_CSV}

        echo "      Выполняю команду: $cmd"
        #   eval "$cmd"
        sleep 2
        echo "   Поток $thread отправлен на выполнение." 
    done

  # Ожидание завершения всех процессов текущего цикла
  wait
done

exit 0



# Шаблон команды
# COMMAND_TEMPLATE="node e2e_test/test_collection.js $COLLECTION_FILE $ENV_FILE {output_html} {n} {output_csv} > /dev/null"
COMMAND_TEMPLATE="echo {n}"


# Запуск команды sar
echo "Starting sar command for environment: $ENVIRONMENT"
echo "   COLLECTION_FILE $COLLECTION_FILE"
echo "   ENV_FILE $ENV_FILE"
echo "   OUTPUT_DIR $OUTPUT_DIR"

# Цикл по числам
for n in "${NUMBERS[@]}"; do
  OUTPUT_HTML="$OUTPUT_DIR/output_${ENVIRONMENT}_${n}.html"
  OUTPUT_CSV="$OUTPUT_DIR/statistics_${ENVIRONMENT}_${n}_REST.csv"

  # Подставляем значения в шаблон команды
  cmd=${COMMAND_TEMPLATE//{n}/$n}
  cmd=${cmd//{output_html}/$OUTPUT_HTML}
  cmd=${cmd//{output_csv}/$OUTPUT_CSV}

  echo "Running command: $cmd"
#   eval "$cmd"
  sleep 2
done

# Функция для выполнения тестов
run_tests() {
  local command=$1
  local log_file=$2
  local test_type=$3

  # Запуск команды sar
  SAR_FILE="$OUTPUT_DIR/cpu_${ENVIRONMENT}_05_n_rest.log"
  echo "Starting sar command for environment: $ENVIRONMENT"
  sar -u 1 "$SAR_DURATION" > "$SAR_FILE" &
  SAR_PID=$!

  for num in "${NUMBERS[@]}"; do
    echo "Starting $test_type tests with $num runs..." >> "$log_file"

    # Запуск num экземпляров команды в параллель
    for i in $(seq 1 $num); do
      echo "Starting $test_type instance $i of $num runs..." >> "$log_file"
      bash -c "$command" >> "$log_file" 2>&1 &
    done

    # Ожидаем завершения всех процессов перед переходом к следующему числу
    wait
    echo "$test_type tests with $num runs completed." >> "$log_file"
  done

  kill $SAR_PID 2>/dev/null || true
  echo "Sar command completed. Log file: $SAR_FILE"
}


# Завершение команды sar
kill $SAR_PID 2>/dev/null || true
echo "Sar command completed. Log file: $SAR_FILE"

# Преобразование файла sar в формат CSV
echo "Converting sar log to CSV format: $CSV_FILE"

# Добавляем заголовок CSV
echo "Time,CPU,%user,%nice,%system,%iowait,%steal,%idle" > "$CSV_FILE"

# Преобразуем данные sar в CSV
awk '
BEGIN { OFS = "," }
NR > 3 { print $1, $2, $3, $4, $5, $6, $7, $8 }
' "$SAR_FILE" >> "$CSV_FILE"

echo "CSV conversion complete. CSV file: $CSV_FILE"


# Выбор режима тестирования
case "$MODE" in
  rest)
    echo "Running only REST tests..."
    run_tests "$REST_COMMAND" "$REST_LOG" "REST"
    ;;
  gql)
    echo "Running only GraphQL tests..."
    run_tests "$GQL_COMMAND" "$GQL_LOG" "GraphQL"
    ;;
  both)
    echo "Running both REST and GraphQL tests..."
    run_tests "$REST_COMMAND" "$REST_LOG" "REST"
    run_tests "$GQL_COMMAND" "$GQL_LOG" "GraphQL"
    ;;
  *)
    echo "Unknown mode: $MODE. Use rest, gql, or both."
    exit 1
    ;;
esac

# # Параметры
# SAR_FILE="$OUTPUT_DIR/cpu_${ENVIRONMENT}_05_n_rest.log"
# CSV_FILE="$OUTPUT_DIR/cpu_${ENVIRONMENT}_05_n_rest.echo "   COLLECTION_FILE $COLLECTION_FILE"
# csv"

# # Команды и файлы для REST и GraphQL
# REST_COMMAND="node e2e_test/test_collection.js ./03_Get_all_products_REST.postman_collection.json ./Bach${ENVIRONMENT}.postman_environment.json ./reports/output_REST_${ENVIRONMENT}.html"
# GQL_COMMAND="node e2e_test/test_collection.js ./03-1_Get_all_products_all_info_GQL.postman_collection.json ./Bach${ENVIRONMENT}.postman_environment.json ./reports/output_GQL_${ENVIRONMENT}.html"
# REST_LOG="./reports/REST_${ENVIRONMENT}.log"
# GQL_LOG="./reports/GQL_${ENVIRONMENT}.log"

