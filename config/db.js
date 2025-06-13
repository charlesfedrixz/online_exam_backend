// const mongoose = require("mongoose");

// const connectDB = async () => {
//   console.log("MongoDB_URL in connectDB:", process.env.MONGODB_URL); // 🔍 debug
//   try {
//     mongoose.connection.on("connected", () => {
//       console.log("✅ Mongoose connected to MongoDB!");
//     });
//     mongoose.connection.on("error", (err) => {
//       console.error("❌ Mongoose connection error:", err);
//     });

//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   } catch (err) {
//     console.error("💥 MongoDB connection failed in connectDB:", err);
//     throw err;
//   }
// };

// module.exports = connectDB;
// config/db.js
const mongoose = require("mongoose");

let isDbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Mongoose connected to MongoDB!");
    isDbConnected = true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    isDbConnected = false;
    throw error;
  }
};

module.exports = { connectDB, isDbConnected, mongoose };
