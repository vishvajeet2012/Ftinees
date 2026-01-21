/**
 * Exercise Database - Predefined exercises categorized by level and muscle group
 */

const exerciseLibrary = {
  // BEGINNER EXERCISES
  beginner: {
    chest: [
      { name: "Wall Push-ups", sets: 3, reps: 10, muscleGroup: "chest" },
      { name: "Knee Push-ups", sets: 3, reps: 8, muscleGroup: "chest" },
      { name: "Incline Push-ups", sets: 3, reps: 10, muscleGroup: "chest" }
    ],
    back: [
      { name: "Superman Hold", sets: 3, reps: 10, muscleGroup: "back" },
      { name: "Prone Y Raises", sets: 3, reps: 12, muscleGroup: "back" },
      { name: "Bird Dog", sets: 3, reps: 10, muscleGroup: "back" }
    ],
    legs: [
      { name: "Bodyweight Squats", sets: 3, reps: 12, muscleGroup: "legs" },
      { name: "Wall Sit", sets: 3, duration: "30 sec", muscleGroup: "legs" },
      { name: "Glute Bridges", sets: 3, reps: 15, muscleGroup: "legs" }
    ],
    core: [
      { name: "Dead Bug", sets: 3, reps: 10, muscleGroup: "core" },
      { name: "Plank Hold", sets: 3, duration: "20 sec", muscleGroup: "core" },
      { name: "Crunches", sets: 3, reps: 15, muscleGroup: "core" }
    ],
    cardio: [
      { name: "Walking", duration: "20 min", muscleGroup: "cardio" },
      { name: "Marching in Place", duration: "10 min", muscleGroup: "cardio" },
      { name: "Step Touch", duration: "10 min", muscleGroup: "cardio" }
    ]
  },

  // INTERMEDIATE EXERCISES
  intermediate: {
    chest: [
      { name: "Standard Push-ups", sets: 4, reps: 12, muscleGroup: "chest" },
      { name: "Diamond Push-ups", sets: 3, reps: 10, muscleGroup: "chest" },
      { name: "Wide Push-ups", sets: 3, reps: 12, muscleGroup: "chest" }
    ],
    back: [
      { name: "Inverted Rows", sets: 4, reps: 10, muscleGroup: "back" },
      { name: "Reverse Snow Angels", sets: 3, reps: 12, muscleGroup: "back" },
      { name: "Back Extensions", sets: 3, reps: 15, muscleGroup: "back" }
    ],
    legs: [
      { name: "Jump Squats", sets: 4, reps: 15, muscleGroup: "legs" },
      { name: "Lunges", sets: 3, reps: 12, muscleGroup: "legs" },
      { name: "Step-ups", sets: 3, reps: 10, muscleGroup: "legs" },
      { name: "Calf Raises", sets: 3, reps: 20, muscleGroup: "legs" }
    ],
    core: [
      { name: "Mountain Climbers", sets: 3, reps: 20, muscleGroup: "core" },
      { name: "Bicycle Crunches", sets: 3, reps: 20, muscleGroup: "core" },
      { name: "Plank Hold", sets: 3, duration: "45 sec", muscleGroup: "core" },
      { name: "Russian Twists", sets: 3, reps: 20, muscleGroup: "core" }
    ],
    cardio: [
      { name: "Jogging", duration: "20 min", muscleGroup: "cardio" },
      { name: "Jumping Jacks", sets: 3, duration: "1 min", muscleGroup: "cardio" },
      { name: "High Knees", sets: 3, duration: "45 sec", muscleGroup: "cardio" }
    ]
  },

  // ADVANCED EXERCISES
  advanced: {
    chest: [
      { name: "Archer Push-ups", sets: 4, reps: 8, muscleGroup: "chest" },
      { name: "Clap Push-ups", sets: 3, reps: 10, muscleGroup: "chest" },
      { name: "Pike Push-ups", sets: 4, reps: 10, muscleGroup: "chest" },
      { name: "Decline Push-ups", sets: 4, reps: 12, muscleGroup: "chest" }
    ],
    back: [
      { name: "Pull-ups", sets: 4, reps: 8, muscleGroup: "back" },
      { name: "Chin-ups", sets: 3, reps: 8, muscleGroup: "back" },
      { name: "Inverted Rows (elevated)", sets: 4, reps: 12, muscleGroup: "back" }
    ],
    legs: [
      { name: "Pistol Squats", sets: 3, reps: 6, muscleGroup: "legs" },
      { name: "Bulgarian Split Squats", sets: 4, reps: 10, muscleGroup: "legs" },
      { name: "Box Jumps", sets: 3, reps: 10, muscleGroup: "legs" },
      { name: "Single Leg Deadlifts", sets: 3, reps: 10, muscleGroup: "legs" }
    ],
    core: [
      { name: "Dragon Flags", sets: 3, reps: 8, muscleGroup: "core" },
      { name: "L-Sit Hold", sets: 3, duration: "15 sec", muscleGroup: "core" },
      { name: "Hanging Leg Raises", sets: 3, reps: 12, muscleGroup: "core" },
      { name: "Ab Wheel Rollouts", sets: 3, reps: 10, muscleGroup: "core" }
    ],
    cardio: [
      { name: "Burpees", sets: 4, reps: 15, muscleGroup: "cardio" },
      { name: "Sprint Intervals", duration: "15 min", muscleGroup: "cardio" },
      { name: "Jump Rope", duration: "10 min", muscleGroup: "cardio" }
    ]
  }
};

