// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
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
app.use('/users', userRoutes);
app.use('/stores', storeRoutes);
app.use('/ratings', ratingRoutes);

// Database Connection
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

sequelize.sync({ alter: true }) // Auto-migrate models without data loss
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Database synchronization error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
