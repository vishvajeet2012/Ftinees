const express = require('express');
const router = express.Router();
const { z } = require('zod');
const workoutController = require('../controllers/workoutController');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/authMiddleware');

// Zod Schema for creating a workout
const createWorkoutSchema = z.object({
  body: z.object({
    // User ID is inferred from the token, so we don't need it in body
    name: z.string().optional(),
    durationMinutes: z.number().optional(),
    date: z.string().datetime().optional(), // ISO String
    exercises: z.array(
      z.object({
        name: z.string().min(1, 'Exercise name is required'),
        sets: z.array(
          z.object({
            weight: z.number().min(0),
            reps: z.number().int().positive(),
            rpe: z.number().min(1).max(10).optional()
          })
        ).min(1, 'At least one set is required')
      })
    ).min(1, 'At least one exercise is required'),
  }),
});

// Routes
router.post(
  '/',
  protect,
  validate(createWorkoutSchema),
  workoutController.createWorkout
);

router.get('/:id/feedback', protect, workoutController.getWorkoutFeedback);
router.get('/user/:userId', protect, workoutController.getUserWorkouts);

module.exports = router;
