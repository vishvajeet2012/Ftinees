const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Generate new plan
router.post('/generate', planController.generatePlan);

// Get current active plan
router.get('/current', planController.getCurrentPlan);

// Get all plans (history)
router.get('/', planController.getAllPlans);

// Complete/Archive a plan
router.put('/:id/complete', planController.completePlan);

module.exports = router;
