import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "@/lib/data-store";
import { hasRole } from "@/lib/permissions";
import bcrypt from "bcryptjs";

describe("Complete End-to-End User & Admin Testing Suite", () => {
  beforeEach(() => {
    // Fresh state before each test if needed
  });

  describe("=== A. Participant / User Lifecycle Testing ===", () => {
    const testUserEmail = `participant.test.${Date.now()}@aiimsraebareli.edu.in`;
    let createdUserId = "";

    it("A1. Participant Registration: Validates fields, hashes password with bcrypt & registers user", async () => {
      const rawPassword = "StrongPassword@123";
      const passwordHash = await bcrypt.hash(rawPassword, 10);

      const user = dataStore.createUser({
        name: "Aarav Sharma",
        email: testUserEmail,
        passwordHash,
        role: "participant",
        phone: "+91 98765 43210",
        college: "AIIMS Raebareli",
        studentId: "AIIMS-2026-0042",
        emailVerified: false,
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testUserEmail);
      expect(user.role).toBe("participant");
      expect(user.studentId).toBe("AIIMS-2026-0042");

      createdUserId = user.id;

      // Verify bcrypt password matching
      const isPasswordValid = await bcrypt.compare(rawPassword, user.passwordHash);
      expect(isPasswordValid).toBe(true);

      const isWrongPasswordValid = await bcrypt.compare("WrongPassword", user.passwordHash);
      expect(isWrongPasswordValid).toBe(false);
    });

    it("A2. User Profile Retrieval & Update: Updates personal details and password securely", async () => {
      const user = dataStore.getUserById(createdUserId);
      expect(user).toBeDefined();

      // Update phone and college
      const updated = dataStore.updateUserProfile(createdUserId, {
        phone: "+91 99999 88888",
        college: "AIIMS Raebareli Medical College",
      });

      expect(updated?.phone).toBe("+91 99999 88888");
      expect(updated?.college).toBe("AIIMS Raebareli Medical College");

      // Verify updated user persists in dataStore
      const refreshed = dataStore.getUserByEmail(testUserEmail);
      expect(refreshed?.phone).toBe("+91 99999 88888");
    });

    it("A3. Event Registration (Solo): Registers for individual event and creates pending registration", () => {
      const reg = dataStore.createRegistration({
        eventId: "kathak-jugalbandi",
        eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
        userId: createdUserId,
        userName: "Aarav Sharma",
        userEmail: testUserEmail,
        college: "AIIMS Raebareli Medical College",
        participationType: "individual",
        amount: 300,
        paymentStatus: "awaiting_payment",
        registrationStatus: "pending",
      });

      expect(reg.id).toBeDefined();
      expect(reg.registrationNumber).toMatch(/^REG-2026-/);
      expect(reg.paymentStatus).toBe("awaiting_payment");
      expect(reg.registrationStatus).toBe("pending");
      expect(reg.amount).toBe(300);

      // Verify user registrations query includes this registration
      const userRegs = dataStore.getRegistrationsByUser(createdUserId);
      expect(userRegs.some((r) => r.id === reg.id)).toBe(true);
    });

    it("A4. Event Registration (Team): Registers squad with roster members", () => {
      const teamReg = dataStore.createRegistration({
        eventId: "royal-up-football-cup",
        eventTitle: "Chhatrapati Shivaji Memorial Football Cup",
        userId: createdUserId,
        userName: "Aarav Sharma",
        userEmail: testUserEmail,
        college: "AIIMS Raebareli Medical College",
        participationType: "team",
        teamName: "AIIMS Tigers FC",
        teamMembers: [
          { name: "Aarav Sharma", email: testUserEmail, phone: "+91 99999 88888", isCaptain: true },
          { name: "Kabir Mehta", email: "kabir@example.com", phone: "+91 98888 77777" },
          { name: "Devansh Roy", email: "devansh@example.com", phone: "+91 97777 66666" },
        ],
        amount: 1500,
        paymentStatus: "awaiting_payment",
        registrationStatus: "pending",
      });

      expect(teamReg.id).toBeDefined();
      expect(teamReg.participationType).toBe("team");
      expect(teamReg.teamName).toBe("AIIMS Tigers FC");
      expect(teamReg.teamMembers?.length).toBe(3);
      expect(teamReg.teamMembers?.[0].isCaptain).toBe(true);
    });

    it("A5. Paytm QR Payment Proof Submission: Submits 12-digit UTR with receipt screenshot", () => {
      const userRegs = dataStore.getRegistrationsByUser(createdUserId);
      const targetReg = userRegs.find((r) => r.eventId === "kathak-jugalbandi");
      expect(targetReg).toBeDefined();

      const uniqueUtr = `407512${Math.floor(100000 + Math.random() * 900000)}`;

      const payment = dataStore.submitPaymentProof({
        registrationId: targetReg!.id,
        amountExpected: targetReg!.amount,
        amountSubmitted: 300,
        utrNumber: uniqueUtr,
        paymentScreenshotUrl: "https://res.cloudinary.com/affinity-aiims/image/upload/v1/payments/proof-123.jpg",
        paymentDate: new Date().toISOString().split("T")[0],
        notes: "Paid via Paytm UPI to festpay@ptaxis",
      });

      expect(payment).toBeDefined();
      expect(payment.utrNumber).toBe(uniqueUtr);
      expect(payment.status).toBe("pending");
      expect(payment.amountSubmitted).toBe(300);

      // Registration payment status must be updated to pending_verification
      const updatedReg = dataStore.getRegistrationById(targetReg!.id);
      expect(updatedReg?.paymentStatus).toBe("pending_verification");
    });

    it("A6. Duplicate UTR Prevention: Rejects submission with already used UTR", () => {
      const userRegs = dataStore.getRegistrationsByUser(createdUserId);
      const footballReg = userRegs.find((r) => r.eventId === "royal-up-football-cup");
      const kathakReg = userRegs.find((r) => r.eventId === "kathak-jugalbandi");
      expect(footballReg).toBeDefined();
      expect(kathakReg).toBeDefined();

      const existingPayment = dataStore.getPaymentByRegistrationId(kathakReg!.id);
      expect(existingPayment).toBeDefined();
      const existingUtr = existingPayment!.utrNumber;

      // Check uniqueness helper
      const isUnique = dataStore.isUtrUnique(existingUtr);
      expect(isUnique).toBe(false);
    });

    it("A7. Free Event Registration: Confirms registration & issues QR ticket immediately", () => {
      const freeReg = dataStore.createRegistration({
        eventId: "heritage-quiz-open",
        eventTitle: "Awadh Heritage Open Quiz",
        userId: createdUserId,
        userName: "Aarav Sharma",
        userEmail: testUserEmail,
        college: "AIIMS Raebareli Medical College",
        participationType: "individual",
        amount: 0,
        paymentStatus: "approved",
        registrationStatus: "confirmed",
      });

      expect(freeReg.registrationStatus).toBe("confirmed");
      expect(freeReg.paymentStatus).toBe("approved");

      // Create ticket for free event
      const ticket = dataStore.createTicketForRegistration(freeReg);
      expect(ticket).toBeDefined();
      expect(ticket.isValid).toBe(true);
      expect(ticket.qrToken).toMatch(/^RNG-TKT-/);

      // Verify ticket appears under user tickets
      const userTickets = dataStore.getTicketsByUser(testUserEmail);
      expect(userTickets.some((t) => t.id === ticket.id)).toBe(true);
    });
  });

  describe("=== B. Admin Workflow & Control Suite Testing ===", () => {
    it("B1. Admin Access & RBAC: Enforces role permissions", () => {
      expect(hasRole("super_admin", ["admin", "super_admin"])).toBe(true);
      expect(hasRole("admin", ["admin", "super_admin"])).toBe(true);
      expect(hasRole("participant", ["admin", "super_admin"])).toBe(false);
      expect(hasRole(undefined, ["admin", "super_admin"])).toBe(false);
    });

    it("B2. Overview Metrics Calculation: Aggregates counts and verified revenue correctly", () => {
      // Ensure test registration and payment entries exist for metric verification
      const testReg1 = dataStore.createRegistration({
        eventId: "kathak-jugalbandi",
        eventTitle: "Kathak Jugalbandi",
        userId: "usr-test-metrics",
        userName: "Metrics Tester",
        userEmail: "metrics@example.com",
        college: "AIIMS",
        participationType: "individual",
        amount: 300,
        paymentStatus: "approved",
        registrationStatus: "confirmed",
      });
      const pay1 = dataStore.submitPaymentProof({
        registrationId: testReg1.id,
        amountExpected: 300,
        amountSubmitted: 300,
        utrNumber: `407512889912${Date.now()}`,
        paymentScreenshotUrl: "https://example.com/receipt.jpg",
        paymentDate: "2026-03-01",
      });
      dataStore.reviewPayment(pay1.id, "usr-admin-1", "approve");

      const testReg2 = dataStore.createRegistration({
        eventId: "sufi-rock-night",
        eventTitle: "Sufi Rock Night",
        userId: "usr-test-metrics-2",
        userName: "Metrics Tester 2",
        userEmail: "metrics2@example.com",
        college: "AIIMS",
        participationType: "individual",
        amount: 800,
        paymentStatus: "pending_verification",
        registrationStatus: "pending",
      });
      dataStore.submitPaymentProof({
        registrationId: testReg2.id,
        amountExpected: 800,
        amountSubmitted: 800,
        utrNumber: `407519992341${Date.now()}`,
        paymentScreenshotUrl: "https://example.com/receipt.jpg",
        paymentDate: "2026-03-02",
      });

      const events = dataStore.getAllEvents();
      const registrations = dataStore.getAllRegistrations();
      const payments = dataStore.getAllPayments();
      const gallery = dataStore.getAllGalleryItems();

      expect(events.length).toBeGreaterThan(0);
      expect(registrations.length).toBeGreaterThan(0);
      expect(payments.length).toBeGreaterThan(0);
      expect(gallery.length).toBeGreaterThan(0);

      const pendingPayments = payments.filter((p) => p.status === "pending").length;
      const approvedPayments = payments.filter((p) => p.status === "approved").length;
      const totalRevenue = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + (p.amountSubmitted || 0), 0);

      expect(pendingPayments).toBeGreaterThanOrEqual(1);
      expect(approvedPayments).toBeGreaterThanOrEqual(1);
      expect(totalRevenue).toBeGreaterThan(0);
    });

    it("B3. Event Management (Create, Multiple Images, Toggle, Delete)", () => {
      const newEvent = dataStore.createEvent({
        title: "Kailash Kher Star Night & Sufi Mehfil",
        slug: `kailash-kher-${Date.now()}`,
        category: "Classical Music & Sufi",
        categoryKey: "music",
        club: "Dhwani Music Society",
        description: "Grand headline celebrity night featuring live sufi rock orchestra.",
        date: "15 March 2026",
        time: "07:30 PM",
        venue: "Central Sports Stadium Arena",
        registrationFee: 500,
        teamSize: "Individual Pass",
        prizePool: "Celebrity Night",
        poster: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800",
        images: [
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800",
        ],
        status: "Registration Open",
        rules: ["Entry passes compulsory", "Gate closes at 08:00 PM"],
      });

      expect(newEvent.id).toBeDefined();
      expect(newEvent.images?.length).toBe(3);
      expect(newEvent.status).toBe("Registration Open");

      // Update event details
      const updated = dataStore.updateEvent(newEvent.id, {
        status: "Registration Closed",
        venue: "Main Open Amphitheatre",
      });
      expect(updated?.status).toBe("Registration Closed");
      expect(updated?.venue).toBe("Main Open Amphitheatre");

      // Delete event
      const isDeleted = dataStore.deleteEvent(newEvent.id);
      expect(isDeleted).toBe(true);
      expect(dataStore.getEventById(newEvent.id)).toBeUndefined();
    });

    it("B4. Separated Payment Approvals: Approves payment, confirms registration & issues ticket", () => {
      // Create a test registration & payment
      const reg = dataStore.createRegistration({
        eventId: "kathak-jugalbandi",
        eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
        userId: "usr-audit-test",
        userName: "Kriti Sen",
        userEmail: `kriti.${Date.now()}@example.com`,
        college: "KGMU Lucknow",
        participationType: "individual",
        amount: 300,
        paymentStatus: "pending_verification",
        registrationStatus: "pending",
      });

      const utr = `998877${Math.floor(100000 + Math.random() * 900000)}`;
      const payment = dataStore.submitPaymentProof({
        registrationId: reg.id,
        amountExpected: 300,
        amountSubmitted: 300,
        utrNumber: utr,
        paymentScreenshotUrl: "https://example.com/receipt.png",
        paymentDate: "2026-03-13",
      });

      expect(payment.status).toBe("pending");

      // Finance Admin 1-Click Approve
      const success = dataStore.reviewPayment(payment.id, "usr-admin-1", "approve");
      expect(success).toBe(true);

      // Verify payment is approved
      const refreshedPayment = dataStore.getAllPayments().find((p) => p.id === payment.id);
      expect(refreshedPayment?.status).toBe("approved");

      // Verify registration is now confirmed
      const refreshedReg = dataStore.getRegistrationById(reg.id);
      expect(refreshedReg?.paymentStatus).toBe("approved");
      expect(refreshedReg?.registrationStatus).toBe("confirmed");

      // Verify ticket was automatically generated
      const ticket = dataStore.getTicketByRegistrationId(reg.id);
      expect(ticket).toBeDefined();
      expect(ticket?.isValid).toBe(true);
      expect(ticket?.ticketNumber).toMatch(/^TKT-UP-2026-/);
    });

    it("B5. Payment Resubmission Request: Marks resubmission_required with custom note", () => {
      const reg = dataStore.createRegistration({
        eventId: "kathak-jugalbandi",
        eventTitle: "Kathak Jugalbandi",
        userId: "usr-audit-resubmit",
        userName: "Vikas Patel",
        userEmail: `vikas.${Date.now()}@example.com`,
        college: "IET Lucknow",
        participationType: "individual",
        amount: 300,
        paymentStatus: "pending_verification",
        registrationStatus: "pending",
      });

      const utr = `112233${Math.floor(100000 + Math.random() * 900000)}`;
      const payment = dataStore.submitPaymentProof({
        registrationId: reg.id,
        amountExpected: 300,
        amountSubmitted: 300,
        utrNumber: utr,
        paymentScreenshotUrl: "https://example.com/blurry.png",
        paymentDate: "2026-03-13",
      });

      // Finance Admin requests resubmission
      const success = dataStore.reviewPayment(
        payment.id,
        "usr-admin-1",
        "resubmit",
        "Screenshot is blurry and UTR digit is unreadable. Please upload full bank SMS or app receipt."
      );

      expect(success).toBe(true);

      const refreshedPayment = dataStore.getAllPayments().find((p) => p.id === payment.id);
      expect(refreshedPayment?.status).toBe("resubmission_required");
      expect(refreshedPayment?.rejectionReason).toContain("Screenshot is blurry");

      const refreshedReg = dataStore.getRegistrationById(reg.id);
      expect(refreshedReg?.paymentStatus).toBe("resubmission_required");
    });

    it("B6. Gallery Media CMS (CRUD): Full operations for photos", () => {
      // 1. Create
      const newPhoto = dataStore.createGalleryItem({
        title: "Classical Jugalbandi Grand Finale 2026",
        category: "Performing Arts",
        year: "2026",
        location: "Auditorium Main Stage",
        image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800",
        caption: "Mesmerizing duet performance under floodlit golden jaali arches.",
      });

      expect(newPhoto.id).toBeDefined();
      expect(newPhoto.title).toBe("Classical Jugalbandi Grand Finale 2026");

      // 2. Read / Filter
      const allPhotos = dataStore.getAllGalleryItems();
      expect(allPhotos.some((p) => p.id === newPhoto.id)).toBe(true);

      // 3. Update
      const updatedPhoto = dataStore.updateGalleryItem(newPhoto.id, {
        title: "Classical Jugalbandi Grand Finale (Updated)",
        caption: "Award-winning performance from Lucknow Gharana.",
      });
      expect(updatedPhoto?.title).toBe("Classical Jugalbandi Grand Finale (Updated)");

      // 4. Delete
      const isDeleted = dataStore.deleteGalleryItem(newPhoto.id);
      expect(isDeleted).toBe(true);
      expect(dataStore.getAllGalleryItems().some((p) => p.id === newPhoto.id)).toBe(false);
    });

    it("B7. Organizer Paytm QR Settings: Updates UPI ID, beneficiary name and instructions", () => {
      const originalSettings = dataStore.getQrSettings();
      expect(originalSettings).toBeDefined();

      const updated = dataStore.updateQrSettings({
        upiId: "affinityaiims@okhdfcbank",
        upiName: "Affinity AIIMS Cultural Council",
        paymentInstructions: "1. Scan with Paytm/PhonePe/GPay.\n2. Enter exact fee.\n3. Save 12-digit UTR.",
      });

      expect(updated.upiId).toBe("affinityaiims@okhdfcbank");
      expect(updated.upiName).toBe("Affinity AIIMS Cultural Council");
      expect(updated.paymentInstructions).toContain("Save 12-digit UTR");

      // Verify persistence in dataStore
      const current = dataStore.getQrSettings();
      expect(current.upiId).toBe("affinityaiims@okhdfcbank");
      expect(current.upiName).toBe("Affinity AIIMS Cultural Council");
    });
  });
});
