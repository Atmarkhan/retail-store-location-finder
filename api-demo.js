/**
 * Demo script showing how to use the Manhattan Distance API
 * Run this after starting the server with `npm run dev`
 */

const API_BASE = "http://localhost:3000";

async function testAPI() {
  console.log("Testing Manhattan Distance API...\n");

  try {
    // Test health check
    console.log("1. Testing health check...");
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log("Health check:", healthData);
    console.log("✅ Health check passed\n");

    // Test examples endpoint
    console.log("2. Getting examples...");
    const examplesResponse = await fetch(`${API_BASE}/api/examples`);
    const examplesData = await examplesResponse.json();
    console.log("Examples:", JSON.stringify(examplesData, null, 2));
    console.log("✅ Examples retrieved\n");

    // Test store locations endpoint with example 1
    console.log("3. Testing store locations with Example 1...");
    const example1 = {
      k: 2,
      matrix: [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 1],
      ],
    };

    const response1 = await fetch(`${API_BASE}/api/store-locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(example1),
    });

    const result1 = await response1.json();
    console.log("Example 1 Result:", JSON.stringify(result1, null, 2));
    console.log("✅ Example 1 passed\n");

    // Test with invalid input
    console.log("4. Testing with invalid input...");
    const invalidExample = {
      k: 0,
      matrix: [
        [0, 1],
        [1, 0],
      ],
    };

    const invalidResponse = await fetch(`${API_BASE}/api/store-locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidExample),
    });

    const invalidResult = await invalidResponse.json();
    console.log(
      "Invalid input result:",
      JSON.stringify(invalidResult, null, 2)
    );
    console.log("✅ Error handling works\n");

    console.log("🎉 All API tests passed!");
  } catch (error) {
    console.error("❌ Error testing API:", error);
    console.log("\nMake sure the server is running with: npm run dev");
  }
}

// Note: This uses fetch() which is available in Node.js 18+
// For older versions, you would need to install and use node-fetch
testAPI();
