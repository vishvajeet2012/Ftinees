const axios = require('axios');

// Random email to avoid "User already exists" error
const randomId = Math.floor(Math.random() * 10000);
const email = `testuser${randomId}@example.com`;

const dummyData = {
  name: "Test User",
  email: email,
  password: "password123",
  gender: "male",
  age: 25,
  location: {
    country: "India",
    state: "Rajasthan",
    district: "Jaipur",
    town: "Malviya Nagar"
  },
  goal: "muscle_gain",
  fitnessLevel: "intermediate",
  activityLevel: "moderately_active",
  weight: 75,
  height: 175,
  pushups: 30
};

async function testRegistration() {
  console.log('🚀 Testing Registration API...');
  console.log(`📡 Target endpoint: http://localhost:5000/api/auth/register`);
  console.log(`📦 Payload:`, dummyData);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', dummyData);
    
    console.log('\n✅ Registration Successful!');
    console.log('🟢 Status:', response.status);
    console.log('📄 Data:', response.data);
    
    if (response.data.token) {
      console.log('\n🔐 Token received successfully (Setup complete)');
    }

  } catch (error) {
    console.log('\n❌ Registration Failed!');
    if (error.response) {
      console.log('🔴 Status:', error.response.status);
      console.log('📄 Error Data:', error.response.data);
    } else {
      console.log('Error Message:', error.message);
      console.log('Is the server running on port 5000?');
    }
  }
}

testRegistration();
