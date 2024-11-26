import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
  const { number, fullname, pin } = req.body;

  if (!number || !fullname || !pin) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { number } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const newUser = await prisma.user.create({
      data: { number, fullname, pin, balance: 0.0, status: true },
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: { id: newUser.id, number: newUser.number, fullname: newUser.fullname },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Login user
export const login = async (req, res) => {
  const { number, pin } = req.body;

  if (!number || !pin) {
    return res.status(400).json({ error: 'Phone number and PIN are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { number } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.pin !== pin) {
      return res.status(401).json({ error: 'Invalid PIN.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      user: { id: user.id, number: user.number, fullname: user.fullname, balance: user.balance },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Change PIN
export const changePin = async (req, res) => {
  const { number, oldPin, newPin } = req.body;

  if (!number || !oldPin || !newPin) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { number } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.pin !== oldPin) {
      return res.status(401).json({ error: 'Incorrect old PIN.' });
    }

    const updatedUser = await prisma.user.update({
      where: { number },
      data: { pin: newPin },
    });

    res.status(200).json({
      message: 'PIN changed successfully.',
      user: { id: updatedUser.id, number: updatedUser.number },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};
