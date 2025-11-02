import mongooseLib, { Connection } from "mongoose";

declare global {
  // Ensures global cache works across reloads
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    const opts = { bufferCommands: false };

    cached.promise = mongooseLib.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
