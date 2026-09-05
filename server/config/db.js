import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge_ai';
  try {
    // Attempt standard connection with 2.5s timeout
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[Database] Connected to MongoDB at ${uri}`);
  } catch (err) {
    console.warn(`[Database] Local Mongo connection failed (${err.message}). Starting In-Memory MongoDB Server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Successfully connected to In-Memory MongoDB at ${memUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start In-Memory MongoDB Server:', memErr.message);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
