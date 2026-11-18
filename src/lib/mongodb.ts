import { MongoClient, Db, Collection, MongoClientOptions } from "mongodb";

const uri = (process.env.MONGODB_URI || "").trim();
const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient | null> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient | null> | undefined;
  // eslint-disable-next-line no-var
  var _mongoIndexesInitialized: boolean | undefined;
}

if (uri) {
  // Preserve client promise across HMR in development and across warm lambdas in serverless
  if (!global._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      // Attach catch handler immediately to prevent unhandled promise rejection process crash (exit code 128)
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn("⚠️ MongoDB Atlas connection notice (timeout/unreachable):", err?.message || err);
        console.warn("ℹ️ Falling back to in-memory data store for serverless stability.");
        return null;
      });
    } catch (initErr) {
      console.warn("⚠️ MongoClient constructor error:", initErr);
      global._mongoClientPromise = Promise.resolve(null);
    }
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Graceful fallback when MONGODB_URI is not set
  if (process.env.NODE_ENV !== "test") {
    console.info("ℹ️ MONGODB_URI not configured. Operating with in-memory fallback store.");
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    return connectedClient || null;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error);
    return null;
  }
}

export async function getDatabase(dbName?: string): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  const customDb = dbName || process.env.MONGODB_DB_NAME || "rangmanch_fest_db";
  return mongoClient.db(customDb);
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

/**
 * Initializes production indexes for collections to enforce constraints and optimize lookups
 */
export async function ensureMongoIndexes(): Promise<void> {
  if (global._mongoIndexesInitialized) return;
  const db = await getDatabase();
  if (!db) return;

  try {
    await Promise.allSettled([
      db.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true }),
      db.collection("registrations").createIndex({ id: 1 }, { unique: true }),
      db.collection("registrations").createIndex({ registrationNumber: 1 }, { unique: true }),
      db.collection("registrations").createIndex({ qrToken: 1 }, { unique: true }),
      db.collection("registrations").createIndex({ userId: 1 }),
      db.collection("payments").createIndex({ id: 1 }, { unique: true }),
      db.collection("payments").createIndex({ utrNumber: 1 }, { unique: true, sparse: true }),
      db.collection("payments").createIndex({ registrationId: 1 }),
      db.collection("tickets").createIndex({ id: 1 }, { unique: true }),
      db.collection("tickets").createIndex({ qrToken: 1 }, { unique: true }),
      db.collection("tickets").createIndex({ registrationId: 1 }),
      db.collection("events").createIndex({ id: 1 }, { unique: true }),
      db.collection("events").createIndex({ slug: 1 }, { unique: true, sparse: true }),
      db.collection("gallery").createIndex({ id: 1 }, { unique: true }),
      db.collection("qr_settings").createIndex({ id: 1 }, { unique: true }),
      db.collection("clubs").createIndex({ id: 1 }, { unique: true }),
      db.collection("clubs").createIndex({ slug: 1 }, { unique: true, sparse: true }),
    ]);
    global._mongoIndexesInitialized = true;
  } catch (err) {
    console.warn("MongoDB index creation notice:", err);
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

export async function getClubsCollection(): Promise<Collection | null> {
  const db = await getDatabase();
  return db ? db.collection("clubs") : null;
}

export default clientPromise;
