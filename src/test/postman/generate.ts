import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as Converter from 'openapi-to-postmanv2';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_URL = 'http://localhost:3000/v1/api-json';
const OUTPUT_FILE = path.join(__dirname, 'api_collection.json');

async function generate() {
  try {
    console.log(`Fetching Swagger JSON from ${SWAGGER_URL}...`);
    const response = await axios.get(SWAGGER_URL);
    const openapiData = response.data;

    console.log('Converting OpenAPI to Postman Collection...');
    Converter.convert({ type: 'json', data: openapiData }, {
      schemaFaker: true,
      requestParametersResolution: 'Example',
      exampleParametersResolution: 'Example'
    }, (err: any, conversionResult: any) => {
      if (!conversionResult.result) {
        console.error('Could not convert', conversionResult.reason);
        return;
      }

      let collection = conversionResult.output[0].data;

      // Inject standard tests into each request
      console.log('Injecting standard tests (Status + Schema)...');
      injectTests(collection.item);

      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collection, null, 2));
      console.log(`Successfully generated collection at ${OUTPUT_FILE}`);
    });
  } catch (error) {
    console.error('Error fetching or converting:', error);
    process.exit(1);
  }
}

function injectTests(items: any[]) {
  items.forEach(item => {
    if (item.item) {
      // It's a folder, recurse
      injectTests(item.item);
    } else if (item.request) {
      // It's a request, add tests
      if (!item.event) item.event = [];
      
      const method = item.request.method || 'GET';
      let expectedStatus = '200';
      if (method === 'POST') expectedStatus = '201';
      else if (method === 'DELETE') expectedStatus = '204';

      const testScript = `
// Standard status code test for ${method}
pm.test("Status code is ${expectedStatus}", function () {
    pm.response.to.have.status(${expectedStatus});
});

// Standard schema validation (if response body is JSON)
pm.test("Response is valid JSON", function () {
    if (pm.response.code !== 204) {
        const contentType = pm.response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            pm.response.to.be.withBody;
            pm.response.to.be.json;
        } else {
            // Optional: log if we skipped JSON validation
            console.log("Skipping JSON validation for content-type: " + contentType);
        }
    }
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Capture ID for subsequent requests if it's a creation
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    if (jsonData && jsonData.id) {
        // Try to determine the entity name from the URL
        const path = pm.request.url.path;
        const entityName = path[path.length - 1] || 'last';
        pm.collectionVariables.set(entityName + "Id", jsonData.id);
        console.log("Captured ID for environment: " + entityName + "Id = " + jsonData.id);
    }
}
      `.trim();

      item.event.push({
        listen: "test",
        script: {
          exec: testScript.split('\n'),
          type: "text/javascript"
        }
      });
    }
  });
}

generate();
