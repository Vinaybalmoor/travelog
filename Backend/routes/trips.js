const express = require("express");
const router = express.Router();
const Trip = require("../models/Trips");
const Expense = require("../models/Expense");
const Place = require("../models/Place");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ================= CREATE TRIP =================
router.post("/", upload.single("image"), authMiddleware, async (req, res) => {
  try {
    //console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "travelog" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      stream.end(req.file.buffer);
    });
    //console.log(uploadResult);

    const { title, description } = req.body;

    const trip = new Trip({
      title,
      description,
      userId: req.user.userId,
      imageUrl: uploadResult.secure_url,
    });
    //console.log("Image URL:", uploadResult.secure_url);
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
      { new: true, runValidators: true },
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

// this is used for the dashboard to get all the data related to a trip in one request
router.get("/dashboard/:tripId", authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user.userId,
    });
    const expenses = await Expense.find({
      tripId,
      userId: req.user.userId,
    });
    const places = await Place.find({
      tripId,
      userId: req.user.userId,
    });
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({
      trip,
      totalExpense,
      expenses,
      places,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/map/:tripId", authMiddleware, async (req, res) => {
  try {
    const places = await Place.find({
      tripId: req.params.tripId,
      userId: req.user.userId,
    });
    const coordinates = places.map((place) => ({
      name: place.name,
      lat: place.latitude,
      long: place.longitude,
    }));
    res.json({
      tripId: req.params.tripId,
      places: coordinates,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/route/:tripId", authMiddleware, async (req, res) => {
  try {
    const places = await Place.find({
      tripId: req.params.tripId,
      userId: req.user.userId,
    }).sort({ createdAt: 1 });
    const route = places.map((place) => ({
      lat: place.latitude,
      lng: place.longitude,
    }));
    res.json({ route });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/:id/images", upload.array("images", 10), async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload all images to Cloudinary
    const imageUrls = [];

    for (let file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "travelog" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });

      imageUrls.push(uploadResult.secure_url);
    }

    // Update trip
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Add new images to existing array
    trip.images.push(...imageUrls);

    await trip.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      images: trip.images,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id/images", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // 1. Extract public_id from URL
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1]; // zo1qcgcz2qc9wdxxibgy.jpg
    const publicId = "travelog/" + fileName.split(".")[0];

    // 2. Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // 3. Remove from DB array
    trip.images = trip.images.filter((img) => img !== imageUrl);

    await trip.save();

    res.json({
      message: "Image deleted successfully",
      images: trip.images,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
