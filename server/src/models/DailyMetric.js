const mongoose = require('mongoose');

const dailyMetricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    metrics: {
      weight: { type: Number }, // in kg
      steps: { type: Number },
      sleepHours: { type: Number },
      mood: {
        type: String,
        enum: ['happy', 'energetic', 'tired', 'stressed', 'neutral'],
      },
      waterIntake: { type: Number }, // in liters
      caloriesBurned: { type: Number } // Can be aggregated from workouts + BMR
    },
    notes: String
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one log per day per user (optional, but good practice)
// dailyMetricSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyMetric', dailyMetricSchema);
