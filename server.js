require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const studentRoute = require("./routes/studentRoute");
const adminRoute = require("./routes/adminRoute");
const examRoute = require("./routes/examRoute");
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 1999;

// Database connection with retry logic
const MAX_RETRIES = 3;
let retryCount = 0;

const connectWithRetry = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.error(
        `Database connection failed, retry ${retryCount}/${MAX_RETRIES}:`,
        err.message
      );
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error(
        "Max retries reached, could not connect to database:",
        err.message
      );
      process.exit(1);
    }
  }
};

connectWithRetry();

// CORS configuration
const allowedOrigins = [
  "https://online-exam-lemon.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS check for origin:", origin);
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "ngrok-skip-browser-warning",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exam", examRoute);

app.get("/", (_, res) => {
  res.json({
    message: "Online Exam API Server",
    status: "running",
    dbStatus:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
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
