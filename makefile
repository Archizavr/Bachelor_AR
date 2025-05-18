.PHONY: help

help: ## Display this help screen
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

run: ### Run all containers with docker compose
	docker compose up -d
	docker compose logs
.PHONY: run

stop: ### Stop docker compose
	docker compose down
.PHONY: stop

restart: stop ### Stop and re-build docker compose
	docker compose up -d --build
.PHONY: restart

deploy: ### Push all images to docker repository
	docker push artezorro/api_gateway:v2
	docker push artezorro/srvc1_user:v2
	docker push artezorro/srvc2_order:v2
	docker push artezorro/srvc3_prod:v2
	docker push artezorro/db_user:v2
	docker push artezorro/db_order:v2
	docker push artezorro/db_product:v2
.PHONY: deploy

clear: stop ### Remove all created containers & images
	docker image prune -f
	docker image prune -a -f
.PHONY: clear

start_db: ### Run all databases
	docker-compose up db_order db_user db_product -d

stop_db: ### Stop all databases
	docker-compose down db_user
	docker-compose down db_order
	docker-compose down db_product

clear_db: ### Clear all databases
	docker-compose down
	docker-compose prune

run_dev: ### Run all standalone NodeJS services
	@node srvc1_user/server.js &
	@node srvc2_order/server.js &
	@node srvc3_prod/server.js &
	@node api_gateway/server.js &
	@echo "Services started in the background."
.PHONY: run_dev

stop_dev: ### Stop all standalone NodeJS services
	@pkill -f "node srvc1_user/server.js" &
	@pkill -f "node srvc2_order/server.js" &
	@pkill -f "node srvc3_prod/server.js" &
	@pkill -f "node api_gateway/server.js" &
	@echo "Services stopped."
.PHONY: stop_dev

restart_dev: stop_dev run_dev ### Stop all standalone NodeJS services and re-run it
.PHONY: stop_dev

start_all_test_rest: # Execute all REST API tests
	node e2e_test/test_collection.js ./00_Test_All_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST.html
.PHONY: start_all_test_rest

start_all_test_gql: # Execute all GraphQL tests
	node e2e_test/test_collection.js ./00_Test_All_GQL_POST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL.html
.PHONY: start_all_test_gql

test_endp: start_all_test_rest start_all_test_gql ### Test all endpoints REST API & GraphQL
.PHONY: test_endp

start_all_test_dev_rest: # Execute all REST API tests in dev mode
	node e2e_test/test_collection.js ./00_Test_All_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html
.PHONY: start_all_test_dev_rest

start_all_dev_01_new_order: ### Execute all REST API and GraphQL tests in dev mode and save statistics
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 1 ./reports/Dev/REST/statistics_dev_01_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 1 ./reports/Dev/GQL/statistics_dev_01_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 10 ./reports/Dev/REST/statistics_dev_10_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 10 ./reports/Dev/GQL/statistics_dev_10_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 20 ./reports/Dev/REST/statistics_dev_20_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 20 ./reports/Dev/GQL/statistics_dev_20_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 50 ./reports/Dev/REST/statistics_dev_50_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 50 ./reports/Dev/GQL/statistics_dev_50_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 100 ./reports/Dev/REST/statistics_dev_100_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 100 ./reports/Dev/GQL/statistics_dev_100_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 200 ./reports/Dev/REST/statistics_dev_200_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 200 ./reports/Dev/GQL/statistics_dev_200_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 300 ./reports/Dev/REST/statistics_dev_300_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 300 ./reports/Dev/GQL/statistics_dev_300_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 400 ./reports/Dev/REST/statistics_dev_400_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 400 ./reports/Dev/GQL/statistics_dev_400_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 500 ./reports/Dev/REST/statistics_dev_500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 500 ./reports/Dev/GQL/statistics_dev_500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 600 ./reports/Dev/REST/statistics_dev_600_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 600 ./reports/Dev/GQL/statistics_dev_600_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 700 ./reports/Dev/REST/statistics_dev_700_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 700 ./reports/Dev/GQL/statistics_dev_700_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 800 ./reports/Dev/REST/statistics_dev_800_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 800 ./reports/Dev/GQL/statistics_dev_800_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 900 ./reports/Dev/REST/statistics_dev_900_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 900 ./reports/Dev/GQL/statistics_dev_900_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 1000 ./reports/Dev/REST/statistics_dev_1000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 1000 ./reports/Dev/GQL/statistics_dev_1000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 1500 ./reports/Dev/REST/statistics_dev_1500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 1500 ./reports/Dev/GQL/statistics_dev_1500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 2000 ./reports/Dev/REST/statistics_dev_2000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 2000 ./reports/Dev/GQL/statistics_dev_2000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 2500 ./reports/Dev/REST/statistics_dev_2500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 2500 ./reports/Dev/GQL/statistics_dev_2500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 3000 ./reports/Dev/REST/statistics_dev_3000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 3000 ./reports/Dev/GQL/statistics_dev_3000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 3500 ./reports/Dev/REST/statistics_dev_3500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 3500 ./reports/Dev/GQL/statistics_dev_3500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 4000 ./reports/Dev/REST/statistics_dev_4000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 4000 ./reports/Dev/GQL/statistics_dev_4000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 4500 ./reports/Dev/REST/statistics_dev_4500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 4500 ./reports/Dev/GQL/statistics_dev_4500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 5000 ./reports/Dev/REST/statistics_dev_5000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html 5000 ./reports/Dev/GQL/statistics_dev_5000_GQL.csv > nul
.PHONY: start_all_dev_01_new_order_large2

