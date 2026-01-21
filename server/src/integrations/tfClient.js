const tf = require('@tensorflow/tfjs');

class TFClient {
  constructor() {
    console.log('TensorFlow Client Initialized');
  }

  /**
   * Predicts a Fitness Score (0-100) based on user metrics using Tensor operations.
   * This is a linear regression style calculation implemented via Tensors.
   * 
  /**
   * Predicts a Fitness Score (0-100) based on user metrics using Tensor operations.
   * IMPROVED: Now includes Pushups and Fitness Level for higher accuracy.
   * 
   * Input Vector: [BMI, Age, ActivityScore, Pushups, FitnessLevelScore]
   */
  async predictFitnessScore(userData) {
    try {
      const { weight, height, age, activityLevel, gender, pushups = 0, fitnessLevel = 'beginner' } = userData;

      // 1. Preprocess Data
      const h_meters = height / 100;
      const bmi = weight / (h_meters * h_meters);
      
      let activityScore = 1;
      const activityMap = {
        'sedentary': 1.0,
        'lightly_active': 1.2,
        'moderately_active': 1.4,
        'very_active': 1.6,
        'extra_active': 1.8
      };
      if (activityMap[activityLevel]) activityScore = activityMap[activityLevel];

      let fitnessLevelScore = 1;
      const fitnessMap = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3
      };
      if (fitnessMap[fitnessLevel]) fitnessLevelScore = fitnessMap[fitnessLevel];

      // Gender Bias (Slight adjustment for BMR-like logic)
      const genderBias = gender === 'female' ? -5 : 0; 

      // 2. Create Tensors
      // Features: [BMI, Age, ActivityScore, Pushups, FitnessLevelScore]
      const inputTensor = tf.tensor2d([[bmi, age, activityScore, pushups, fitnessLevelScore]]);
      
      // Weights (Heuristic / Rule-based for now)
      // These act as the "Knowledge" of the expert system before training
      const weights = tf.tensor2d([
        [-0.4],  // BMI: High BMI slightly lowers score (unless muscular, handled by pushups)
        [-0.15], // Age: Slight decline with age
        [8.0],   // Activity: Boosts score significantly
        [1.5],   // Pushups: Each pushup adds 1.5 points (Direct Strength Measure)
        [5.0]    // Fitness Level: Adds base points (Self-assessed)
      ]);

      const bias = tf.scalar(50 + genderBias); // Base score

      // 3. Perform Matrix Multiplication: y = mx + b
      const prediction = inputTensor.matMul(weights).add(bias);

      // 4. Get Data
      let score = (await prediction.data())[0];
      
      // Normalize to 0-100
      if (score < 10) score = 10;
      if (score > 100) score = 100;

      // Clean up
      inputTensor.dispose();
      weights.dispose();
      bias.dispose();
      prediction.dispose();

      return Math.round(score);
    } catch (error) {
      console.error('TF Prediction Error:', error);
      return 50; 
    }
  }

  /**
   * [FUTURE USE] Train a Neural Network on Real User Data
   * This code is prepared for when we have >100 users in the database.
   * 
   * @param {Array} trainingData - Array of { inputs: [], output: score }
   */
  async trainOnRealData(trainingData) {
    console.log('Starting training sequence...');
    
    // 1. Define Model Architecture
    const model = tf.sequential();
    
    // Input Layer (5 features: BMI, Age, Activity, Pushups, FitnessLevel)
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [5] }));
    
    // Hidden Layer
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    
    // Output Layer (1 unit: Fitness Score)
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

    // 2. Compile Model
    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    console.log('Model Compiled. Ready to fit data (Uncomment logic below when data is available).');
    
    /* 
    // Data Preparation Logic
    const inputs = trainingData.map(d => d.inputs);
    const labels = trainingData.map(d => d.output);

    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    // Train
    await model.fit(xs, ys, {
      epochs: 50,
      callbacks: {
        onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs.loss}`)
      }
    });

    // Save Model
    await model.save('file://./trained-model');
    */
  }
}

module.exports = new TFClient();
