const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Helper function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup
exports.signup = async (req, res) => {
  const { email, password, mobile } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, mobile });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed. Please try again.", error });
  }
};

// Login with Email and Password
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed. Please try again.", error });
  }
};

// Login with Mobile and OTP
exports.loginWithOTP = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    // Clear the OTP after successful login
    user.otp = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed. Please try again.", error });
  }
};

// Generate OTP
exports.generateOTP = async (req, res) => {
  const { mobile } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    // TODO: Integrate with an SMS API to send the OTP
    console.log(`OTP for ${mobile}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate OTP. Please try again.", error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Ensure both fields are provided
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      message: "Failed to reset password. Please try again.",
      error: error.message || "Internal server error.",
    });
  }
};
