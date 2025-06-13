require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoute = require("./routes/studentRoute");
const adminRoute = require("./routes/adminRoute");
const examRoute = require("./routes/examRoute");
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 1999;

connectDB().catch((err) => {
  console.error("Database connection failed:", err.message);
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://online-exam-lemon.vercel.app"]
        : ["https://online-exam-lemon.vercel.app", "http://localhost:5173"], // Specify allowed origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    optionsSuccessStatus: 200,
  })
);
//app.options("*", cors());
app.use(express.json()); // Must be above route handlers

app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exam", examRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Online Exam API Server",
    status: "running",
    dbStatus:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", (req, res) => {
  res.json({ status: "working" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
// Export for Vercel - this is the key change!
module.exports = app;
module.exports.handler = serverless(app);
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });
