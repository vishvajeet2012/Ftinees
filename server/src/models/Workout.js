const mongoose = require('mongoose');
const { calculate1RM, calculateSetVolume } = require('../utils/fitnessUtils');

// Set Schema (Granular Data)
const setSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  rpe: { type: Number, min: 1, max: 10 }, // Rate of Perceived Exertion
  completed: { type: Boolean, default: true },
  estimated1RM: { type: Number } // Auto-calculated
});

// Exercise Log Schema (The Bucket)
const exerciseLogSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise', // We will build this later, or use string name for now
  },
  name: { type: String, required: true }, // Backup name if ID fails
  sets: [setSchema],
  bestSet1RM: { type: Number, default: 0 },
  volume: { type: Number, default: 0 },
  notes: String
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      default: 'Untitled Workout'
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    durationMinutes: {
      type: Number,
      default: 0
    },
    exercises: [exerciseLogSchema],
    totalVolume: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'planned'],
      default: 'completed'
    },
    // Vector Embedding for Semantic Search (RAG)
    embedding: {
      type: [Number],
      select: false // Don't fetch by default (large data)
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate analytics
workoutSchema.pre('save', function() {
  let workoutVolume = 0;

  this.exercises.forEach(exercise => {
    let exerciseVolume = 0;
    let max1RM = 0;

    exercise.sets.forEach(set => {
      // Calculate 1RM per set
      set.estimated1RM = calculate1RM(set.weight, set.reps);
      if (set.estimated1RM > max1RM) max1RM = set.estimated1RM;

      // Calculate Volume per set
      exerciseVolume += calculateSetVolume(set.weight, set.reps);
    });

    exercise.volume = exerciseVolume;
    exercise.bestSet1RM = max1RM;
    workoutVolume += exerciseVolume;
  });

  this.totalVolume = workoutVolume;
});

module.exports = mongoose.model('Workout', workoutSchema);
