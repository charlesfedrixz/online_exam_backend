const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Check if MongoDB URL is provided
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }

    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    // For Vercel, don't exit the process - just log the error
    if (process.env.VERCEL) {
      console.error("Running on Vercel - continuing without DB connection");
      return;
    }

    // For local development, exit on DB failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

module.exports = connectDB;
