import { MongoClient } from "mongodb";
import { isDevelopment } from "@/utils/isDevelopment";

const uri = isDevelopment()
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local or .env.production");
}

const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
};

let client;
let clientPromise;

const connectWithRetry = async (retries = 5) => {
  try {
    client = new MongoClient(uri, options);
    await client.connect();
    console.log('MongoDB connected successfully');
    return client;
  } catch (error) {
    if (retries > 0) {
      console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      return connectWithRetry(retries - 1);
    }
    console.error('MongoDB connection failed after multiple attempts:', error);
    throw error;
  }
};

if (isDevelopment()) {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectWithRetry();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connectWithRetry();
}

export default clientPromise;