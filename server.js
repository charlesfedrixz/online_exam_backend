require("dotenv").config();
const express = require("express");
const cors = require("cors");
const studentRoute = require("./routes/studentRoute");
const adminRoute = require("./routes/adminRoute");
const examRoute = require("./routes/examRoute");
const serverless = require("serverless-http");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorhandler");

const app = express();
const PORT = process.env.PORT || 1999;

// Middleware to ensure database connection before each request

connectDB();

app.use(
  cors({
    origin: [
      "https://online-exam-lemon.vercel.app",
      "https://online-exam-robinsarangthems-projects.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

// Routes
app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exam", examRoute);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server of your Smart Restaurant is running...",
  });
});

// Error handling middleware
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Local development server
if (process.env.NODE_ENV !== "production") {
  // For local development, connect once at startup
  connectDB()
    .then(() => {
      console.log("Database connected successfully");
      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Could not connect to database:", err.message);
      process.exit(1);
    });
} else {
  // For production (Vercel), don't connect at startup

  console.log("Running in serverless mode");
}

// Vercel serverless handler
module.exports = app;
module.exports.handler = serverless(app);
