// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     // Check if MongoDB URL is provided
//     if (!process.env.MONGODB_URL) {
//       throw new Error("MONGODB_URL environment variable is not defined");
//     }

//     console.log("Attempting to connect to MongoDB...");

//     await mongoose.connect(process.env.MONGODB_URL);

//     console.log("Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error.message);

//     // For Vercel, don't exit the process - just log the error
//     if (process.env.VERCEL) {
//       console.error("Running on Vercel - continuing without DB connection");
//       return;
//     }

//     // For local development, exit on DB failure
//     process.exit(1);
//   }
// };

// // Handle connection events
// mongoose.connection.on("connected", () => {
//   console.log("Mongoose connected to MongoDB");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("Mongoose connection error:", err);
// });

// mongoose.connection.on("disconnected", () => {
//   console.log("Mongoose disconnected");
// });

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Check for MongoDB URL with multiple possible variable names
    const mongoUrl =
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL ||
      process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error(
        "MongoDB URL environment variable is not defined. Please set MONGODB_URI, MONGODB_URL, or MONGO_URL"
      );
    }

    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URL exists:", mongoUrl ? "Yes" : "No");

    // Add connection options for better reliability
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("Connected to MongoDB successfully");
    console.log("Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    // Log more details for debugging
    console.error("Available environment variables:");
    console.error("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
    console.error("MONGODB_URL:", process.env.MONGODB_URL ? "Set" : "Not set");
    console.error("MONGO_URL:", process.env.MONGO_URL ? "Set" : "Not set");

    // For Vercel, don't exit the process - just log the error
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.error(
        "Running in production environment - continuing without DB connection"
      );
      return;
    }

    // For local development, exit on DB failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
  console.log("Connection state: Connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
  console.log("Connection state: Disconnected");
});

// Handle app termination
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("Error during MongoDB connection close:", error);
    process.exit(1);
  }
});

module.exports = connectDB;
