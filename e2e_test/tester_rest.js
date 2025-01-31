const newman = require('newman');

newman.run({
    collection: require('./01_New_order_2_prod_REST.postman_collection.json'),
    environment: require('./BachDev.postman_environment.json'),
    insecure: true,
    verbose: true,
    reporters: 'htmlextra',
    reporter: {
        htmlextra: {
            export: './output.html'
        }
    }
}, function (err, summary) {  // Add the 'summary' parameter
    if (err) { throw err; }

    console.log('Collection run complete!');

    // Access the request timings:
    if (summary && summary.run && summary.run.executions) {
        const timings = summary.run.executions.map(execution => {
            return {
                name: execution.item.name, // Request name
                time: execution.response.responseTime // Response time in milliseconds
            };
        });

        console.log("Request Timings:");
        console.table(timings); // Use console.table for a formatted output

        // OR, if you prefer a simple list:
        timings.forEach(item => {
            console.log(`${item.name}: ${item.time}ms`);
        });

    } else {
        console.log("No execution data found in the summary.");
    }
});