const { genAI, modelConfig } = require('../config/gemini');

/**
 * Gemini Client Integration Service
 * Handles all direct interactions with the Google Gemini API.
 */
class GeminiClient {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: modelConfig.model });
  }

  /**
   * Generates text content based on a prompt.
   * @param {string} prompt - The input prompt for Gemini.
   * @returns {Promise<string>} - The generated text response.
   */
  async generateText(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      // Soft fail: Just warn and return null so the app continues
      console.warn('⚠️ Gemini AI is unavailable or errored (Check quota/API key). Skipping AI feature.');
      // console.error(error); // Uncomment for debugging
      return null;
    }
  }

  /**
   * Generates a personalized notification message.
   * @param {string} userName - The name of the user.
   * @param {object} stats - User's recent workout stats.
   * @returns {Promise<string>} - A motivational notification message.
   */
  async generateNotification(userName, stats) {
    const prompt = `
      Act as a high-performance fitness coach.
      Write a short, punchy, and motivational push notification (max 150 chars) for ${userName}.
      Context: They worked out ${stats.daysActive} times this week with a total volume of ${stats.totalVolume}kg.
      Constraint: Do not use emojis. Be professional but intense.
    `;
    return this.generateText(prompt);
  }

  /**
   * Generates a welcome insight for new users.
   * @param {object} userProfile - User's basic profile data.
   * @returns {Promise<string>} - Initial personalized advice.
   */
  async generateOnboardingInsight(userProfile) {
    const prompt = `
      Analyze this new gym member:
      Name: ${userProfile.name}
      Goal: ${userProfile.goal}
      BMI: ${userProfile.bmi || 'Unknown'}
      Give one single, high-impact piece of advice to start their journey. Max 1 sentence.
    `;
    return this.generateText(prompt);
  }
}

module.exports = new GeminiClient();
