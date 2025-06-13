require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");
// const connectDB = require("./config/db");z
const studentRoute = require("./routes/studentRoute");
const adminRoute = require("./routes/adminRoute");
const examRoute = require("./routes/examRoute");
const serverless = require("serverless-http");
const { connectDB, isDbConnected, mongoose } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 1999;

// Database connection with retry logic
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Could not connect to database:", err.message);
    process.exit(1);
  });

// CORS configuration
app.use(
  cors({
    origin: [
      "https://online-exam-lemon.vercel.app",
      "https://online-exam-robinsarangthems-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exam", examRoute);

// app.get("/", (req, res) => {
//   res.json({
//     message: "Online Exam API Server",
//     status: "running",
//     dbStatus:
//       mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
//     time: new Date().toISOString(),
//   });
// });

// app.get("/", (req, res) => {
//   res.json({
//     message: "Online Exam API Server",
//     status: "running",
//     dbStatus: isDbConnected ? "Connected" : "Disconnected",
//     time: new Date().toISOString(),
//   });
// });
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Local development server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// Vercel serverless handler
module.exports = app;
module.exports.handler = serverless(app);
