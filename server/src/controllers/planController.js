const ExercisePlan = require('../models/ExercisePlan');
const { generateExercisePlan } = require('../services/planService');

const planController = {
  /**
   * Generate a new exercise plan for user
   * POST /api/plans/generate
   */
  generatePlan: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = req.user;

      // Check if user already has an active plan
      const existingPlan = await ExercisePlan.findOne({ userId, status: 'active' });
      if (existingPlan) {
        return res.status(200).json({
          success: true,
          message: 'Active plan already exists',
          data: existingPlan
        });
      }

      // Generate plan based on user data
      const planData = generateExercisePlan({
        fitnessScore: user.fitnessScore || 50,
        fitnessLevel: user.fitnessLevel,
        goal: req.body.goal || 'general_fitness',
        activityLevel: user.activityLevel
      });

      // Create and save the plan
      const newPlan = await ExercisePlan.create({
        userId,
        ...planData
      });

      res.status(201).json({
        success: true,
        message: 'Exercise plan generated successfully',
        data: newPlan
      });
    } catch (error) {
      console.error('Generate plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate exercise plan',
        error: error.message
      });
    }
  },

  /**
   * Get current active plan for user
   * GET /api/plans/current
   */
  getCurrentPlan: async (req, res) => {
    try {
      const userId = req.user._id;

      const plan = await ExercisePlan.findOne({ userId, status: 'active' });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'No active plan found'
        });
      }

      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Get plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get exercise plan',
        error: error.message
      });
    }
  },

  /**
   * Get all plans for user (history)
   * GET /api/plans
   */
  getAllPlans: async (req, res) => {
    try {
      const userId = req.user._id;

      const plans = await ExercisePlan.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: plans.length,
        data: plans
      });
    } catch (error) {
      console.error('Get all plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get exercise plans',
        error: error.message
      });
    }
  },

  /**
   * Complete/Archive current plan
   * PUT /api/plans/:id/complete
   */
  completePlan: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const plan = await ExercisePlan.findOneAndUpdate(
        { _id: id, userId },
        { status: 'completed' },
        { new: true }
      );

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Plan not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Plan marked as completed',
        data: plan
      });
    } catch (error) {
      console.error('Complete plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete plan',
        error: error.message
      });
    }
  }
};

module.exports = planController;
