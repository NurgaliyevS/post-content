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

// Global connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async () => {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      ...(isDevelopment() && {
        authSource: "admin",
      }),
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
};

// Cleanup on server shutdown
if (process.env.NODE_ENV !== 'development') {
  process.on('SIGINT', async () => {
    if (cached.conn) {
      await cached.conn.disconnect();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    }
  });
}

export default connectMongoDB;
