const MetricService = require('../services/MetricService');

class MetricController {
  // @desc    Log a new metric (or update today's)
  // @route   POST /api/metrics
  // @access  Private
  async logMetric(req, res, next) {
    try {
      const metric = await MetricService.logMetric(req.user._id, req.body);
      
      res.status(200).json({
        success: true,
        data: metric
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get metric history
  // @route   GET /api/metrics/history?days=30
  // @access  Private
  async getHistory(req, res, next) {
    try {
      const days = parseInt(req.query.days) || 30;
      const metrics = await MetricService.getMetricHistory(req.user._id, days);

      res.status(200).json({
        success: true,
        count: metrics.length,
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MetricController();
