const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const connectDB = asyncHandler(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("MongoDB connected");
});

module.exports = connectDB;
