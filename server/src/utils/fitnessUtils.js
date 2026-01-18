/**
 * Fitness Calculation Utilities
 * Standard formulas used across the application.
 */

// Epley Formula for 1 Rep Max
// 1RM = Weight * (1 + Reps/30)
const calculate1RM = (weight, reps) => {
  if (!weight || !reps) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

// Calculate Volume for a set (Weight * Reps)
const calculateSetVolume = (weight, reps) => {
  return (weight || 0) * (reps || 0);
};

// Estimate Calories Burned (Very rough estimate based on METs)
// Standard Weight Training MET ~ 3.5 to 6.0 depending on intensity
const estimateCalories = (durationMinutes, bodyWeightKg = 70, intensity = 'moderate') => {
  const met = intensity === 'high' ? 6.0 : intensity === 'low' ? 3.5 : 4.8;
  // Calories = MET * Weight(kg) * Time(hours)
  return Math.round(met * bodyWeightKg * (durationMinutes / 60));
};

module.exports = {
  calculate1RM,
  calculateSetVolume,
  estimateCalories
};
