import { describe, it, expect, beforeEach } from "vitest";
import { dataStore, StoredClub, parseEventDateTimeToIso } from "@/lib/data-store";

describe("Cultural Clubs Inline Creation, Primary Event Scheduling & Homepage Timer Autosync", () => {
  beforeEach(() => {
    // Ensure dataStore clean dummy data state
    dataStore.cleanDummyData();
  });

  describe("1. Database Cleanliness & Essential Admin Preservation", () => {
    it("should confirm all dummy registrations, payments, and tickets are removed from initial state", () => {
      const registrations = dataStore.getAllRegistrations();
      const payments = dataStore.getAllPayments();
      const tickets = dataStore.getAllTickets();

      // No demo dummy records
      const dummyRegs = registrations.filter((r) => r.id.startsWith("reg-demo"));
      const dummyPays = payments.filter((p) => p.id.startsWith("pay-100"));
      const dummyTkts = tickets.filter((t) => t.id.startsWith("tkt-100"));

      expect(dummyRegs.length).toBe(0);
      expect(dummyPays.length).toBe(0);
      expect(dummyTkts.length).toBe(0);
    });

    it("should preserve all essential administrator accounts", () => {
      const users = dataStore.getAllUsers();
      const adminUsers = users.filter((u) => u.role === "admin" || u.role === "super_admin");

      expect(adminUsers.length).toBeGreaterThanOrEqual(3);
      expect(users.some((u) => u.email === "admin@aiimsraebareli.edu.in")).toBe(true);
      expect(users.some((u) => u.email === "admin@rangmanchfest.in")).toBe(true);
      expect(users.some((u) => u.email === "admin@admin.com")).toBe(true);

      // Verify no dummy student accounts remain
      expect(users.some((u) => u.id === "usr-student-1")).toBe(false);
    });

    it("should purge dummy records via cleanDummyData() without affecting admin accounts", () => {
      (dataStore as any).registrations.push({
        id: "reg-demo-9999",
        registrationNumber: "REG-2026-9999",
        eventId: "test-event",
        eventTitle: "Test Event",
        userId: "usr-student-1",
        userName: "Fake Student",
        userEmail: "student@example.com",
        college: "Fake University",
        participationType: "individual",
        amount: 500,
        paymentStatus: "pending_verification",
        registrationStatus: "pending",
        qrToken: "FAKE-TOKEN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const purgeResult = dataStore.cleanDummyData();
      expect(purgeResult.purgedRegistrations).toBeGreaterThanOrEqual(1);

      const remainingRegs = dataStore.getAllRegistrations();
      expect(remainingRegs.some((r) => r.id === "reg-demo-9999")).toBe(false);

      // Admin accounts are still intact
      const admins = dataStore.getAllUsers().filter((u) => u.role === "admin" || u.role === "super_admin");
      expect(admins.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("2. Cultural Clubs Management (CRUD) & Inline Event Creation", () => {
    it("should list initial official collegiate cultural clubs", () => {
      const clubs = dataStore.getAllClubs();
      expect(clubs.length).toBeGreaterThanOrEqual(7);

      const mudra = dataStore.getClubBySlug("mudra-dance-society");
      expect(mudra).toBeDefined();
      expect(mudra?.name).toBe("Mudra Dance Society");
      expect(mudra?.category).toBe("Dance & Performing Arts");

      const varchasva = dataStore.getClubBySlug("varchasva-sports-council");
      expect(varchasva).toBeDefined();
      expect(varchasva?.name).toBe("Varchasva Sports Council");
    });

    it("should allow admin to create a new collegiate cultural club inline when creating an event", () => {
      const newClub = dataStore.createClub({
        name: "Raag Classical Orchestra",
        slug: "raag-classical-orchestra",
        category: "Music & Band Battles",
        motto: "Symphony of Sitar & Sarod",
        badge: "Chamber Music Ensemble",
        coordinator: "Siddharth Joshi",
        coordinatorEmail: "siddharth@aiimsraebareli.edu.in",
        coordinatorPhone: "+91 98765 77889",
        color: "from-fest-gold to-fest-plum",
        eventsHosted: ["Raag Malhar Jugalbandi", "Indian Symphony Showcase"],
        eventCount: "2 Contests",
        prizes: "₹45,000",
        description: "Promoting Indian classical instrumental orchestration among medical and engineering scholars.",
      });

      expect(newClub.id).toBeDefined();
      expect(newClub.id.startsWith("club-")).toBe(true);
      expect(newClub.name).toBe("Raag Classical Orchestra");

      // Verify club can now be assigned to an event
      const eventWithClub = dataStore.createEvent({
        title: "Raag Malhar Jugalbandi Night",
        slug: "raag-malhar-jugalbandi",
        category: "Music & Bands",
        categoryKey: "music",
        club: newClub.name,
        description: "Enchanting twilight recital of monsoon ragas.",
        date: "14 March 2026",
        time: "06:30 PM",
        venue: "Saraswati Amphitheatre",
        registrationFee: 400,
        teamSize: "1–3 Instrumentalists",
        prizePool: "₹25,000",
        poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        status: "Registration Open",
      });

      expect(eventWithClub.club).toBe("Raag Classical Orchestra");
    });

    it("should allow admin to update club details", () => {
      const club = dataStore.createClub({
        name: "Canvas Guild",
        slug: "canvas-guild",
        category: "Fine Arts & Design",
        motto: "Original strokes",
        badge: "Artists Guild",
      });

      const updated = dataStore.updateClub(club.id, {
        name: "Canvas Guild of Awadh",
        motto: "Preserving Awadhi Miniature Murals",
        prizes: "₹60,000",
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe("Canvas Guild of Awadh");
      expect(updated?.motto).toBe("Preserving Awadhi Miniature Murals");
      expect(updated?.prizes).toBe("₹60,000");

      const retrieved = dataStore.getClubById(club.id);
      expect(retrieved?.name).toBe("Canvas Guild of Awadh");
    });

    it("should allow admin to delete a club", () => {
      const club = dataStore.createClub({
        name: "Temporary Society",
        slug: "temporary-society",
        category: "Other Student Society",
      });

      expect(dataStore.getClubById(club.id)).toBeDefined();

      const deleted = dataStore.deleteClub(club.id);
      expect(deleted).toBe(true);
      expect(dataStore.getClubById(club.id)).toBeUndefined();
    });
  });

  describe("3. Primary Event Scheduling & Homepage Timer Autosync", () => {
    it("should correctly parse date and time string formats into valid ISO timestamps", () => {
      const iso1 = parseEventDateTimeToIso("13 March 2026", "05:00 PM");
      expect(iso1).toBeDefined();
      const d1 = new Date(iso1);
      expect(d1.getFullYear()).toBe(2026);
      expect(d1.getMonth()).toBe(2); // March is 0-indexed 2

      const iso2 = parseEventDateTimeToIso("12–15 March 2026", "08:00 AM");
      const d2 = new Date(iso2);
      expect(d2.getFullYear()).toBe(2026);
      expect(d2.getDate()).toBe(12); // First day of range
    });

    it("should identify the initial primary event and provide countdown data with direct registrationUrl", () => {
      const primaryEvent = dataStore.getPrimaryEvent();
      expect(primaryEvent).toBeDefined();
      expect(primaryEvent?.isPrimary).toBe(true);

      const countdown = dataStore.getPrimaryEventCountdown();
      expect(countdown.success).toBe(true);
      expect(countdown.primaryEvent).toBeDefined();
      expect(countdown.title).toBe(primaryEvent?.title);
      expect(countdown.registrationUrl).toBe(`/events/${primaryEvent?.slug}/register`);
      expect(countdown.targetDate).toBeDefined();
    });

    it("should automatically sync homepage countdown and registration CTA when admin creates or sets a new primary event", () => {
      // Create a new flagship event with isPrimary: true
      const newPrimary = dataStore.createEvent({
        title: "Grand Battle of Bands 2026",
        slug: "grand-battle-of-bands-2026",
        category: "Music & Bands",
        categoryKey: "music",
        club: "Dhwani Music Society",
        description: "The ultimate pan-India battle of collegiate bands.",
        date: "15 March 2026",
        time: "07:00 PM",
        venue: "Main Festival Arena",
        registrationFee: 1000,
        teamSize: "3–8 Musicians",
        prizePool: "₹1,00,000",
        poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
        status: "Registration Open",
        isPrimary: true, // Mark as primary!
      });

      // Verify that this event is now primary
      expect(newPrimary.isPrimary).toBe(true);

      const activePrimary = dataStore.getPrimaryEvent();
      expect(activePrimary?.id).toBe(newPrimary.id);

      // Verify countdown details are synchronized
      const countdown = dataStore.getPrimaryEventCountdown();
      expect(countdown.title).toBe("Grand Battle of Bands 2026");
      expect(countdown.registrationUrl).toBe("/events/grand-battle-of-bands-2026/register");
      expect(countdown.prizePool).toBe("₹1,00,000");

      // Verify other events no longer have isPrimary: true
      const previousPrimary = dataStore.getEventById("kathak-jugalbandi");
      expect(previousPrimary?.isPrimary).toBe(false);
    });

    it("should allow explicitly toggling primary event via setPrimaryEvent()", () => {
      const success = dataStore.setPrimaryEvent("kathak-jugalbandi");
      expect(success).toBe(true);

      const activePrimary = dataStore.getPrimaryEvent();
      expect(activePrimary?.slug).toBe("kathak-jugalbandi");
      expect(activePrimary?.isPrimary).toBe(true);

      const countdown = dataStore.getPrimaryEventCountdown();
      expect(countdown.registrationUrl).toBe("/events/kathak-jugalbandi/register");
      expect(countdown.title).toContain("Kathak Jugalbandi");
    });
  });
});
