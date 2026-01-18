const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing");
  process.exit(1);
}

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log(`📡 Fetching models from: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

  try {
    const response = await axios.get(url);
    const models = response.data.models;
    
    if (!models || models.length === 0) {
      console.log("⚠️ No models found for this API Key.");
    } else {
      console.log(`✅ Found ${models.length} models:`);
      models.forEach(m => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
          console.log(`   - ${m.name}`);
        }
      });
    }
  } catch (error) {
    console.error("❌ API Request Failed:");
    if (error.response) {
      console.error(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.error(`   Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

listModels();
