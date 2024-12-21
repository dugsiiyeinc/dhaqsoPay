import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { port } from "./config/initialConfig.js";
import paymentRoutes from "./routes/payment.js";
import userRoutes from "./routes/user.js";
import { setupWebSocket } from "./utils/websocket.js";
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors())

// HTTP Server
const server = http.createServer(app);

// Set up WebSocket server
setupWebSocket(server);

// API Routes
app.use("/api", paymentRoutes);
app.use("/api", userRoutes);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
