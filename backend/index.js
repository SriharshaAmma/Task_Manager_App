const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend running successfully 🚀"
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager Backend API 🎯");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
