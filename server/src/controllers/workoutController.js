const WorkoutService = require('../services/WorkoutService');

class WorkoutController {
  // @desc    Create new workout
  // @route   POST /api/workouts
  // @access  Public (or Private if Auth added)
  async createWorkout(req, res, next) {
    try {
      // Securely link workout to the authenticated user
      const workoutData = { ...req.body, user: req.user._id };
      const workout = await WorkoutService.createWorkout(workoutData);
      
      res.status(201).json({
        success: true,
        data: workout,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get AI feedback for a workout
  // @route   GET /api/workouts/:id/feedback
  async getWorkoutFeedback(req, res, next) {
    try {
      const feedback = await WorkoutService.getWorkoutFeedback(req.params.id);
      res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get user workouts
  // @route   GET /api/workouts/user/:userId
  async getUserWorkouts(req, res, next) {
    try {
      const workouts = await WorkoutService.getUserWorkouts(req.params.userId);
      res.status(200).json({
        success: true,
        count: workouts.length,
        data: workouts,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkoutController();
