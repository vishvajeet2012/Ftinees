const axios = require('axios');
const env = require('../../config/env');

class N8nService {
  constructor() {
    this.secret = env.FITMETRIC_SECRET;
    // Dynamic URL switching based on environment
    this.baseUrl =
      env.NODE_ENV === 'production' ? env.N8N_URL_PROD : env.N8N_URL_LOCAL;

    // Axios instance with Security Header
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-fitmetric-secret': this.secret, // The "Handshake"
      },
      timeout: 5000, // Fail fast if n8n is down
    });
  }

  /**
   * Generic automation trigger
   * @param {string} webhookPath - The path from n8n webhook node (e.g. /webhook/summary)
   * @param {object} payload - Data to send
   */
  async triggerAutomation(webhookPath, payload) {
    if (!this.baseUrl) {
      console.warn('Skipping n8n trigger: Base URL not configured.');
      return;
    }

    try {
      console.log(`[n8n] Triggering: ${webhookPath}`);
      const response = await this.client.post(webhookPath, payload);
      return response.data;
    } catch (error) {
      console.error(
        `[n8n] Error triggering ${webhookPath}:`,
        error.message
      );
      // We do NOT throw here to prevent crashing the main server
      return null;
    }
  }

  /**
   * Sends workout data to n8n for AI Summary generation
   */
  async sendWorkoutSummary(userId, workoutData) {
    return this.triggerAutomation('/webhook/generate-summary', {
      userId,
      ...workoutData,
      timestamp: new Date(),
    });
  }

  /**
   * Triggers a personalized notification workflow
   */
  async sendPersonalNotification(userId, message) {
    return this.triggerAutomation('/webhook/send-notification', {
      userId,
      message,
      type: 'motivation',
    });
  }
}

module.exports = new N8nService();
