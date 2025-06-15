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

// const mongoose = require("mongoose");

// let isConnected = false;

// const connectDB = async () => {
//   // If already connected, return
//   if (isConnected) {
//     console.log("Using existing database connection");
//     return;
//   }

//   // If mongoose is already connected, mark as connected and return
//   if (mongoose.connections[0].readyState) {
//     isConnected = true;
//     console.log("Using existing mongoose connection");
//     return;
//   }

//   try {
//     const connectionOptions = {
//       // Connection timeout settings
//       connectTimeoutMS: 10000, // 10 seconds
//       socketTimeoutMS: 10000, // 10 seconds
//       serverSelectionTimeoutMS: 10000, // 10 seconds

//       // Serverless optimizations
//       maxPoolSize: 1, // Limit connection pool for serverless
//       minPoolSize: 0,
//       maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
//       bufferMaxEntries: 0, // Disable mongoose buffering
//       bufferCommands: false, // Disable mongoose buffering

//       // Reliability settings
//       retryWrites: true,
//       w: "majority",

//       // Additional settings for stability
//       heartbeatFrequencyMS: 30000,
//       family: 4, // Use IPv4, skip trying IPv6
//     };

//     console.log("Connecting to MongoDB...");

//     const conn = await mongoose.connect(
//       process.env.MONGODB_URI,
//       connectionOptions
//     );

//     isConnected = true;
//     console.log(`MongoDB Connected: ${conn.connection.host}`);

//     // Handle connection events
//     mongoose.connection.on("disconnected", () => {
//       console.log("MongoDB disconnected");
//       isConnected = false;
//     });

//     mongoose.connection.on("error", (err) => {
//       console.error("MongoDB connection error:", err);
//       isConnected = false;
//     });
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     isConnected = false;
//     throw error;
//   }
// };

// const isDbConnected = () => {
//   return isConnected && mongoose.connections[0].readyState === 1;
// };

// // Graceful disconnection
// const disconnectDB = async () => {
//   try {
//     await mongoose.connection.close();
//     isConnected = false;
//     console.log("MongoDB disconnected");
//   } catch (error) {
//     console.error("Error disconnecting from MongoDB:", error);
//   }
// };

// module.exports = {
//   connectDB,
//   isDbConnected,
//   disconnectDB,
//   mongoose,
// };
