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

connectDB();

app.use(
  cors({
    origin: ["https://online-exam-lemon.vercel.app"], // Specify allowed origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
    //allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//app.options("*", cors());
app.use(express.json()); // Must be above route handlers

app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exam", examRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/api/test", (req, res) => {
  res.json({ status: "working" });
});

// Add your other routes here...

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Export for Vercel - this is the key change!
module.exports = app;
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });
