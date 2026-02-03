const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User registered Successfully" });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
  res.status(200).json({ message: "Login Successful",token });
});
router.get("/protected", authMiddleware, (req, res) => {  
  res.json({ message: "This is a protected route", user: req.user });})
module.exports = router;
