const express = require("express");
const router = express.Router();
const Trip = require("../models/Trips");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const trip = new Trip({
    title,
    description,
    userId: req.user.userId,
  });
  try {
    const savedTrip = await trip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: savedTrip });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  const trips = await Trip.find({ userId: req.user.userId });
  res.status(200).json({ trips });
});
router.delete("/:id", authMiddleware, async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  if (trip.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await trip.deleteOne();
  res.status(200).json({ message: "Trip deleted successfully" });
});
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const existingTrip = await Trip.findById(req.params.id);
  if (!existingTrip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  if (existingTrip.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (title) existingTrip.title = title;
  if (description) existingTrip.description = description;
  await existingTrip.save();
  res
    .status(200)
    .json({ message: "Trip updated successfully", trip: existingTrip });
});

module.exports = router;
