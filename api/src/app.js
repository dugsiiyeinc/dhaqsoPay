import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// HTTP Server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server });

// Track active WebSocket clients (extension users)
export const activeClients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    // Track user connections
    if (message.type === 'REGISTER') {
      activeClients.set(message.number, ws);
      console.log(`Registered client for number: ${message.number}`);
    }

    // Handle confirmation response from the user
    if (message.type === 'CONFIRM_PAYMENT') {
      const { number, pin, success } = message;
      ws.emit('payment-response', { number, pin, success });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

// API Routes
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
