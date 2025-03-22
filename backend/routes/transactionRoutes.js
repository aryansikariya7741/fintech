import express from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const router = express.Router();

// Add Transaction
router.post("/add-transaction", async (req, res) => {
  try {
    const { userId, amount, type, category } = req.body;
    const transaction = new Transaction({ userId, amount, type, category });
    await transaction.save();

    // Update user's balance
    const user = await User.findById(userId);
    if (type === "income") user.balance += amount;
    else user.balance -= amount;
    await user.save();

    res.status(201).json({ message: "Transaction added successfully!", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Transactions by User ID
router.get("/transactions/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
