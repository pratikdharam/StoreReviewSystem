import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Import models in the correct order
import User from './models/User.js';
import Store from './models/Store.js';
import Rating from './models/Rating.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use("/admin", adminRoutes);
app.use('/users', userRoutes);
app.use('/stores', storeRoutes);
app.use('/ratings', ratingRoutes);

// Database Connection and Sync
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Force: false means it won't drop tables
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database connection/sync error:', error);
  }
};

initializeDatabase();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));