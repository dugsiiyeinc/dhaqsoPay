import { WebSocketServer } from 'ws';

const activeClients = new Map();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'REGISTER') {
          if (!message.number) {
            return ws.send(JSON.stringify({ type: 'ERROR', message: 'Phone number is required for registration.' }));
          }

          activeClients.set(message.number, ws);
          console.log(`Registered client for number: ${message.number}`);
          ws.send(JSON.stringify({ type: 'REGISTER_SUCCESS', message: `Registered successfully for number: ${message.number}` }));
        }

        if (message.type === 'CONFIRM_PAYMENT') {
          const { number, success, pin } = message;
          if (!number) {
            return ws.send(JSON.stringify({ type: 'ERROR', message: 'Phone number is required for payment confirmation.' }));
          }

          console.log(`Received payment confirmation for number: ${number}`);
          ws.emit('payment-response', { number, success, pin });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format.' }));
      }
    });

    ws.on('close', () => {
      for (const [number, client] of activeClients.entries()) {
        if (client === ws) {
          activeClients.delete(number);
          console.log(`Client disconnected for number: ${number}`);
          break;
        }
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });

  return wss;
};

export { activeClients };
