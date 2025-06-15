const mongoose = require("mongoose");

let isDbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose connected to MongoDB!");
    isDbConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    isDbConnected = false;
    throw error;
  }
};

module.exports = { connectDB, isDbConnected, mongoose };
