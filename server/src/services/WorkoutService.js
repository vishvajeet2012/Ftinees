const Workout = require('../models/Workout');
const GeminiClient = require('../integrations/geminiClient');

class WorkoutService {
  /**
   * Create a new workout
   * Volume and analytics are auto-calculated by the Model hook.
   */
  async createWorkout(data) {
    const workout = new Workout(data);
    return await workout.save();
  }

  /**
   * Get feedback on the workout using Gemini AI (RAG Implementation)
   */
  async getWorkoutFeedback(workoutId) {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      throw new Error('Workout not found');
    }

    // 1. RAG: Retrieve Context (Last 5 Workouts)
    const history = await Workout.find({ 
      user: workout.user, 
      _id: { $ne: workoutId }, // Exclude current
      status: 'completed'
    })
    .sort({ date: -1 })
    .limit(5)
    .select('name date totalVolume exercises');

    const historySummary = history.map(w => 
      `- ${w.date.toDateString()}: ${w.name} (Vol: ${w.totalVolume}kg)`
    ).join('\n');

    // 2. Format Current Session
    const exerciseSummary = workout.exercises.map(ex => {
      const bestSet = ex.sets.reduce((max, set) => set.weight > max ? set.weight : max, 0);
      return `- ${ex.name}: ${ex.sets.length} sets (Best: ${bestSet}kg, Vol: ${ex.volume}kg)`;
    }).join('\n');

    // 3. Construct Augmented Prompt
    const prompt = `
      You are an elite fitness coach. Analyze this workout session with context of the user's recent history.

      CONTEXT (Recent History):
      ${historySummary || "No previous history available."}

      CURRENT SESSION:
      Name: ${workout.name}
      Duration: ${workout.durationMinutes} mins
      Total Volume: ${workout.totalVolume} kg
      
      Exercises:
      ${exerciseSummary}

      TASK:
      1. Compare this session to history (Progress/Regression?).
      2. Rate intensity (1-10).
      3. Give one specific actionable tip for the next session.
      4. Motivational closing.
      
      Keep it short, punchy, and data-driven.
    `;

    try {
      // Use Integration Layer
      const feedback = await GeminiClient.generateText(prompt);
      return feedback || 'Great workout! Keep pushing your limits!';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Great workout! AI feedback is temporarily unavailable, but keep pushing limits!';
    }
  }

  /**
   * Get all workouts for a user
   */
  async getUserWorkouts(userId) {
    return await Workout.find({ user: userId }).sort({ date: -1 });
  }
}

module.exports = new WorkoutService();
