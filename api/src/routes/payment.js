import express from 'express';
import { initiatePayment } from '../controllers/paymentController.js';

const paymentRoutes = express.Router();

// Developer initiates a payment
paymentRoutes.post('/pay', initiatePayment);

export default paymentRoutes;
