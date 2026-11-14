import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the client promise is preserved across HMR
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, standard connection pooling
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Graceful fallback when MONGODB_URI is not set
  if (process.env.NODE_ENV !== "test") {
    console.info("ℹ️ MONGODB_URI not configured. Operating with in-memory fallback store.");
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!clientPromise) return null;
  try {
    return await clientPromise;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error);
    return null;
  }
}

export async function getDatabase(dbName?: string): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  const customDb = dbName || process.env.MONGODB_DB_NAME;
  // If specific db specified or via env, use that; otherwise let driver use connection string db or fallback
  return customDb ? mongoClient.db(customDb) : mongoClient.db("affinity_aiims_db");
}

export async function isMongoConnected(): Promise<boolean> {
  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient) return false;
    await mongoClient.db().command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

// Typed collection getters
export async function getUsersCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("users") : null;
}

export async function getRegistrationsCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("registrations") : null;
}

export async function getPaymentsCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("payments") : null;
}

export async function getTicketsCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("tickets") : null;
}

export async function getEventsCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("events") : null;
}

export async function getGalleryCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("gallery") : null;
}

export async function getQrSettingsCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("qr_settings") : null;
}

export default clientPromise;
