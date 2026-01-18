const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    muscleGroup: {
      type: String,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body'],
      required: true
    },
    category: {
      type: String,
      enum: ['strength', 'hypertrophy', 'endurance', 'flexibility'],
      default: 'strength'
    },
    equipment: {
      type: String,
      default: 'none' // dumbbell, barbell, machine, bodyweight
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    instructions: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
