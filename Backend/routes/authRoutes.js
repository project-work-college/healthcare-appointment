const express = require("express");
const User = require("../model/User");
const Hospital = require("../model/Hospital");
const Doctor = require("../model/Doctor");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  console.log(req.body);

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Determine role based on email domain
    //const getRole = (email) => (email.endsWith("@hospital.com") ? "hospitalAdmin" : "patient");

    // Create new user
    const newUser = new User({ email, username, password, role: "patient" });
    await newUser.save();

    console.log(newUser);
    res.status(201).json({ message: "Signup successful!", role: newUser.role });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user, please try again." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  console.log("Login request received",req.body);
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    console.log(existingUser);

    if (!existingUser) {
      return res.status(400).json({ message: "No user found" });
    }

    if (password !== existingUser.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let hospitalId = null;
    let doctorId = null;
    // If the user is a hospital admin, fetch hospitalId
    if (existingUser.role === "hospitalAdmin") {
      const hospital = await Hospital.findOne({ admin: existingUser._id });
      if (hospital) {
        hospitalId = hospital._id;
      }
    }

    // If the user is a doctor, fetch doctorId
    if (existingUser.role === "doctor") {
      const doctor = await Doctor.findOne({ user: existingUser._id });
      if (doctor) {
        doctorId = doctor._id;
      }
    }

    res.status(200).json({ message: "Login successful!", role: existingUser.role ,username:existingUser.username,email:existingUser.email,_id:existingUser._id,hospitalId, doctorId,});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login, please try again." });
  }
});

module.exports = router;
