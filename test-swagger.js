#!/usr/bin/env node

const http = require("http");

const BASE_URL = "http://localhost:3000";

function makeRequest(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log("🧪 Testing Manhattan Distance API with Swagger Documentation\n");

  try {
    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await makeRequest("/health");
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Response: ${healthResponse.body.substring(0, 100)}...\n`);

    // Test examples endpoint
    console.log("2. Testing examples endpoint...");
    const examplesResponse = await makeRequest("/api/examples");
    console.log(`   Status: ${examplesResponse.statusCode}`);
    console.log(`   Response: ${examplesResponse.body.substring(0, 100)}...\n`);

    // Test Swagger documentation endpoints
    console.log("3. Testing Swagger documentation...");
    const swaggerResponse = await makeRequest("/api-docs.json");
    console.log(`   Status: ${swaggerResponse.statusCode}`);
    console.log(`   Content-Type: ${swaggerResponse.headers["content-type"]}`);
    console.log(
      `   Response length: ${swaggerResponse.body.length} characters\n`
    );

    // Test main API endpoint
    console.log("4. Testing store locations endpoint...");
    const testData = {
      k: 2,
      matrix: [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 1],
      ],
    };
    const apiResponse = await makeRequest(
      "/api/store-locations",
      "POST",
      testData
    );
    console.log(`   Status: ${apiResponse.statusCode}`);
    console.log(`   Response: ${apiResponse.body.substring(0, 200)}...\n`);

    // Test K=4 example
    console.log("5. Testing K=4 example...");
    const k4Data = {
      k: 4,
      matrix: [
        [0, 0, 0, 1],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    };
    const k4Response = await makeRequest(
      "/api/store-locations",
      "POST",
      k4Data
    );
    console.log(`   Status: ${k4Response.statusCode}`);
    const k4Result = JSON.parse(k4Response.body);
    console.log(`   Valid locations found: ${k4Result.data.count}`);
    console.log(`   Processing time: ${k4Result.data.processingTime}ms\n`);

    console.log("✅ All tests completed successfully!");
    console.log("\n📖 Access the Swagger documentation at:");
    console.log(`   ${BASE_URL}/api-docs`);
    console.log("\n🐳 Docker commands:");
    console.log("   docker build -t manhattan-distance-api .");
    console.log("   docker run -p 3000:3000 manhattan-distance-api");
    console.log("\n☁️  Deploy to Google Cloud Run:");
    console.log("   git push origin main  # CI/CD will handle deployment");
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    console.log("\n💡 Make sure the server is running:");
    console.log("   npm run dev  # or npm start");
    process.exit(1);
  }
}

testAPI();
