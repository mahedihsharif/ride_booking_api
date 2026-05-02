const mongoose = require("mongoose");
const app = require("../dist/app");

let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.DB_URL);
    isConnected = true;
    console.log("MongoDB Connected");
  }
};

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
