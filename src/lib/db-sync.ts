import {
  dataStore,
  StoredUser,
  StoredRegistration,
  StoredPaymentSubmission,
  StoredTicket,
  StoredEvent,
  StoredGalleryItem,
  StoredClub,
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
  getClubsCollection,
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
 * Purge all legacy dummy/demo records (mock registrations, mock payments, mock tickets, mock test student)
 * from both the in-memory dataStore and MongoDB Atlas, keeping only essential admin data, clubs, and fests.
 */
export async function purgeDummyDataFromMongo(): Promise<{
  deletedUsers: number;
  deletedRegistrations: number;
  deletedPayments: number;
  deletedTickets: number;
}> {
  // 1. Clean in-memory dataStore
  const localClean = dataStore.cleanDummyData();

  let deletedUsers = localClean.purgedUsers;
  let deletedRegistrations = localClean.purgedRegistrations;
  let deletedPayments = localClean.purgedPayments;
  let deletedTickets = localClean.purgedTickets;

  if (!process.env.MONGODB_URI) {
    return { deletedUsers, deletedRegistrations, deletedPayments, deletedTickets };
  }

  try {
    const db = await getDatabase();
    if (db) {
      // Delete dummy students
      const uRes = await db.collection("users").deleteMany({
        $or: [{ id: "usr-student-1" }, { email: "student@example.com" }],
      });
      deletedUsers = Math.max(deletedUsers, uRes.deletedCount);

      // Delete dummy registrations
      const rRes = await db.collection("registrations").deleteMany({
        $or: [{ id: { $regex: /^reg-demo/ } }, { userId: "usr-student-1" }, { userEmail: "student@example.com" }],
      });
      deletedRegistrations = Math.max(deletedRegistrations, rRes.deletedCount);

      // Delete dummy payments
      const pRes = await db.collection("payments").deleteMany({
        $or: [
          { id: { $regex: /^pay-100/ } },
          { registrationId: { $regex: /^reg-demo/ } },
          { utrNumber: "407512889912" },
          { utrNumber: "407519992341" },
        ],
      });
      deletedPayments = Math.max(deletedPayments, pRes.deletedCount);

      // Delete dummy tickets
      const tRes = await db.collection("tickets").deleteMany({
        $or: [
          { id: { $regex: /^tkt-100/ } },
          { registrationId: { $regex: /^reg-demo/ } },
          { participantEmail: "student@example.com" },
          { qrToken: "RNG-TKT-778899-KATHAK" },
        ],
      });
      deletedTickets = Math.max(deletedTickets, tRes.deletedCount);
    }
  } catch (err) {
    console.warn("Notice: Error while purging legacy dummy data from MongoDB Atlas:", err);
  }

  return { deletedUsers, deletedRegistrations, deletedPayments, deletedTickets };
}

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

    // 0. Automatically purge any legacy dummy/demo records from Atlas on first sync
    await purgeDummyDataFromMongo();

    // 1. Sync Users
    const usersCol = await getUsersCollection();
    if (usersCol) {
      const dbUsers = (await usersCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredUser[];
      if (dbUsers.length > 0) {
        dataStore.loadUsersFromMongo(dbUsers);
      } else {
        // Seed default essential users to Atlas
        for (const u of dataStore.getAllUsers()) {
          await usersCol.updateOne({ id: u.id }, { $set: u }, { upsert: true });
        }
      }

      // Ensure all Admin accounts are always guaranteed to exist in Atlas
      const adminUsers = dataStore.getAllUsers().filter((u) => u.role === "admin" || u.role === "super_admin");
      for (const admin of adminUsers) {
        await usersCol.updateOne(
          { email: admin.email.toLowerCase() },
          { $set: admin },
          { upsert: true }
        );
      }
    }

    // 2. Sync Registrations
    const regCol = await getRegistrationsCollection();
    if (regCol) {
      const dbRegs = (await regCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredRegistration[];
      if (dbRegs.length > 0) {
        dataStore.loadRegistrationsFromMongo(dbRegs);
      }
    }

    // 3. Sync Payments
    const payCol = await getPaymentsCollection();
    if (payCol) {
      const dbPayments = (await payCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredPaymentSubmission[];
      if (dbPayments.length > 0) {
        dataStore.loadPaymentsFromMongo(dbPayments);
      }
    }

    // 4. Sync Tickets
    const ticketCol = await getTicketsCollection();
    if (ticketCol) {
      const dbTickets = (await ticketCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredTicket[];
      if (dbTickets.length > 0) {
        dataStore.loadTicketsFromMongo(dbTickets);
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

    // 8. Sync Cultural Clubs
    const clubsCol = await getClubsCollection();
    if (clubsCol) {
      const dbClubs = (await clubsCol.find({}, { projection: { _id: 0 } }).toArray()) as unknown as StoredClub[];
      if (dbClubs.length > 0) {
        dataStore.loadClubsFromMongo(dbClubs);
      } else {
        for (const club of dataStore.getAllClubs()) {
          await clubsCol.updateOne({ id: club.id }, { $set: club }, { upsert: true });
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
