const DailyMetric = require('../models/DailyMetric');

class MetricService {
  /**
   * Log a daily metric (Weight, Steps, etc.)
   * Upserts for the current day if one already exists.
   */
  async logMetric(userId, data) {
    // Current date (start of day) to ensure only one entry per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Using findOneAndUpdate with upsert
    // This allows updating partial fields (e.g. logging steps now, weight later)
    const metric = await DailyMetric.findOneAndUpdate(
      { user: userId, date: today },
      { 
        $set: { ...data }, // Update provided fields
        $setOnInsert: { user: userId, date: today } // Set strictly on insert
      },
      { new: true, upsert: true }
    );

    return metric;
  }

  /**
   * Get metrics history for charts
   * Default: Last 30 days
   */
  async getMetricHistory(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await DailyMetric.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 }); // Sort by date ascending for charts
  }
}

module.exports = new MetricService();
