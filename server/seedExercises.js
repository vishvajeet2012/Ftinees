const mongoose = require('mongoose');
require('dotenv').config();
const Exercise = require('./src/models/Exercise');

const exercises = [
  { name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Push Up', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Squat', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced' },
  { name: 'Pull Up', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
  { name: 'Dumbbell Curl', muscleGroup: 'arms', equipment: 'dumbbell', difficulty: 'beginner' },
  { name: 'Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate' },
  { name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Lunges', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // Optional: Clear existing exercises
        // await Exercise.deleteMany({});
        
        for (const ex of exercises) {
            await Exercise.findOneAndUpdate(
                { name: ex.name }, 
                ex, 
                { upsert: true, new: true }
            );
            console.log(`Added/Updated: ${ex.name}`);
        }

        console.log('🎉 Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedDB();