start_all_test_01_new_order: ### Execute all REST API and GraphQL tests in test mode and save statistics
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 1 ./reports/statistics_test_01_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 1 ./reports/statistics_test_01_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 10 ./reports/statistics_test_10_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 10 ./reports/statistics_test_10_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 20 ./reports/statistics_test_20_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 20 ./reports/statistics_test_20_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 50 ./reports/statistics_test_50_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 50 ./reports/statistics_test_50_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 100 ./reports/statistics_test_100_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 100 ./reports/statistics_test_100_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 200 ./reports/statistics_test_200_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 200 ./reports/statistics_test_200_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 300 ./reports/statistics_test_300_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 300 ./reports/statistics_test_300_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 400 ./reports/statistics_test_400_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 400 ./reports/statistics_test_400_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 500 ./reports/statistics_test_500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 500 ./reports/statistics_test_500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 600 ./reports/statistics_test_600_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 600 ./reports/statistics_test_600_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 700 ./reports/statistics_test_700_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 700 ./reports/statistics_test_700_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 800 ./reports/statistics_test_800_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 800 ./reports/statistics_test_800_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 900 ./reports/statistics_test_900_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 900 ./reports/statistics_test_900_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 1000 ./reports/statistics_test_1000_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 1000 ./reports/statistics_test_1000_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 1500 ./reports/statistics_test_1500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 1500 ./reports/statistics_test_1500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 2000 ./reports/statistics_test_2000_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 2000 ./reports/statistics_test_2000_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 2500 ./reports/statistics_test_2500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 2500 ./reports/statistics_test_2500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 3000 ./reports/statistics_test_3000_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 3000 ./reports/statistics_test_3000_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 3500 ./reports/statistics_test_3500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 3500 ./reports/statistics_test_3500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 4000 ./reports/statistics_test_4000_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 4000 ./reports/statistics_test_4000_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 4500 ./reports/statistics_test_4500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 4500 ./reports/statistics_test_4500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST_test.html 5000 ./reports/statistics_test_5000_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL_test.html 5000 ./reports/statistics_test_5000_GQL.csv > null
.PHONY: start_all_dev_01_new_order

start_all_cloud_01_new_order: # Execute all REST API and GraphQL tests in cloud mode and save statistics
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 1 ./reports/Cloud/REST/statistics_cloud_1_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 1 ./reports/Cloud/GQL/statistics_cloud_1_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 10 ./reports/Cloud/REST/statistics_cloud_10_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 10 ./reports/Cloud/GQL/statistics_cloud_10_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 20 ./reports/Cloud/REST/statistics_cloud_20_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 20 ./reports/Cloud/GQL/statistics_cloud_20_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 50 ./reports/Cloud/REST/statistics_cloud_50_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 50 ./reports/Cloud/GQL/statistics_cloud_50_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 100 ./reports/Cloud/REST/statistics_cloud_100_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 100 ./reports/Cloud/GQL/statistics_cloud_100_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 200 ./reports/Cloud/REST/statistics_cloud_200_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 200 ./reports/Cloud/GQL/statistics_cloud_200_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 300 ./reports/Cloud/REST/statistics_cloud_300_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 300 ./reports/Cloud/GQL/statistics_cloud_300_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 400 ./reports/Cloud/REST/statistics_cloud_400_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 400 ./reports/Cloud/GQL/statistics_cloud_400_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 500 ./reports/Cloud/REST/statistics_cloud_500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 500 ./reports/Cloud/GQL/statistics_cloud_500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 600 ./reports/Cloud/REST/statistics_cloud_600_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 600 ./reports/Cloud/GQL/statistics_cloud_600_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 700 ./reports/Cloud/REST/statistics_cloud_700_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 700 ./reports/Cloud/GQL/statistics_cloud_700_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 800 ./reports/Cloud/REST/statistics_cloud_800_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 800 ./reports/Cloud/GQL/statistics_cloud_800_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 900 ./reports/Cloud/REST/statistics_cloud_900_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 900 ./reports/Cloud/GQL/statistics_cloud_900_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 1000 ./reports/Cloud/REST/statistics_cloud_1000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 1000 ./reports/Cloud/GQL/statistics_cloud_1000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 1500 ./reports/Cloud/REST/statistics_cloud_1500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 1500 ./reports/Cloud/GQL/statistics_cloud_1500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 2000 ./reports/Cloud/REST/statistics_cloud_2000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 2000 ./reports/Cloud/GQL/statistics_cloud_2000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 2500 ./reports/Cloud/REST/statistics_cloud_2500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 2500 ./reports/Cloud/GQL/statistics_cloud_2500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 3000 ./reports/Cloud/REST/statistics_cloud_3000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 3000 ./reports/Cloud/GQL/statistics_cloud_3000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 3500 ./reports/Cloud/REST/statistics_cloud_3500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 3500 ./reports/Cloud/GQL/statistics_cloud_3500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 4000 ./reports/Cloud/REST/statistics_cloud_4000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 4000 ./reports/Cloud/GQL/statistics_cloud_4000_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 4500 ./reports/Cloud/REST/statistics_cloud_4500_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 4500 ./reports/Cloud/GQL/statistics_cloud_4500_GQL.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 5000 ./reports/Cloud/REST/statistics_cloud_5000_REST.csv > nul
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 5000 ./reports/Cloud/GQL/statistics_cloud_5000_GQL.csv > nul
.PHONY: start_all_cloud_01_new_order_large2

