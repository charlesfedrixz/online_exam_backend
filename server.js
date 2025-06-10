require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoute = require("./routes/studentRoute");
const adminRoute = require("./routes/adminRoute");
const examRoute = require("./routes/examRoute");

const app = express();
const PORT = process.env.PORT || 1999;

connectDB();

app.use(
  cors({
    origin: ["https://localhost:5173"], // Specify allowed origins
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
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
