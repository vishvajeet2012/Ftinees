const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, metricController.logMetric);
router.get('/history', protect, metricController.getHistory);

module.exports = router;
