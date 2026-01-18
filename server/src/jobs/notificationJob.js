const cron = require('node-cron');
const GeminiClient = require('../integrations/geminiClient');
const Workout = require('../models/Workout');
// const User = require('../models/User'); // Assuming User model exists

/**
 * Notification Job
 * Runs every Sunday at 9:00 AM to send weekly summaries.
 * Cron Syntax: '0 9 * * 0' = At 09:00 on Sunday.
 */
const startNotificationJob = () => {
  console.log('Initializing Notification Job...');

  cron.schedule('0 9 * * 0', async () => {
    console.log('Running Weekly Notification Job...');

    try {
      // In a real app, we would fetch users. For demo, we mock a user.
      const mockUser = { _id: 'user123', name: 'Alex' }; // User.find({})

      // 1. Fetch data from Service/Repository
      const workouts = await Workout.find({ user: mockUser._id });

      // Calculate stats (Logic could be in a Service)
      const totalVolume = workouts.reduce((acc, curr) => acc + curr.totalVolume, 0);
      const daysActive = workouts.length;
      const stats = { totalVolume, daysActive };

      // 2. Use Gemini Integration to generate content
      const message = await GeminiClient.generateNotification(mockUser.name, stats);

      // 3. Send Notification (Mock send)
      console.log(`[NOTIFICATION SENT to ${mockUser.name}]: ${message}`);

    } catch (error) {
      console.error('Error in Notification Job:', error);
    }
  });
};

module.exports = startNotificationJob;
