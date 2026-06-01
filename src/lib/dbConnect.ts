import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI");
}

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}


const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseGlobal;
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (globalWithMongoose.mongoose!.conn) {
    console.log("Already connected");
    return globalWithMongoose.mongoose!.conn!;
  }

  if (!globalWithMongoose.mongoose!.promise) {
    globalWithMongoose.mongoose!.promise = mongoose.connect(MONGODB_URI);
  }

  globalWithMongoose.mongoose!.conn =
    await globalWithMongoose.mongoose!.promise;

  console.log("New DB connection");

  return globalWithMongoose.mongoose!.conn!;
}

export default dbConnect;