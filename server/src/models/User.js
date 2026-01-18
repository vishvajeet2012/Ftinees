const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Please select a gender'],
    },
    age: {
      type: Number,
      required: [true, 'Please add your age'],
    },
    location: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String },
      town: { type: String },
    },
    goal: {
      type: String,
      enum: ['muscle_gain', 'weight_loss', 'maintenance', 'strength'],
      default: 'maintenance',
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
      default: 'sedentary',
    },
    weight: { type: Number }, // Current Weight
    height: { type: Number }, // Height in cm
    pushups: { type: Number, default: 0 }, // Max concurrent pushups
    onboardingNote: {
      type: String, // AI Generated Welcome Message
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
