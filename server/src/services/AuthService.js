const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GeminiClient = require('../integrations/geminiClient');
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

    // 4. Generate AI Insight (Async but awaited for onboarding impact)
    // NOTE: In high traffic, you might want to do this in background.
    // For "Pro" onboarding experience, we await it to show immediately.
    let onboardingNote = 'Welcome to FitMetric!';
    try {
      const insight = await GeminiClient.generateOnboardingInsight({
        name,
        goal,
        bmi,
        age,
        gender,
        fitnessLevel,
        activityLevel
      });
      if (insight) onboardingNote = insight;
    } catch (err) {
      console.warn('AI Onboarding failed, using default.');
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
}

module.exports = new AuthService();
