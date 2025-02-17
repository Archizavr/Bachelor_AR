const newman = require('newman');

// Get command-line arguments
const collectionPath = process.argv[2] || './00_Test_All_REST.postman_collection.json';
const environmentPath = process.argv[3] || './BachTest01.postman_environment.json';
const reportPath = process.argv[4] || './output.html';


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
}, function (err, summary) {  // Add the 'summary' parameter
    if (err) { throw err; }

    console.log('Collection run complete!');

    // Access the request timings:
    if (summary && summary.run && summary.run.executions) {
        const timings = summary.run.executions.map(execution => {
            const response = execution.response || {}; // Handle cases where response might be missing
            return {
                name: execution.item ? execution.item.name : "Unknown Request", // Handle missing item
                time: response.responseTime || 0, // Default to 0 if responseTime is missing
                status: response.code || "N/A" // Default to "N/A" if code is missing
            };
        });
    
        console.log("Request Timings:");
        console.table(timings);
    
        // OR, if you prefer a simple list:
        timings.forEach(item => {
            console.log(`${item.name}: ${item.time}ms (Status: ${item.status})`);
        });
    
    } else {
        console.log("No execution data found in the summary.");
    }


    // if (summary && summary.run && summary.run.executions) {
    //     const timings = summary.run.executions.map(execution => {
    //         return {
    //             name: execution.item.name, // Request name
    //             time: execution.response.responseTime||0, // Response time in milliseconds
    //             status: execution.response.code // Add the status code
    //         };
    //     });

    //     console.log("Request Timings:");
    //     console.table(timings); // Use console.table for a formatted output

    //     // OR, if you prefer a simple list:
    //     timings.forEach(item => {
    //         // console.log(`${item.name}: ${item.time}ms`);
    //         console.log(`${item.name}: ${item.time}ms (Status: ${item.status})`);
    //     });

    // } else {
    //     console.log("No execution data found in the summary.");
    // }
});