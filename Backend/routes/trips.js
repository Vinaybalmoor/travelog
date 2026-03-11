const express = require("express");
const router = express.Router();
const Trip = require("../models/Trips");
const Expense = require("../models/Expense");
const Place = require("../models/Place");
const authMiddleware = require("../middleware/authMiddleware");


// ================= CREATE TRIP =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const trip = new Trip({
      title,
      description,
      userId: req.user.userId,
    });

    const savedTrip = await trip.save();

    res.status(201).json({
      message: "Trip created successfully",
      trip: savedTrip,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ================= GET USER TRIPS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ trips });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ================= DELETE TRIP =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedTrip) {
      return res.status(404).json({
        message: "Trip not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ================= UPDATE TRIP =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        $set: { title, description },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({
        message: "Trip not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
// this is used for the dashboard to get all the data related to a trip in one request
router.get("/dashboard/:tripId", authMiddleware, async(req,res) => {
  try{
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user.userId
    });
    const expenses = await Expense.find({
      tripId,
      userId: req.user.userId
    })
    const places = await Place.find({
      tripId,
      userId: req.user.userId
    })
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({
      trip,
      totalExpense,
      expenses,
      places
    })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
})