const express = require("express");
const router = express.Router();

// 🟢 TEMP STORAGE (acts like database)
let places = [];

// ================= GET PLACES =================
router.get("/:tripId", (req, res) => {
    const { tripId } = req.params;

    const filtered = places.filter(p => p.tripId === tripId);

    res.json({ places: filtered });
});

// ================= CREATE PLACE =================
router.post("/", (req, res) => {
    const { name, latitude, longitude, tripId } = req.body;

    const newPlace = {
        _id: Date.now().toString(),
        name,
        latitude,
        longitude,
        tripId
    };

    places.push(newPlace);

    console.log("Added:", newPlace);

    res.json({ message: "Place added", place: newPlace });
});

// ================= UPDATE PLACE =================
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude } = req.body;

    places = places.map(p => {
        if (p._id === id) {
            return { ...p, name, latitude, longitude };
        }
        return p;
    });

    res.json({ message: "Place updated" });
});

// ================= DELETE PLACE =================
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    places = places.filter(p => p._id !== id);

    res.json({ message: "Place deleted" });
});

module.exports = router;