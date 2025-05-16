const newman = require('newman');
const fs = require('fs');
const path = require('path');

// Get command-line arguments
const collectionPath = process.argv[2] || './00_Test_All_REST.postman_collection.json';
const environmentPath = process.argv[3] || './BachTest01.postman_environment.json';
// const reportPath = process.argv[4] || './output.html';
const iterations = parseInt(process.argv[5], 10) || 1; // Atkārtojumu skaits
const csvFileName = process.argv[6] || 'statistics.csv'; // CSV faila nosaukums zvanu statistikas saglabāšanai

if (isNaN(iterations) || iterations <= 0) {
    console.error("Iterations (N) must be a positive integer.");
    process.exit(1);
}

if (!csvFileName.endsWith('.csv')) {
    console.error("The file name for the CSV output must end with '.csv'.");
    process.exit(1);
}

const csvFilePath = path.resolve(csvFileName);

let serviceNames = [];

// Kolekcijas izpildes funkcija
const runCollection = (iteration) => {
    return new Promise((resolve, reject) => {
        newman.run({
            collection: require(collectionPath),
            environment: require(environmentPath),
            insecure: true,
            verbose: true,
            reporters: 'cli',
            // reporters: 'htmlextra',
            // reporter: {
            //     htmlextra: {
            //         // export: reportPath+"_"+iteration+".html"
            //         export: reportPath
            //     }
            // }
        }, (err, summary) => {
            if (err) return reject(err);

            const timings = summary.run.executions.map((execution) => {
                const response = execution.response;
                return {
                    iteration,
                    name: execution.item.name || "Unknown Request",
                    time: response ? response.responseTime : "No Response",
                    status: response ? response.code : "No Response"
                };
            });

            if (serviceNames.length === 0) {
                serviceNames = timings.map(t => t.name);
            }

            // Create a summary object
            const summaryData = {
                startTime: new Date(summary.run.timings.started).toISOString(),
                endTime: new Date(summary.run.timings.completed).toISOString(),
                totalRequests: summary.run.stats.requests.total,
                totalErrors: summary.run.stats.requests.failed,
                requestData: {
                    sent: summary.run.transfers.requestTotal,
                    received: summary.run.transfers.responseTotal
                }
            };

            resolve({ iteration, timings, summary: summaryData });
            // resolve({ iteration, timings });
        });
    });
};

// Īstenošanas pamatprocess
(async () => {
    // console.log(`Starting ${iterations} iterations of the collection...`);

    const startTime = Date.now(); // Visu kolekciju sākuma laika noteikšana
    const batchSize = 100;
    let results;

    try {
        // fs.writeFileSync(csvFilePath, header, 'utf8');
        const header = `Iteration,StartTime,EndTime,Total,Errors,Sent,Received,${serviceNames.map(name => `${name},Code`).join(',')}\n`;

        for (let index = 0; index < iterations/batchSize ; index++) {
            const curLen = Math.min(batchSize, iterations - index*batchSize)
            console.log("i "+index + " -" + curLen);

            results = await Promise.all(
                Array.from({ length: curLen }, (_, i) => runCollection(i + 1))
            );
        // const results = await Promise.all(
        //     Array.from({ length: iterations }, (_, i) => runCollection(i + 1))
        // );

            results.forEach(({ iteration, timings, summary }) => {
                const row = [
                    iteration,
                    summary.startTime,
                    summary.endTime,
                    summary.totalRequests,
                    summary.totalErrors,
                    summary.requestData.sent,
                    summary.requestData.received,                
                    ...serviceNames.map(service => {
                        const timing = timings.find(t => t.name === service);
                        return timing ? `${timing.time},${timing.status}` : 'N/A,N/A';
                    })
                ].join(',');
    
                fs.appendFileSync(csvFilePath, row + '\n', 'utf8');
            });

        }

        const endTime = Date.now(); // Visu kolekciju pabeigšanas laiks
        console.log(`Executed ${iterations} iterations. Total execution time: ${endTime - startTime} ms. See details in ${csvFilePath}.`); // Aprēķināt kopējo izpildes laiku

        // console.log(results[0].timings);

    } catch (error) {
        console.error("Error during execution:", error.message);
        process.exit(1);
    }
})();