/**
 * Weekly split templates based on days per week
 */
const weeklySplits = {
  3: [
    { day: 1, dayName: "Monday", focus: ["chest", "core"] },
    { day: 2, dayName: "Tuesday", focus: null, isRestDay: true },
    { day: 3, dayName: "Wednesday", focus: ["back", "core"] },
    { day: 4, dayName: "Thursday", focus: null, isRestDay: true },
    { day: 5, dayName: "Friday", focus: ["legs", "cardio"] },
    { day: 6, dayName: "Saturday", focus: null, isRestDay: true },
    { day: 7, dayName: "Sunday", focus: null, isRestDay: true }
  ],
  4: [
    { day: 1, dayName: "Monday", focus: ["chest", "core"] },
    { day: 2, dayName: "Tuesday", focus: ["back"] },
    { day: 3, dayName: "Wednesday", focus: null, isRestDay: true },
    { day: 4, dayName: "Thursday", focus: ["legs"] },
    { day: 5, dayName: "Friday", focus: ["cardio", "core"] },
    { day: 6, dayName: "Saturday", focus: null, isRestDay: true },
    { day: 7, dayName: "Sunday", focus: null, isRestDay: true }
  ],
  5: [
    { day: 1, dayName: "Monday", focus: ["chest"] },
    { day: 2, dayName: "Tuesday", focus: ["back"] },
    { day: 3, dayName: "Wednesday", focus: ["legs"] },
    { day: 4, dayName: "Thursday", focus: ["core", "cardio"] },
    { day: 5, dayName: "Friday", focus: ["chest", "back"] },
    { day: 6, dayName: "Saturday", focus: null, isRestDay: true },
    { day: 7, dayName: "Sunday", focus: null, isRestDay: true }
  ]
};

/**
 * Plan name generator based on user profile
 */
function generatePlanName(fitnessLevel, goal) {
  const levelNames = {
    beginner: "Starter",
    intermediate: "Builder",
    advanced: "Elite"
  };
  const goalNames = {
    weight_loss: "Fat Burn",
    muscle_gain: "Muscle Builder",
    general_fitness: "Fitness",
    endurance: "Endurance"
  };
  return `${levelNames[fitnessLevel]} ${goalNames[goal]} Plan`;
}

/**
 * Get exercises for a specific focus area
 */
function getExercisesForFocus(level, focusAreas, goal) {
  const exercises = [];
  const library = exerciseLibrary[level] || exerciseLibrary.beginner;

  focusAreas.forEach(area => {
    if (library[area]) {
      // Take 2-3 exercises from each focus area
      const areaExercises = library[area].slice(0, goal === 'muscle_gain' ? 3 : 2);
      exercises.push(...areaExercises);
    }
  });

  // Add cardio for weight loss goal
  if (goal === 'weight_loss' && !focusAreas.includes('cardio')) {
    const cardio = library.cardio ? library.cardio[0] : null;
    if (cardio) exercises.push(cardio);
  }

  return exercises;
}

/**
 * Main function to generate a complete exercise plan
 */
function generateExercisePlan(userData) {
  const {
    fitnessScore = 50,
    fitnessLevel: userLevel,
    goal = 'general_fitness',
    activityLevel = 'moderate'
  } = userData;

  // Determine fitness level from score if not provided
  let fitnessLevel;
  if (userLevel) {
    fitnessLevel = userLevel;
  } else if (fitnessScore < 40) {
    fitnessLevel = 'beginner';
  } else if (fitnessScore < 70) {
    fitnessLevel = 'intermediate';
  } else {
    fitnessLevel = 'advanced';
  }

  // Determine days per week based on activity level
  let daysPerWeek;
  switch (activityLevel) {
    case 'sedentary':
      daysPerWeek = 3;
      break;
    case 'light':
      daysPerWeek = 3;
      break;
    case 'moderate':
      daysPerWeek = 4;
      break;
    case 'active':
      daysPerWeek = 5;
      break;
    case 'very_active':
      daysPerWeek = 5;
      break;
    default:
      daysPerWeek = 3;
  }

  // Get weekly split template
  const weekTemplate = weeklySplits[daysPerWeek];

  // Generate weekly plan
  const weeklyPlan = weekTemplate.map(dayTemplate => {
    if (dayTemplate.isRestDay) {
      return {
        day: dayTemplate.day,
        dayName: dayTemplate.dayName,
        isRestDay: true,
        exercises: []
      };
    }

    return {
      day: dayTemplate.day,
      dayName: dayTemplate.dayName,
      isRestDay: false,
      exercises: getExercisesForFocus(fitnessLevel, dayTemplate.focus, goal)
    };
  });

  // Determine duration based on goal
  let durationWeeks;
  switch (goal) {
    case 'weight_loss':
      durationWeeks = 8;
      break;
    case 'muscle_gain':
      durationWeeks = 12;
      break;
    default:
      durationWeeks = 4;
  }

  return {
    planName: generatePlanName(fitnessLevel, goal),
    description: `A ${durationWeeks}-week ${fitnessLevel} plan designed for ${goal.replace('_', ' ')}.`,
    fitnessLevel,
    goal,
    durationWeeks,
    daysPerWeek,
    weeklyPlan
  };
}

module.exports = {
  exerciseLibrary,
  weeklySplits,
  generateExercisePlan,
  generatePlanName
};
