const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const workoutRoutes = require('./src/routes/workoutRoutes');
const authRoutes = require('./src/routes/authRoutes');
const exerciseRoutes = require('./src/routes/exerciseRoutes');
const metricRoutes = require('./src/routes/metricRoutes');
const startNotificationJob = require('./src/jobs/notificationJob');

// Connect to Database
connectDB();

// Init Background Jobs
startNotificationJob();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/metrics', metricRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('FitMetric API is running...');
});

// Error Handler
app.use(errorHandler);

// Only run server if called directly (Local Dev)
if (require.main === module) {
  const PORT = env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = app;
