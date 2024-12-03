import { PrismaClient } from '@prisma/client';
import { activeClients } from '../app.js'; // Import activeClients

const prisma = new PrismaClient();

export const initiatePayment = async (req, res) => {
  const { number, amount, platform } = req.body;

  // Validate input
  if (!number || !amount || !platform) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Find the user by phone number
    const user = await prisma.user.findUnique({ where: { number } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user is connected via WebSocket
    const ws = activeClients.get(number);
    if (!ws) {
      return res.status(400).json({ error: 'User is not connected.' });
    }

    // Send a WebSocket message to the user for confirmation
    ws.send(
      JSON.stringify({
        type: 'CONFIRM_PAYMENT',
        message: `Are you sure you want to pay $${amount} to ${platform}?`,
        amount,
        platform,
      })
    );

    // Listen for the user's confirmation
    ws.once('message', async (data) => {
      const response = JSON.parse(data);
      const { success, pin } = response;

      if (!success) {
        // Inform both developer and user
        ws.send(
          JSON.stringify({
            type: 'PAYMENT_RESPONSE',
            error: 'Payment canceled by user.',
          })
        );
        return res.status(400).json({ error: 'Payment canceled by user.' });
      }

      // Validate PIN
      if (user.pin !== pin) {
        // Inform both developer and user
        ws.send(
          JSON.stringify({
            type: 'PAYMENT_RESPONSE',
            error: 'Incorrect PIN.',
          })
        );
        return res.status(401).json({ error: 'Incorrect PIN.' });
      }

      // Check balance
      if (user.balance < amount) {
        // Inform both developer and user
        ws.send(
          JSON.stringify({
            type: 'PAYMENT_RESPONSE',
            error: 'Insufficient balance.',
          })
        );
        return res.status(400).json({ error: 'Insufficient balance.' });
      }

      // Deduct the balance
      await prisma.user.update({
        where: { number },
        data: { balance: user.balance - amount },
      });

      // Respond to both developer and user
      ws.send(
        JSON.stringify({
          type: 'PAYMENT_RESPONSE',
          message: 'Payment successful.',
          newBalance: user.balance - amount,
        })
      );
      return res.status(200).json({ message: 'Payment successful.' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
