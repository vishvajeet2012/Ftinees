const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  duration: { type: String }, // "30 min", "45 sec"
  restTime: { type: String, default: "60 sec" },
  muscleGroup: { type: String } // chest, back, legs, cardio, etc.
});

const dayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true }, // 1-7
  dayName: { type: String }, // Monday, Tuesday, etc.
  isRestDay: { type: Boolean, default: false },
  exercises: [exerciseSchema]
});

const exercisePlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'general_fitness', 'endurance'],
    default: 'general_fitness'
  },
  durationWeeks: {
    type: Number,
    default: 4
  },
  daysPerWeek: {
    type: Number,
    default: 3
  },
  weeklyPlan: [dayPlanSchema],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate end date before saving
exercisePlanSchema.pre('save', function() {
  if (this.startDate && this.durationWeeks) {
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + (this.durationWeeks * 7));
    this.endDate = endDate;
  }
});

module.exports = mongoose.model('ExercisePlan', exercisePlanSchema);
