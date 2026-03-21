const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// ================= ADD EXPENSE =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { tripId, category, title, amount, transportMode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid tripId" });
    }

    amount = Number(amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

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
    console.error("POST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= DELETE =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let { category, title, amount, transportMode } = req.body;

    if (amount) {
      amount = Number(amount);
      if (amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      expense.amount = amount;
    }

    if (category) expense.category = category;
    if (title) expense.title = title;
    if (transportMode) expense.transportMode = transportMode;

    await expense.save();

    res.json({ message: "Expense updated", expense });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= TOTAL =================
router.get("/total/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid tripId" });
    }

    const expenses = await Expense.find({
      tripId,
      userId: req.user.userId,
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ total });

  } catch (error) {
    console.error("TOTAL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= SUMMARY =================
router.get("/summary/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid tripId" });
    }

    const summary = await Expense.aggregate([
      {
        $match: {
          tripId: new mongoose.Types.ObjectId(tripId),
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
    console.error("SUMMARY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= STATS =================
router.get("/stats/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid tripId" });
    }

    const expenses = await Expense.find({
      tripId,
      userId: req.user.userId,
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      totalExpense: total,
      expenseCount: expenses.length,
    });

  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ KEEP THIS LAST ALWAYS
// ================= GET ALL EXPENSES =================
router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid tripId" });
    }

    const expenses = await Expense.find({
      tripId,
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({ expenses });

  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;