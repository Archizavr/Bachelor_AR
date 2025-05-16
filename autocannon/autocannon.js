const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');
const vm = require('vm'); // For executing pre-request scripts

// Helper function to run autocannon tests
async function runAutocannon(url, options) {
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

// Helper function to evaluate scripts (e.g., pre-request)
function executeScript(script, variables) {
  const sandbox = { pm: { variables }, console };
  vm.createContext(sandbox);
  try {
    vm.runInContext(script, sandbox);
  } catch (err) {
    console.error(`Error executing script: ${err.message}`);
  }
}

// Replace variables in a string
function replaceVars(str, envVars) {
  if (!str) return str;
  return str.replace(/\{\{([^}]+)\}\}/g, (_, varName) => {
    return envVars[varName] !== undefined ? envVars[varName] : _;
  });
}

// Extract and resolve requests from Postman collection
function extractRequestsFromCollection(collectionPath, environmentPath) {
  const collection = require(collectionPath);
  const environment = environmentPath ? require(environmentPath) : null;

  const envVars = {};
  if (environment && environment.values) {
    environment.values.forEach(v => {
      if (v.enabled !== false) envVars[v.key] = v.value;
    });
  }

  const requests = [];

  function processItems(items) {
    items.forEach(item => {
      if (item.request) {
        const req = item.request;
        const url = replaceVars(req.url.raw || req.url, envVars);

        // Pre-request scripts
        if (item.event) {
          item.event.forEach(event => {
            if (event.listen === 'prerequest') {
              executeScript(event.script.exec.join('\n'), envVars);
            }
          });
        }

        const headers = {};
        if (req.header) {
          req.header.forEach(h => {
            if (!h.disabled) headers[h.key] = replaceVars(h.value, envVars);
          });
        }

        let body = req.body?.raw ? replaceVars(req.body.raw, envVars) : undefined;

        requests.push({
          name: item.name,
          url,
          method: req.method,
          headers,
          body
        });
      }

      if (item.item) processItems(item.item);
    });
  }

  processItems(collection.item);
  return requests;
}

// Main function
async function main() {
  const collectionPath = path.resolve(process.argv[2] || './collection.json');
  const environmentPath = process.argv[3] ? path.resolve(process.argv[3]) : null;
  const outputFile = process.argv[4] || './autocannon-results.csv';
  const duration = parseInt(process.argv[5], 10) || 10;
  const connections = parseInt(process.argv[6], 10) || 10;

  try {
    const requests = extractRequestsFromCollection(collectionPath, environmentPath);

    if (requests.length === 0) {
      console.error('No valid requests found.');
      process.exit(1);
    }

    fs.writeFileSync(outputFile, 'Name,URL,Method,Requests/sec,Latency Avg,Latency Max,Errors\n', 'utf8');

    for (const req of requests) {
      try {
        const results = await runAutocannon(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body,
          duration,
          connections
        });

        fs.appendFileSync(outputFile, `${req.name},${req.url},${req.method},${results.requests.average},${results.latency.average},${results.latency.max},${results.errors}\n`, 'utf8');
      } catch (err) {
        console.error(`Error for ${req.name}: ${err.message}`);
      }
    }

    console.log('Benchmarking complete. Results saved to:', outputFile);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
