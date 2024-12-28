const express = require("express");
const { signup, login, loginWithOTP, generateOTP, resetPassword, requestOTP, verifyOTP } = require("../controllers/authController");

const router = express.Router();

// Routes
router.post("/signup", signup); // Signup
router.post("/login", login); // Login with email/password
router.post("/login-otp", loginWithOTP); // Login with mobile/OTP
router.post("/generate-otp", generateOTP); // Generate OTP
router.post("/reset-password", resetPassword); // Reset password
router.post("/request-otp", requestOTP); // Request OTP
router.post("/verify-otp", verifyOTP);   // Verify OTP
module.exports = router;
