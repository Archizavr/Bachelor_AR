#!/bin/bash

# Define the command to run
# COMMAND="node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 500 ./reports/statistics_dev_2500_REST.csv >nul"
# COMMAND="node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachDev.postman_environment.json ./reports/output_REST_dev.html 500 ./reports/statistics_dev_2500_REST.csv >nul"
# COMMAND="node e2e_test/test_collection.js ./01_New_order_2_prod_REST.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_REST_dev.html 250 ./reports/Cloud/REST/statistics_cloud_bash_1000_REST.csv >nul"
COMMAND="node e2e_test/test_collection.js ./01_New_order_2_prod_GQL.postman_collection.json ./BachGoogleCloud.postman_environment.json ./reports/output_GQL_dev.html 250 ./reports/Cloud/GQL/statistics_cloud_bash_1000_GQL.csv >nul"

# Output file for the combined results
OUTPUT_FILE="./reports/stat_full_run_combined.log"

# Clear the output file (if it exists) before starting
> "$OUTPUT_FILE"

# Run the command 10 times in parallel
for i in {1..4}; do
  echo "Starting instance $i..." >> "$OUTPUT_FILE"
  bash -c "$COMMAND" >> "$OUTPUT_FILE" 2>&1 &
done

# Wait for all background processes to finish
wait

echo "All 10 instances completed." >> "$OUTPUT_FILE"