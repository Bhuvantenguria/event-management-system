import {
  dataStore,
  StoredUser,
  StoredRegistration,
  StoredPaymentSubmission,
  StoredTicket,
  StoredEvent,
  StoredGalleryItem,
} from "./data-store";
import {
  getDatabase,
  getUsersCollection,
  getRegistrationsCollection,
  getPaymentsCollection,
  getTicketsCollection,
  getEventsCollection,
  getGalleryCollection,
  getQrSettingsCollection,
  ensureMongoIndexes,
} from "./mongodb";

let isInitialized = false;
let isSyncing = false;

// Register persistence handler with dataStore so all writes automatically update MongoDB Atlas
dataStore.setPersistenceHandler(async (collection, filter, data, action = "upsert") => {
  if (!process.env.MONGODB_URI) return;
  try {
    const db = await getDatabase();
    if (!db) return;
    if (action === "delete") {
      await db.collection(collection).deleteOne(filter);
    } else {
      await db.collection(collection).updateOne(filter, { $set: data }, { upsert: true });
    }
  } catch (err) {
    console.error(`MongoDB persistence error for ${collection}:`, err);
  }
});

/**
 * Synchronize in-memory data store with live MongoDB Atlas database.
 * Seeds initial documents if collections are empty.
 */
export async function syncWithMongo(force = false): Promise<void> {
  if (!process.env.MONGODB_URI || isSyncing) return;
  if (isInitialized && !force) return;
  isSyncing = true;

  try {
    const db = await getDatabase();
    if (!db) {
      isSyncing = false;
      return;
    }

    // Ensure production indexes exist
    await ensureMongoIndexes();

    // 1. Sync Users
    const usersCol = await getUsersCollection();
    if (usersCol) {
      const dbUsers = (await usersCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredUser[];
      if (dbUsers.length > 0) {
        dataStore.loadUsersFromMongo(dbUsers);
      } else {
        // Seed default users to Atlas
        for (const u of dataStore.getAllUsers()) {
          await usersCol.updateOne({ id: u.id }, { $set: u }, { upsert: true });
        }
      }
    }

    // 2. Sync Registrations
    const regCol = await getRegistrationsCollection();
    if (regCol) {
      const dbRegs = (await regCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredRegistration[];
      if (dbRegs.length > 0) {
        dataStore.loadRegistrationsFromMongo(dbRegs);
      } else {
        for (const r of dataStore.getAllRegistrations()) {
          await regCol.updateOne({ id: r.id }, { $set: r }, { upsert: true });
        }
      }
    }

    // 3. Sync Payments
    const payCol = await getPaymentsCollection();
    if (payCol) {
      const dbPayments = (await payCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredPaymentSubmission[];
      if (dbPayments.length > 0) {
        dataStore.loadPaymentsFromMongo(dbPayments);
      } else {
        for (const p of dataStore.getAllPayments()) {
          await payCol.updateOne({ id: p.id }, { $set: p }, { upsert: true });
        }
      }
    }

    // 4. Sync Tickets
    const ticketCol = await getTicketsCollection();
    if (ticketCol) {
      const dbTickets = (await ticketCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredTicket[];
      if (dbTickets.length > 0) {
        dataStore.loadTicketsFromMongo(dbTickets);
      } else {
        for (const t of dataStore.getAllTickets()) {
          await ticketCol.updateOne({ id: t.id }, { $set: t }, { upsert: true });
        }
      }
    }

    // 5. Sync QR Settings
    const qrCol = await getQrSettingsCollection();
    if (qrCol) {
      const dbQr = await qrCol.findOne({ id: "global_qr_settings" }, { projection: { _id: 0 } });
      if (dbQr) {
        const { id, ...rest } = dbQr as any;
        dataStore.setQrSettings({ ...dataStore.getQrSettings(), ...rest });
      } else {
        await qrCol.updateOne(
          { id: "global_qr_settings" },
          { $set: { id: "global_qr_settings", ...dataStore.getQrSettings() } },
          { upsert: true }
        );
      }
    }

    // 6. Sync Events
    const eventsCol = await getEventsCollection();
    if (eventsCol) {
      const dbEvents = (await eventsCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredEvent[];
      if (dbEvents.length > 0) {
        dataStore.loadEventsFromMongo(dbEvents);
      } else {
        for (const ev of dataStore.getAllEvents()) {
          await eventsCol.updateOne({ id: ev.id }, { $set: ev }, { upsert: true });
        }
      }
    }

    // 7. Sync Gallery
    const galleryCol = await getGalleryCollection();
    if (galleryCol) {
      const dbGallery = (await galleryCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredGalleryItem[];
      if (dbGallery.length > 0) {
        dataStore.loadGalleryFromMongo(dbGallery);
      } else {
        for (const g of dataStore.getAllGalleryItems()) {
          await galleryCol.updateOne({ id: g.id }, { $set: g }, { upsert: true });
        }
      }
    }

    isInitialized = true;
  } catch (error) {
    console.error("Failed to sync data store with MongoDB Atlas:", error);
  } finally {
    isSyncing = false;
  }
}

export function isMongoSyncInitialized(): boolean {
  return isInitialized;
}
