const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  const { tripId, name, latitude, longitude } = req.body;
  try {
    const place = new Place({
      tripId,
      userId: req.user.userId,
      name,
      latitude,
      longitude,
    });
    await place.save();
    res.status(201).json({ message: "Place added successfully", place });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      res.status(404).json({ message: "Place not found" });
    }
    if (place.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: "Not authorized" });
    }
    await place.deleteOne();
    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const places = await Place.find({
      tripId: req.params.tripId,
      userId: req.user.userId,
    });
    res.json({ places });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
