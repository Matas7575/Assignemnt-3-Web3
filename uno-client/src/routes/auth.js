const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Route to handle user registration
router.post("/register", async (req, res) => {
  try {
    // Create a new user with the request body data
    const user = new User(req.body);
    // Save the user to the database
    await user.save();
    // Send a success response
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Send an error response if registration fails
    res.status(400).json({ error: "User registration failed" });
  }
});

// Route to handle user login
router.post("/login", async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.body.username });
    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      "secretKey",
      { expiresIn: "1h" }
    );
    // Send the token and username in the response
    res.json({ token, username: user.username });
  } catch (error) {
    // Send an error response if login fails
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;