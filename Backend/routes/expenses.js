const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
router.post("/", authMiddleware, async (req, res) => {
  const { tripId, category, title, amount, transportMode } = req.body;
  try {
    const expense = new Expense({
      tripId,
      userId: req.user.userId,
      category,
      title,
      amount,
      transportMode,
    });
    await expense.save();
    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.body);
    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: "Not authorized" });
    }
    await expe.deleteOne();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/total/:tripId", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      tripId: req.params.tripId,
      userId: req.user.userId,
    });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/summary/:tripId", authMiddleware, async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          tripId: new mongoose.Types.ObjectId(req.params.tripId),
          userId: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { category, title, amount, transportMode } = req.body;
    if (category) expense.category = category;
    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (transportMode) expense.transportMode = transportMode;
    await expense.save();
    res.json({ message: "Expense updated", expense });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("stats/:tripId", authMiddleware, async (req, res) => {
  try{
    const expenses = await Expense.find({
      tripId: req.params.tripId,
      userId: req.user.userId,
    });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    res.json({
      totalExpense: total,
      expenseCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
    })
  


module.exports = router;
