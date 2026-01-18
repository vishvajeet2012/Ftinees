const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('./env');

if (!env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables.');
}

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const modelConfig = {
  model: 'gemini-2.0-flash-lite',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
  },
};

module.exports = {
  genAI,
  modelConfig,
};
