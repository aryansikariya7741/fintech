import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create New User
router.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ message: "User added successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User by Email
router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate("transactions");
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
