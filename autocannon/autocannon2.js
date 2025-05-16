const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

// Helper function to run autocannon tests
function runAutocannon(url, options) {
  return new Promise((resolve, reject) => {
    autocannon({
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body || undefined,
      duration: options.duration || 10, // Default 10 seconds
      connections: options.connections || 10, // Default 10 concurrent connections
      pipelining: options.pipelining || 1,
      timeout: options.timeout || 10000,
      ...options
    }, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Extract request data from Postman collection
function extractRequestsFromCollection(collectionPath, environmentPath) {
  // Load collection and environment
  const collection = require(collectionPath);
  const environment = environmentPath ? require(environmentPath) : null;
  
  // Process environment variables
  const envVars = {};
  if (environment && environment.values) {
    environment.values.forEach(v => {
      if (v.enabled !== false) {
        envVars[v.key] = v.value;
      }
    });
  }
  
  // Helper function to generate dynamic values
  function generateDynamicValue(varName) {
    const uniqueId = Math.random().toString(36).substring(2, 8) + '_' + Date.now();
    
    if (varName.includes('uniqueName')) {
      return `User_${uniqueId}`;
    }
    if (varName.includes('uniqueEmail')) {
      return `user_${uniqueId}@example.com`;
    }
    if (varName.includes('user_id') && envVars.user_id) {
      return envVars.user_id;
    }
    return null;
  }
  
  // Replace variables in a string
  function replaceVars(str) {
    if (!str) return str;
    return str.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      // First try to get value from environment variables
      if (envVars[varName] !== undefined) {
        return envVars[varName];
      }
      // If not found in environment, try to generate dynamic value
      const dynamicValue = generateDynamicValue(varName);
      if (dynamicValue !== null) {
        return dynamicValue;
      }
      return match;
    });
  }
  
  // Process items recursively
  function processItems(items, requests = []) {
    if (!items) return requests;
    
    items.forEach(item => {
      if (item.request) {
        // This is a request item
        const req = item.request;
        let url;
        
        if (typeof req.url === 'string') {
          url = replaceVars(req.url);
        } else if (req.url && req.url.raw) {
          url = replaceVars(req.url.raw);
        }
        
        // Skip if no valid URL
        if (!url) return;
        
        // Process headers
        const headers = {};
        if (req.header) {
          req.header.forEach(h => {
            if (h.disabled !== true) {
              headers[h.key] = replaceVars(h.value);
            }
          });
        }
        
        // Process body
        let body;
        if (req.body) {
          if (req.body.mode === 'raw' && req.body.raw) {
            body = replaceVars(req.body.raw);
          } else if (req.body.mode === 'urlencoded' && req.body.urlencoded) {
            const params = new URLSearchParams();
            req.body.urlencoded.forEach(p => {
              if (p.disabled !== true) {
                params.append(p.key, replaceVars(p.value));
              }
            });
            body = params.toString();
          } else if (req.body.mode === 'formdata' && req.body.formdata) {
            // Handle form data (simplified version - doesn't handle file uploads)
            const formData = {};
            req.body.formdata.forEach(p => {
              if (p.disabled !== true && p.type !== 'file') {
                formData[p.key] = replaceVars(p.value);
              }
            });
            body = JSON.stringify(formData);
          }
        }
        
        requests.push({
          name: item.name,
          url,
          method: req.method,
          headers,
          body
        });
      }
      
      // Process folders recursively
      if (item.item) {
        processItems(item.item, requests);
      }
    });
    
    return requests;
  }
  
  return processItems(collection.item || []);
}

// Main function
async function main() {
  // Parse command-line arguments
  const collectionPath = path.resolve(process.argv[2] || './collection.json');
  const environmentPath = process.argv[3] ? path.resolve(process.argv[3]) : null;
  const outputFile = process.argv[4] || './autocannon-results.csv';
  const duration = parseInt(process.argv[5], 10) || 10; // Duration in seconds
  const connections = parseInt(process.argv[6], 10) || 10; // Concurrent connections
  
  console.log(`Collection: ${collectionPath}`);
  console.log(`Environment: ${environmentPath || 'Not specified'}`);
  console.log(`Duration: ${duration} seconds per endpoint`);
  console.log(`Connections: ${connections} concurrent connections`);
  console.log(`Results will be saved to: ${outputFile}`);
  
  try {
    // First, extract all requests from the Postman collection
    const requests = extractRequestsFromCollection(collectionPath, environmentPath);
    
    if (requests.length === 0) {
      console.error('No valid requests found in the collection.');
      process.exit(1);
    }
    
    console.log(`Found ${requests.length} requests in the collection.`);
    
    // Prepare CSV header
    const csvHeader = 'Endpoint,Method,URL,Connections,Duration (s),Average Latency (ms),Min Latency (ms),Max Latency (ms),Std Dev,Requests/Sec,Throughput (KB/s),Success Rate (%),2xx,3xx,4xx,5xx,Errors\n';
    fs.writeFileSync(outputFile, csvHeader, 'utf8');
    
    // Summary variables
    const summaryData = {
      totalRequests: 0,
      totalErrors: 0,
      avgLatency: 0,
      avgThroughput: 0,
      successfulEndpoints: 0
    };
    
    const startTime = Date.now();
    
    // Run tests sequentially for each request
    for (const request of requests) {
      console.log(`Testing endpoint: ${request.name} (${request.method} ${request.url})`);
      
      const options = {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duration,
        connections
      };
      
      try {
        const results = await runAutocannon(request.url, options);
        
        // Calculate success rate
        const totalResponses = results.statusCodeStats['2xx'] + 
                             results.statusCodeStats['3xx'] + 
                             results.statusCodeStats['4xx'] + 
                             results.statusCodeStats['5xx'];
        const successRate = totalResponses > 0 ? 
          ((results.statusCodeStats['2xx'] + results.statusCodeStats['3xx']) / totalResponses) * 100 : 0;
        
        // Update summary data
        summaryData.totalRequests += results.requests.total;
        summaryData.totalErrors += results.errors;
        summaryData.avgLatency += results.latency.average;
        summaryData.avgThroughput += results.throughput.average;
        summaryData.successfulEndpoints++;
        
        // Log and save results
        const resultRow = [
          request.name,
          request.method,
          request.url,
          connections,
          duration,
          results.latency.average.toFixed(2),
          results.latency.min,
          results.latency.max,
          results.latency.stddev.toFixed(2),
          results.requests.average.toFixed(2),
          (results.throughput.average / 1024).toFixed(2), // KB/s
          successRate.toFixed(2),
          results.statusCodeStats['2xx'] || 0,
          results.statusCodeStats['3xx'] || 0,
          results.statusCodeStats['4xx'] || 0,
          results.statusCodeStats['5xx'] || 0,
          results.errors
        ].join(',');
        
        fs.appendFileSync(outputFile, resultRow + '\n', 'utf8');
        
        console.log(`  Average: ${results.latency.average.toFixed(2)} ms | Requests/sec: ${results.requests.average.toFixed(2)} | Success: ${successRate.toFixed(2)}%`);
      } catch (error) {
        console.error(`  Error testing ${request.name}: ${error.message}`);
        
        // Record error in CSV
        const errorRow = [
          request.name,
          request.method,
          request.url,
          connections,
          duration,
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          0,
          0,
          0,
          0,
          0,
          error.message.replace(/,/g, ';')
        ].join(',');
        
        fs.appendFileSync(outputFile, errorRow + '\n', 'utf8');
      }
    }
    
    const endTime = Date.now();
    const totalExecutionTime = (endTime - startTime) / 1000;
    
    // Calculate and write summary
    if (summaryData.successfulEndpoints > 0) {
      summaryData.avgLatency /= summaryData.successfulEndpoints;
      summaryData.avgThroughput /= summaryData.successfulEndpoints;
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total execution time: ${totalExecutionTime.toFixed(2)} seconds`);
    console.log(`Total requests made: ${summaryData.totalRequests}`);
    console.log(`Total errors: ${summaryData.totalErrors}`);
    console.log(`Average latency: ${summaryData.avgLatency.toFixed(2)} ms`);
    console.log(`Average throughput: ${(summaryData.avgThroughput / 1024).toFixed(2)} KB/s`);
    console.log(`\nBenchmarking completed. Results saved to ${outputFile}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});