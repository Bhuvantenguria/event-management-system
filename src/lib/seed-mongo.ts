import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import {
  getMongoClient,
  getDatabase,
  getUsersCollection,
  getEventsCollection,
  getGalleryCollection,
  getQrSettingsCollection,
  ensureMongoIndexes,
} from "./mongodb";
import { dataStore } from "./data-store";

async function main() {
  console.log("🚀 Starting MongoDB Atlas Seed for Rangmanch '26...");

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in environment. Please check your .env or .env.local file.");
    process.exit(1);
  }

  const client = await getMongoClient();
  if (!client) {
    console.error("❌ Could not connect to MongoDB Atlas. Please verify your connection string and credentials.");
    process.exit(1);
  }

  const db = await getDatabase();
  if (!db) {
    console.error("❌ Could not access target database.");
    process.exit(1);
  }

  console.log(`✅ Connected to MongoDB Atlas: ${db.databaseName}`);

  // 1. Ensure indexes
  console.log("⚙️  Ensuring collection indexes...");
  await ensureMongoIndexes();
  console.log("✅ Indexes verified.");

  // 2. Seed Users
  const usersCol = await getUsersCollection();
  if (usersCol) {
    const existingUsersCount = await usersCol.countDocuments();
    if (existingUsersCount === 0) {
      console.log("🌱 Seeding initial administrative and participant users...");
      const defaultUsers = dataStore.getAllUsers();
      for (const u of defaultUsers) {
        await usersCol.updateOne({ id: u.id }, { $set: u }, { upsert: true });
      }
      console.log(`✅ Seeded ${defaultUsers.length} initial users.`);
    } else {
      console.log(`ℹ️ Users collection already has ${existingUsersCount} records. Skipping user seeding.`);
    }
  }

  // 3. Seed Events
  const eventsCol = await getEventsCollection();
  if (eventsCol) {
    const existingEventsCount = await eventsCol.countDocuments();
    if (existingEventsCount === 0) {
      console.log("🌱 Seeding festival competitions and cultural events...");
      const defaultEvents = dataStore.getAllEvents();
      for (const ev of defaultEvents) {
        await eventsCol.updateOne({ id: ev.id }, { $set: ev }, { upsert: true });
      }
      console.log(`✅ Seeded ${defaultEvents.length} cultural events.`);
    } else {
      console.log(`ℹ️ Events collection already has ${existingEventsCount} records. Skipping events seeding.`);
    }
  }

  // 4. Seed Gallery
  const galleryCol = await getGalleryCollection();
  if (galleryCol) {
    const existingGalleryCount = await galleryCol.countDocuments();
    if (existingGalleryCount === 0) {
      console.log("🌱 Seeding visual heritage gallery...");
      const defaultGallery = dataStore.getAllGalleryItems();
      for (const g of defaultGallery) {
        await galleryCol.updateOne({ id: g.id }, { $set: g }, { upsert: true });
      }
      console.log(`✅ Seeded ${defaultGallery.length} gallery items.`);
    } else {
      console.log(`ℹ️ Gallery collection already has ${existingGalleryCount} items. Skipping gallery seeding.`);
    }
  }

  // 5. Seed QR Settings
  const qrCol = await getQrSettingsCollection();
  if (qrCol) {
    const existingQr = await qrCol.findOne({ id: "global_qr_settings" });
    if (!existingQr) {
      console.log("🌱 Initializing Paytm UPI QR payment settings...");
      const defaultQr = dataStore.getQrSettings();
      await qrCol.updateOne(
        { id: "global_qr_settings" },
        { $set: { id: "global_qr_settings", ...defaultQr } },
        { upsert: true }
      );
      console.log("✅ Paytm UPI QR settings initialized.");
    } else {
      console.log("ℹ️ Paytm UPI QR settings already configured. Skipping QR seeding.");
    }
  }

  console.log("\n🎉 MongoDB Atlas initialization and seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Fatal error during MongoDB seed:", err);
  process.exit(1);
});
