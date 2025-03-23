import mongoose from "mongoose";
import { isDevelopment } from "@/utils/isDevelopment";

const uri = isDevelopment()
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local or .env.production"
  );
}

let isConnected;

const connectMongoDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      ...(isDevelopment() && {
        authSource: "admin",
      }),
    });
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
