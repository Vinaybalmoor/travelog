const express = require('express');
const app = express();
const port = 5000;
app.use(express.json());
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const tripsRoutes = require("./routes/trips");
require('dotenv').config();
connectDB();
app.use("/api/auth",authRoutes);
app.use("/api/trips",tripsRoutes);
app.get('/',(req,res)=>{
  res.send("Welcome to Travelog Backend Server");
});

app.listen(port,()=>{
  console.log(`Server is running on http://localhost:${port}`);
});