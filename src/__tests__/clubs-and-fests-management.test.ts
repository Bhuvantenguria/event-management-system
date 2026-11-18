import { describe, it, expect, beforeEach } from "vitest";
import { dataStore, StoredClub, StoredFest } from "@/lib/data-store";

describe("Cultural Clubs Creation, Fest Scheduling & Homepage Timer Autosync", () => {
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
      // Simulate injection of rogue dummy records
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

  describe("2. Cultural Clubs Management (CRUD)", () => {
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

    it("should allow admin to create a new collegiate cultural club", () => {
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

      const fetched = dataStore.getClubById(newClub.id);
      expect(fetched).toBeDefined();
      expect(fetched?.slug).toBe("raag-classical-orchestra");
      expect(fetched?.coordinator).toBe("Siddharth Joshi");
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

  describe("3. Fest Scheduling & Homepage Timer Autosync", () => {
    it("should provide an initial primary scheduled fest that anchors the homepage countdown", () => {
      const primaryFest = dataStore.getPrimaryFest();
      expect(primaryFest).toBeDefined();
      expect(primaryFest?.isPrimary).toBe(true);
      expect(primaryFest?.startDate).toBeDefined();

      const countdown = dataStore.getPrimaryCountdown();
      expect(countdown.isPrimary).toBe(true);
      expect(countdown.targetDate).toBe(primaryFest?.startDate);
      expect(countdown.festName).toContain("AffinityAIIMS");
    });

    it("should allow admin to schedule a new festival edition", () => {
      const newFest = dataStore.createFest({
        name: "Rangmanch Spring Fest 2027",
        edition: "Spring Heritage Edition",
        tagline: "Celebrating 100 Years of Awadh Culture",
        theme: "Awadhi Splendor",
        startDate: "2027-02-20T10:00:00",
        endDate: "2027-02-23T23:00:00",
        dateBadge: "20–23 February 2027",
        venue: "Varanasi Ghats Pavilion",
        description: "Special springtime cultural gathering with illuminated ghat performances.",
        isPrimary: false,
        status: "upcoming",
      });

      expect(newFest.id).toBeDefined();
      expect(newFest.id.startsWith("fest-")).toBe(true);
      expect(newFest.name).toBe("Rangmanch Spring Fest 2027");
      expect(newFest.isPrimary).toBe(false);

      const fests = dataStore.getAllFests();
      expect(fests.some((f) => f.id === newFest.id)).toBe(true);
    });

    it("should automatically sync homepage timeclock when admin sets a new primary fest", () => {
      // Current primary countdown
      const initialCountdown = dataStore.getPrimaryCountdown();

      // Admin schedules an earlier or flagship edition
      const flagshipFest = dataStore.createFest({
        name: "AffinityAIIMS Autumn Grand Fest 2026",
        edition: "Autumn Varsity Invitational",
        tagline: "Inter-Collegiate Supremacy",
        startDate: "2026-10-15T09:00:00",
        endDate: "2026-10-18T22:00:00",
        dateBadge: "15–18 October 2026",
        venue: "AIIMS Stadium Turf",
        isPrimary: true, // Mark as primary!
        status: "upcoming",
      });

      // Verify that the new fest is now primary and the previous one was unset
      expect(flagshipFest.isPrimary).toBe(true);
      const activePrimary = dataStore.getPrimaryFest();
      expect(activePrimary?.id).toBe(flagshipFest.id);

      // Verify homepage countdown timer autosynced to the new target date!
      const updatedCountdown = dataStore.getPrimaryCountdown();
      expect(updatedCountdown.targetDate).toBe("2026-10-15T09:00:00");
      expect(updatedCountdown.festName).toBe("AffinityAIIMS Autumn Grand Fest 2026");
      expect(updatedCountdown.dateBadge).toBe("15–18 October 2026");
      expect(updatedCountdown.targetDate).not.toBe(initialCountdown.targetDate);
    });

    it("should allow explicitly toggling primary fest with setPrimaryFest()", () => {
      const fests = dataStore.getAllFests();
      expect(fests.length).toBeGreaterThanOrEqual(2);

      const targetFest = fests[0];
      const success = dataStore.setPrimaryFest(targetFest.id);
      expect(success).toBe(true);

      const activePrimary = dataStore.getPrimaryFest();
      expect(activePrimary?.id).toBe(targetFest.id);

      const countdown = dataStore.getPrimaryCountdown();
      expect(countdown.targetDate).toBe(targetFest.startDate);
      expect(countdown.festName).toBe(targetFest.name);
    });

    it("should allow editing fest start date and immediately reflect in homepage countdown clock", () => {
      const primary = dataStore.getPrimaryFest()!;
      const newDate = "2026-04-05T08:30:00";

      const updated = dataStore.updateFest(primary.id, {
        startDate: newDate,
        dateBadge: "5–8 April 2026",
      });

      expect(updated?.startDate).toBe(newDate);

      // Verify timeclock autosyncs with updated start date
      const countdown = dataStore.getPrimaryCountdown();
      expect(countdown.targetDate).toBe(newDate);
      expect(countdown.dateBadge).toBe("5–8 April 2026");
    });
  });
});
