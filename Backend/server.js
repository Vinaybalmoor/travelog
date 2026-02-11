const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

app.use(express.json());
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
require('dotenv').config();
connectDB();
app.use("/api/auth",authRoutes);
app.get('/',(req,res)=>{
  res.send("Welcome to Travelog Backend Server");
});

app.listen(port,()=>{
  console.log(`Server is running on http://localhost:${port}`);
});