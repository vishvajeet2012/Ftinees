const dotenv = require('dotenv');

// Load env vars
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fitmetric',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  N8N_URL_LOCAL: process.env.N8N_URL_LOCAL || 'http://localhost:5678',
  N8N_URL_PROD: process.env.N8N_URL_PROD,
  FITMETRIC_SECRET: process.env.FITMETRIC_SECRET || 'dev-secret-123',
};
