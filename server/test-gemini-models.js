const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  "gemini-3-pro-preview",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-001",
  "gemini-pro",
  "gemini-1.0-pro"
];

async function testModels() {
  console.log("🔍 Testing Gemini Models with provided API Key...\n");

  for (const modelName of modelsToTest) {
    process.stdout.write(`Testing '${modelName}'... `);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you working?");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ SUCCESS!`);
      // console.log(`   Response: ${text.slice(0, 50)}...`);
    } catch (error) {
      if (error.message.includes("404")) {
        console.log(`❌ FAILED (404 Not Found)`);
      } else {
        console.log(`❌ FAILED (${error.message.split('\n')[0]})`);
      }
    }
  }
  console.log("\nDone.");
}

testModels();
