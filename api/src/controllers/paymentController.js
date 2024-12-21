import { PrismaClient } from '@prisma/client';
import { activeClients } from '../utils/websocket.js';

const prisma = new PrismaClient();

export const initiatePayment = async (req, res) => {
  const { number, amount, platform } = req.body;

  if (!number || !amount || !platform) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { number } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const ws = activeClients.get(number);
    if (!ws) {
      return res.status(400).json({ error: 'User is not connected.' });
    }

    // Send confirmation request to the user
    ws.send(
      JSON.stringify({
        type: 'CONFIRM_PAYMENT',
        message: `Are you sure you want to pay $${amount} to ${platform}?`,
        amount,
        platform,
        number,
      })
    );

    const timeout = setTimeout(() => {
      ws.send(
        JSON.stringify({
          type: 'PAYMENT_RESPONSE',
          error: 'Payment request timed out.',
        })
      );
      res.status(408).json({ error: 'Payment request timed out.' });
    }, 30000);

    const onMessage = async (data) => {
      try {
        clearTimeout(timeout);
        const response = JSON.parse(data);

        if (!response.success) {
          ws.send(
            JSON.stringify({
              type: 'PAYMENT_RESPONSE',
              error: 'Payment canceled by user.',
            })
          );
          res.status(400).json({ error: 'Payment canceled by user.' });
          return;
        }

        // Validate PIN
        if (user.pin !== response.pin) {
          ws.send(
            JSON.stringify({
              type: 'PAYMENT_RESPONSE',
              error: 'Incorrect PIN.',
            })
          );
          res.status(401).json({ error: 'Incorrect PIN.' });
          return;
        }

        // Check balance
        if (user.balance < amount) {
          ws.send(
            JSON.stringify({
              type: 'PAYMENT_RESPONSE',
              error: 'Insufficient balance.',
            })
          );
          res.status(400).json({ error: 'Insufficient balance.' });
          return;
        }

        // Deduct balance and update user
        const updatedUser = await prisma.user.update({
          where: { number },
          data: { balance: user.balance - amount },
        });

        ws.send(
          JSON.stringify({
            type: 'PAYMENT_RESPONSE',
            message: 'Payment successful.',
            newBalance: updatedUser.balance,
            amount,
            platform,
          })
        );

        res.status(200).json({ message: 'Payment successful.' });
      } catch (err) {
        console.error('Payment error:', err);
        ws.send(
          JSON.stringify({
            type: 'PAYMENT_RESPONSE',
            error: 'An error occurred during payment processing.',
          })
        );
        res.status(500).json({ error: 'Internal server error.' });
      } finally {
        ws.off('message', onMessage);
      }
    };

    ws.on('message', onMessage);
  } catch (err) {
    console.error('Error initiating payment:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
