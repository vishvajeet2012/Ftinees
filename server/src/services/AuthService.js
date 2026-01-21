const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TFClient = require('../integrations/tfClient');
const myCache = require('../utils/cache');
const env = require('../config/env');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

class AuthService {
  /**
   * Registers a new user with AI-powered onboarding.
   */
  async registerUser(userData) {
    const { name, email, password, goal, height, weight, gender, age, location, pushups, fitnessLevel, activityLevel } = userData;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. BMI Calculation (Simple Logic)
    let bmi = null;
    if (height && weight) {
      bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    }

    // 4. Generate AI Insight (TensorFlow Prediction)
    let onboardingNote = 'Welcome to FitMetric!';
    let fitnessScore = 0;
    try {
      if (height && weight && age) {
        const score = await TFClient.predictFitnessScore({
          weight, height, age, activityLevel, gender, pushups, fitnessLevel
        });
        fitnessScore = score;
        onboardingNote = `Your AI-calculated Fitness Score is ${score}/100. Let's improve it!`;
      }
    } catch (err) {
      console.warn('TF Prediction failed, using default.');
    }

    // 5. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      goal,
      height,
      weight,
      gender,
      age,
      location,
      pushups,
      fitnessLevel,
      activityLevel,
      onboardingNote,
      fitnessScore,
    });

    // 6. Warm Cache
    myCache.set(`user_${user._id}`, user.toObject());

    // 7. Generate Token
    const token = this.generateToken(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      onboardingNote: user.onboardingNote,
      token,
    };
  }

  /**
   * Logs in an existing user.
   */
  async loginUser(email, password) {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 3. Warm cache
    myCache.set(`user_${user._id}`, user.toObject());

    // 4. Generate token
    const token = this.generateToken(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  generateToken(id) {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Allowed fields to update
    const allowedUpdates = [
      'name', 'goal', 'height', 'weight', 'gender', 
      'age', 'location', 'pushups', 'fitnessLevel', 'activityLevel'
    ];

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    // Special handling if weight is updated (Recalculate BMI maybe? For now just save)
    
    await user.save();
    
    // Update cache
    myCache.set(`user_${user._id}`, user.toObject());

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      ...updateData
    };
  }
}

module.exports = new AuthService();
