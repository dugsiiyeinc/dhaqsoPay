import express from 'express';
import { register, login, changePin } from '../controllers/authController.js';

const authRoutes = express.Router();

// Register route
authRoutes.post('/register', register);

// Login route
authRoutes.post('/login', login);

// Change PIN route
authRoutes.put('/change-pin', changePin);

export default authRoutes;
