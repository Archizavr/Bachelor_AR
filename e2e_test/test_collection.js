const newman = require('newman');
const fs = require('fs');
const path = require('path');

// Get command-line arguments
const collectionPath = process.argv[2] || './00_Test_All_REST.postman_collection.json';
const environmentPath = process.argv[3] || './BachTest01.postman_environment.json';
const reportPath = process.argv[4] || './output.html';
const iterations = parseInt(process.argv[5], 10) || 1; // Количество повторений
const csvFileName = process.argv[6] || 'statistics.csv'; // Имя CSV файла

if (isNaN(iterations) || iterations <= 0) {
    console.error("Iterations (N) must be a positive integer.");
    process.exit(1);
}

if (!csvFileName.endsWith('.csv')) {
    console.error("The file name for the CSV output must end with '.csv'.");
    process.exit(1);
}

const csvFilePath = path.resolve(csvFileName);
fs.writeFileSync(csvFilePath, 'Iteration,API Name,Response Time (ms),Status Code\n', 'utf8');


// Инициализация заголовков CSV
let serviceNames = [];

// Функция для выполнения коллекции
const runCollection = (iteration) => {
    return new Promise((resolve, reject) => {
        newman.run({
            collection: require(collectionPath),
            environment: require(environmentPath),
            insecure: true,
            verbose: true,
            reporters: 'htmlextra',
            reporter: {
                htmlextra: {
                    export: reportPath
                }
            }
        }, (err, summary) => {
            if (err) return reject(err);

            // Обработка данных о времени выполнения
            const timings = summary.run.executions.map((execution) => {
                const response = execution.response || {};
                return {
                    iteration,runCollection,
                    // name: execution.item ? execution.item.name : "Unknown Request",
                    name: execution.item.name || "Unknown Request",
                    time: response.responseTime || 0,
                    status: response.code || "N/A"
                };
            });
 
            // Обновление списка сервисов (заголовок файла)
            if (serviceNames.length === 0) {
                serviceNames = timings.map(t => t.name);
            }
 
            resolve({ iteration, timings });
        });
    });
};

// Основной процесс выполнения
(async () => {
    console.log(`Starting ${iterations} iterations of the collection...`);

    for (let i = 1; i <= iterations; i++) {
        try {
            console.log(`Running iteration ${i}...`);
            const { iteration, timings } =  await runCollection(i);

            if (i == 1) {
                const header = `Iteration,${serviceNames.map(name => `${name}`).join(',Code,')}\n`;
                fs.writeFileSync(csvFilePath, header, 'utf8');
            }

            const row = [
                iteration,
                ...serviceNames.map(service => {
                    const timing = timings.find(t => t.name === service);
                    return timing ? `${timing.time},${timing.status}` : 'N/A,N/A';
                })
            ].join(',');
            fs.appendFileSync(csvFilePath, row + '\n', 'utf8');
            console.log(row);

            if (i == 1) {
                console.log("Request Timings:");
                console.table(timings);
            }

            console.log(`Iteration ${i} completed and logged.`);

        } catch (error) {
            console.error(`Error during iteration ${i}:`, error.message);
            process.exit(1);
        }
    }

    console.log(`All ${iterations} iterations completed. Statistics saved to ${csvFilePath}`);
})();