start_all_cloud_01_new_order_100_1000: ### Execute all REST API and GraphQL tests in dev mode and save statistics
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 100 ./reports/Cloud/REST/statistics_cloud_100_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 100 ./reports/Cloud/GQL/statistics_cloud_100_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 200 ./reports/Cloud/REST/statistics_cloud_200_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 200 ./reports/Cloud/GQL/statistics_cloud_200_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 300 ./reports/Cloud/REST/statistics_cloud_300_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 300 ./reports/Cloud/GQL/statistics_cloud_300_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 400 ./reports/Cloud/REST/statistics_cloud_400_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 400 ./reports/Cloud/GQL/statistics_cloud_400_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 500 ./reports/Cloud/REST/statistics_cloud_500_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 500 ./reports/Cloud/GQL/statistics_cloud_500_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 600 ./reports/Cloud/REST/statistics_cloud_600_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 600 ./reports/Cloud/GQL/statistics_cloud_600_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 700 ./reports/Cloud/REST/statistics_cloud_700_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 700 ./reports/Cloud/GQL/statistics_cloud_700_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 800 ./reports/Cloud/REST/statistics_cloud_800_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 800 ./reports/Cloud/GQL/statistics_cloud_800_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 900 ./reports/Cloud/REST/statistics_cloud_900_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 900 ./reports/Cloud/GQL/statistics_cloud_900_GQL.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_cloud.html 1000 ./reports/Cloud/REST/statistics_cloud_1000_REST.csv > null
	sleep 3
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html 1000 ./reports/Cloud/GQL/statistics_cloud_1000_GQL.csv > null
.PHONY: start_all_cloud_01_new_order_100_1000

start_all_test_dev_rest_10: ### Execute all REST API tests in dev mode 1, 20 and 50 times
	sleep 3
	node e2e_test/test_collection.js ./00_Test_All_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 1 ./reports/statistics_dev_01.csv >./reports/overall_stat.log
	sleep 3
	node e2e_test/test_collection.js ./00_Test_All_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 20 ./reports/statistics_dev_20.csv >>./reports/overall_stat.log
	sleep 3
	node e2e_test/test_collection.js ./00_Test_All_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 50 ./reports/statistics_dev_50.csv >>./reports/overall_stat.log
.PHONY: start_all_test_dev_rest_10

start_all_test_dev_gql: # Execute all GraphQL tests in dev mode
	node e2e_test/test_collection.js ./00_Test_All_GQL_POST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html
.PHONY: start_all_test_dev_gql

test_endp_dev: start_all_test_dev_rest start_all_test_dev_gql ### Test all endpoints REST API & GraphQL in dev mode
.PHONY: test_endp_dev

start_all_test_cloud_gql: # Execute all GraphQL tests in cloud mode
	node e2e_test/test_collection.js ./00_Test_All_GQL_POST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_cloud.html
.PHONY: start_all_test_cloud_gql

test_endp_cloud: start_all_test_cloud_rest start_all_test_cloud_gql ### Test all endpoints REST API & GraphQL in cloud mode
.PHONY: test_endp_cloud

test_time_01: ### Test scenario 01: REST API & GraphQL in test mode
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_REST01.html
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachTest01.postman_environment.json ./reports/output_GQL01.html
.PHONY: test_time_01

test_time_01_dev: ### Test scenario 01: REST API & GraphQL in dev mode
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST01.html
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL01.html
.PHONY: test_time_01_dev

test_time_01_azure: ### Test scenario 01: REST API & GraphQL in cloud mode
	node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachAzureTest.postman_environment.json ./reports/output_REST01.html
	node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachAzureTest.postman_environment.json ./reports/output_GQL01.html
.PHONY: test_time_01_azure

test_time: test_time_01 ### Test all scenarios
.PHONY: test_time
