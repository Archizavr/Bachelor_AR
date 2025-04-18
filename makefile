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
	docker push artezorro/api_gateway:v1
	docker push artezorro/srvc1_user:v1
	docker push artezorro/srvc2_order:v1
	docker push artezorro/srvc3_prod:v1
.PHONY: deploy

clear: stop ### Remove all created containers & images
	docker image prune -f
	docker image prune -a -f
.PHONY: clear

run_dev: ### Run all standalone NodeJS services
	@node srvc1_user/usersService.js &
	@node srvc2_order/ordersService.js &
	@node srvc3_prod/productService.js &
	@node api_gateway/gateway_appolo.js &
	@echo "Services started in the background."
.PHONY: run_dev

stop_dev: ### Stop all standalone NodeJS services
	@pkill -f "node srvc1_user/usersService.js" &
	@pkill -f "node srvc2_order/ordersService.js" &
	@pkill -f "node srvc3_prod/productService.js" &
	@pkill -f "node api_gateway/gateway_appolo.js" &
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

start_all_test_dev_gql: # Execute all GraphQL tests in dev mode
	node e2e_test/test_collection.js ./00_Test_All_GQL_POST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_GQL_dev.html
.PHONY: start_all_test_dev_gql

test_endp_dev: start_all_test_dev_rest start_all_test_dev_gql ### Test all endpoints REST API & GraphQL in dev mode
.PHONY: test_endp_dev

start_all_test_azure_rest: # Execute all REST API tests in cloud mode
	node e2e_test/test_collection.js ./00_Test_All_REST.postman_collection.json ./BachAzureTest.postman_environment.json ./reports/output_REST_azure.html
.PHONY: start_all_test_azure_rest

start_all_test_azure_gql: # Execute all GraphQL tests in cloud mode
	node e2e_test/test_collection.js ./00_Test_All_GQL_POST.postman_collection.json ./BachAzureTest.postman_environment.json ./reports/output_GQL_azure.html
.PHONY: start_all_test_azure_gql

test_endp_azure: start_all_test_azure_rest start_all_test_azure_gql ### Test all endpoints REST API & GraphQL in cloud mode
.PHONY: test_endp_azure

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
