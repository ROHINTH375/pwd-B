const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb+srv://lovelyvampire563:1234567890@cluster0.ogaak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/sample", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
