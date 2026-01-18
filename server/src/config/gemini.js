const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('./env');

if (!env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables.');
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// You can configure different models here (e.g., gemini-pro, gemini-pro-vision)
const modelConfig = {
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
  },
};

module.exports = {
  genAI,
  modelConfig,
};
