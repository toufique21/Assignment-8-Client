import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGODB_URL is not set. Add it to your .env file.");
}

// Reuse the client across hot reloads in development so we don't open a new
// connection on every request.
const globalForMongo = globalThis as typeof globalThis & {
  _bookNookMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo._bookNookMongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._bookNookMongoClient = mongoClient;
}

export const db = mongoClient.db("BookNook");
