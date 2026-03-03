require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const tripsRoutes = require("./routes/trips");

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(cors()); // allow all origins (better for hackathon/demo)
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Travelog Backend Server");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});