import express from 'express';
import { register, login, changePin, increaseBalance } from '../controllers/userController.js';

const userRoutes = express.Router();

// Register route
userRoutes.post('/register', register);

// Login route
userRoutes.post('/login', login);

// Change PIN route
userRoutes.put('/change-pin', changePin);

// Increase Balance route
userRoutes.put('/increase-balance', increaseBalance);

export default userRoutes;
