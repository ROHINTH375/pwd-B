const express = require("express");
const { signup, login, loginWithOTP, generateOTP, resetPassword } = require("../controllers/authController");

const router = express.Router();

// Routes
router.post("/signup", signup); // Signup
router.post("/login", login); // Login with email/password
router.post("/login-otp", loginWithOTP); // Login with mobile/OTP
router.post("/generate-otp", generateOTP); // Generate OTP
router.post("/reset-password", resetPassword); // Reset password

module.exports = router;
