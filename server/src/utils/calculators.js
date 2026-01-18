/**
 * FitMetric Calculator Utilities
 * Helper functions for fitness calculations.
 */

/**
 * Calculates One-Rep Max (1RM) using the Epley formula.
 * Formula: Weight * (1 + Reps / 30)
 * @param {number} weight - Weight lifted in kg.
 * @param {number} reps - Number of repetitions performed.
 * @returns {number} - Estimated 1RM in kg (rounded to 1 decimal).
 */
const calculateOneRepMax = (weight, reps) => {
  if (reps === 1) return weight;
  const oneRepMax = weight * (1 + reps / 30);
  return Math.round(oneRepMax * 10) / 10;
};

/**
 * Calculates Volume Load.
 * @param {number} sets
 * @param {number} reps
 * @param {number} weight
 * @returns {number}
 */
const calculateVolume = (sets, reps, weight) => {
  return sets * reps * weight;
};

module.exports = {
  calculateOneRepMax,
  calculateVolume,
};
