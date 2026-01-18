const Exercise = require('../models/Exercise');
const myCache = require('../utils/cache');

class ExerciseService {
  /**
   * Get all exercises (Cached)
   * Cache Key: 'all_exercises'
   * TTL: 24 hours (86400 seconds)
   */
  async getAllExercises() {
    const cacheKey = 'all_exercises';
    
    // 1. Check Cache
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
      console.log('⚡ Cache Hit: Exercises fetched from RAM');
      return cachedData;
    }

    // 2. Fetch from DB
    console.log('🐌 Cache Miss: Fetching Exercises from DB...');
    const exercises = await Exercise.find({}).sort({ name: 1 });

    // 3. Set Cache (TTL 24h)
    // Note: server/src/utils/cache.js has default TTL 600s, so we override allowed? 
    // node-cache set(key, val, [ttl])
    myCache.set(cacheKey, exercises, 86400); 

    return exercises;
  }

  /**
   * Get specific exercise by ID
   */
  async getExerciseById(id) {
    // Trivial query, usually fast enough without cache, but can be added if needed
    return await Exercise.findById(id);
  }
}

module.exports = new ExerciseService();
