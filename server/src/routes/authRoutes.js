const express = require('express');
const router = express.Router();
const { z } = require('zod');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/authMiddleware');

// Zod Schema for Registration
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    gender: z.enum(['male', 'female', 'other']),
    age: z.number().int().positive(),
    location: z.object({
      country: z.string().min(1, 'Country is required'),
      state: z.string().min(1, 'State is required'),
      district: z.string().optional(),
      town: z.string().optional(),
    }),
    goal: z.enum(['muscle_gain', 'weight_loss', 'maintenance', 'strength']).optional(),
    fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']).optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    pushups: z.number().int().min(0).optional(),
  }),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
