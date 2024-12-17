import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
  const { number, fullname, pin } = req.body;

  if (!number || !fullname || !pin) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { number } });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const newUser = await prisma.user.create({
      data: { number, fullname, pin, balance: 0.0 },
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        number: newUser.number,
        balance: user.balance,
        pin: user.pin
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Login user
export const login = async (req, res) => {
  const { number, pin } = req.body;

  console.log(number, pin);

  if (!number || !pin) {
    return res
      .status(400)
      .json({ error: "Phone number and PIN are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { number } });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, error: "Invalid phone number or pin" });
    }

    if (user.pin !== pin) {
      return res
        .status(401)
        .json({ status: false, error: "Invalid phone number or PIN." });
    }

    res.status(200).json({
      status: true,
      user: {
        id: user.id,
        fullname: user.fullname,
        number: user.number,
        balance: user.balance,
        pin: user.pin
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Change PIN
export const changePin = async (req, res) => {
  const { number, oldPin, newPin } = req.body;

  if (!number || !oldPin || !newPin) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { number } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.pin !== oldPin) {
      return res.status(401).json({ error: "Incorrect old PIN." });
    }

    const updatedUser = await prisma.user.update({
      where: { number },
      data: { pin: newPin },
    });

    res.status(200).json({
      message: "PIN changed successfully.",
      user: { id: updatedUser.id, number: updatedUser.number },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Increase Balance
export const increaseBalance = async (req, res) => {
  const { number, amount } = req.body;

  if (!number || !amount) {
    return res
      .status(400)
      .json({ error: "Phone number and amount are required." });
  }

  if (amount < 5 || amount > 1000000) {
    return res
      .status(400)
      .json({ error: "Amount must be between 5 and 1,000,000." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { number } });

    if (!user) {
      return res.status(404).json({ status: 404, error: "User not found." });
    }

    const updatedBalance = user.balance + amount;

    if (updatedBalance > 1000000) {
      return res
        .status(400)
        .json({ error: "Balance cannot exceed 1,000,000." });
    }

    const updatedUser = await prisma.user.update({
      where: { number },
      data: { balance: updatedBalance },
    });

    res.status(200).json({
      message: "Balance updated successfully.",
      status: true,
      user: {
        id: updatedUser.id,
        number: updatedUser.number,
        balance: updatedUser.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};
