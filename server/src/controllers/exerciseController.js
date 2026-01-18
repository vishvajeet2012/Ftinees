const ExerciseService = require('../services/ExerciseService');

class ExerciseController {
  // @desc    Get all standard exercises
  // @route   GET /api/exercises
  // @access  Public (or Private)
  async getAllExercises(req, res, next) {
    try {
      const exercises = await ExerciseService.getAllExercises();
      res.status(200).json({
        success: true,
        count: exercises.length,
        data: exercises
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExerciseController();
