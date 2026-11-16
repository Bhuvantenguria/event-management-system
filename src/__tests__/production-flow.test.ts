import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "@/lib/data-store";
import { emailDispatchLogs, sendWelcomeEmail, sendPaymentApprovalEmail, sendPaymentRejectionEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

describe("Complete Production Flow & Service Integrations (MongoDB, Cloudinary, Nodemailer, NextAuth)", () => {
  beforeEach(() => {
    emailDispatchLogs.length = 0;
  });

  it("1. User Registration Flow: Hashes password, registers user and triggers welcome email", async () => {
    const testEmail = `kathak.dancer.${Date.now()}@example.com`;
    const rawPass = "KathakPass@2026";
    const passwordHash = await bcrypt.hash(rawPass, 10);

    const user = dataStore.createUser({
      name: "Meera Bai",
      email: testEmail,
      passwordHash,
      role: "participant",
      college: "Banaras Hindu University",
      phone: "+91 98765 11111",
      emailVerified: false,
    });

    await dataStore.flushPending();

    expect(user.id).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(await bcrypt.compare(rawPass, user.passwordHash)).toBe(true);

    // Trigger Nodemailer welcome email
    await sendWelcomeEmail(user.email, user.name);

    expect(emailDispatchLogs.length).toBeGreaterThanOrEqual(1);
    const welcomeLog = emailDispatchLogs.find((l) => l.type === "welcome");
    expect(welcomeLog).toBeDefined();
    expect(welcomeLog?.to).toBe(testEmail);
    expect(welcomeLog?.subject).toContain("Welcome to Rangmanch UP 2026");
  });

  it("2. Event Creation & Validation Flow: Admin creates event with pricing and rules", async () => {
    const event = dataStore.createEvent({
      title: "Awadhi Gazal Mehfil",
      slug: `awadhi-gazal-${Date.now()}`,
      category: "Music & Vocal",
      categoryKey: "music",
      club: "Raag Music Society",
      description: "Classical and semi-classical Awadhi Gazal competition.",
      date: "2026-03-14",
      time: "18:00",
      venue: "Ganga Ghat Open Air Amphitheatre",
      registrationFee: 250,
      teamSize: "Solo",
      prizePool: "₹25,000",
      poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
      status: "Registration Open",
      rules: ["Time limit: 8 minutes", "Only traditional ghazal compositions permitted"],
    });

    await dataStore.flushPending();

    const fetched = dataStore.getEventBySlug(event.slug);
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe("Awadhi Gazal Mehfil");
    expect(fetched?.registrationFee).toBe(250);
  });

  it("3. Registration & Paytm UPI Proof Submission Flow with UTR Uniqueness", async () => {
    const reg = dataStore.createRegistration({
      eventId: "kathak-jugalbandi",
      eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
      userId: "usr-student-test",
      userName: "Rohan Varma",
      userEmail: "rohan.varma@example.com",
      college: "Lucknow University",
      participationType: "individual",
      amount: 300,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    expect(reg.id).toBeDefined();
    expect(reg.registrationNumber).toContain("REG-2026-");

    // 4. Cloudinary upload handling
    const mockBase64Screenshot = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/";
    const uploadResult = await uploadToCloudinary(mockBase64Screenshot);
    expect(uploadResult.success).toBe(true);
    expect(uploadResult.url).toBeDefined();

    // 5. Submit Paytm UPI Payment Proof
    const uniqueUtr = `UPI${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: reg.amount,
      amountSubmitted: 300,
      utrNumber: uniqueUtr,
      paymentScreenshotUrl: uploadResult.url,
      paymentDate: "2026-03-10",
      notes: "Paid via Paytm UPI",
    });

    await dataStore.flushPending();

    expect(payment.id).toBeDefined();
    expect(payment.status).toBe("pending");

    // Duplicate UTR prevention check
    const isUtrUnique = dataStore.isUtrUnique(uniqueUtr);
    expect(isUtrUnique).toBe(false); // Should detect collision
  });

  it("4. Finance Admin Approval & Ticket Generation & Email Dispatch Flow", async () => {
    const reg = dataStore.createRegistration({
      eventId: "dhamaka-rock",
      eventTitle: "Battle of the Bands – Rock Confluence",
      userId: "usr-band-leader",
      userName: "Vikram Sen",
      userEmail: "vikram.rock@example.com",
      college: "IIT Kanpur",
      participationType: "team",
      teamName: "The Awadh Echoes",
      amount: 500,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: 500,
      amountSubmitted: 500,
      utrNumber: `PAYTM${Date.now()}`,
      paymentScreenshotUrl: "https://example.com/receipt.jpg",
      paymentDate: "2026-03-10",
    });

    // Admin approves payment
    const approved = dataStore.reviewPayment(payment.id, "usr-finance-admin-1", "approve");
    expect(approved).toBe(true);

    const updatedReg = dataStore.getRegistrationById(reg.id);
    expect(updatedReg?.paymentStatus).toBe("approved");
    expect(updatedReg?.registrationStatus).toBe("confirmed");

    // Digital Ticket must be auto-generated
    const ticket = dataStore.getTicketByRegistrationId(reg.id);
    expect(ticket).toBeDefined();
    expect(ticket?.ticketNumber).toContain("TKT-UP-2026-");
    expect(ticket?.qrToken).toBeDefined();
    expect(ticket?.isValid).toBe(true);
    expect(ticket?.isScanned).toBeFalsy();

    // Trigger Nodemailer Payment Approval & QR Ticket Email
    if (ticket && updatedReg) {
      await sendPaymentApprovalEmail(
        updatedReg.userEmail,
        updatedReg.userName,
        updatedReg.eventTitle,
        ticket.ticketNumber,
        ticket.qrToken
      );

      const approvalLog = emailDispatchLogs.find((l) => l.type === "payment_approved");
      expect(approvalLog).toBeDefined();
      expect(approvalLog?.to).toBe(updatedReg.userEmail);
      expect(approvalLog?.subject).toContain("[Confirmed]");
    }
  });

  it("5. Turnstile QR Entry Scanner: Atomic Check-In and Duplicate Bounce", () => {
    const reg = dataStore.createRegistration({
      eventId: "kathak-jugalbandi",
      eventTitle: "Kathak Jugalbandi",
      userId: "usr-gate-attendee",
      userName: "Kavita Rao",
      userEmail: "kavita.rao@example.com",
      college: "Kashi Vidyapeeth",
      participationType: "individual",
      amount: 0,
      paymentStatus: "approved",
      registrationStatus: "confirmed",
    });

    const ticket = dataStore.createTicketForRegistration(reg);
    expect(ticket).toBeDefined();

    // 1st scan at entry gate
    const scan1 = dataStore.scanTicket(ticket.qrToken, "usr-scanner-staff-1");
    expect(scan1.success).toBe(true);
    expect(scan1.message).toContain("Verified entry approved");
    expect(scan1.ticket?.isScanned).toBe(true);
    expect(scan1.ticket?.scannedBy).toBe("usr-scanner-staff-1");

    // 2nd scan attempt with same ticket (must bounce)
    const scan2 = dataStore.scanTicket(ticket.qrToken, "usr-scanner-staff-2");
    expect(scan2.success).toBe(false);
    expect(scan2.message.toUpperCase()).toContain("ALREADY SCANNED");
  });

  it("6. Payment Rejection Notice Flow: Dispatches rejection feedback email", async () => {
    const reg = dataStore.createRegistration({
      eventId: "culinary-awadh",
      eventTitle: "Dastarkhwan – Awadhi Culinary Championship",
      userId: "usr-chef-1",
      userName: "Tariq Khan",
      userEmail: "tariq.khan@example.com",
      college: "IHM Lucknow",
      participationType: "individual",
      amount: 200,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: 200,
      amountSubmitted: 200,
      utrNumber: `REJECT${Date.now()}`,
      paymentScreenshotUrl: "https://example.com/blurry.jpg",
      paymentDate: "2026-03-10",
    });

    const rejectionReason = "Screenshot does not display the transaction ID / UTR.";
    const rejected = dataStore.reviewPayment(payment.id, "usr-finance-admin-1", "reject", rejectionReason);
    expect(rejected).toBe(true);

    const updatedReg = dataStore.getRegistrationById(reg.id);
    expect(updatedReg?.paymentStatus).toBe("rejected");

    await sendPaymentRejectionEmail(
      reg.userEmail,
      reg.userName,
      reg.eventTitle,
      rejectionReason
    );

    const rejectionLog = emailDispatchLogs.find((l) => l.type === "payment_rejected");
    expect(rejectionLog).toBeDefined();
    expect(rejectionLog?.to).toBe(reg.userEmail);
    expect(rejectionLog?.subject).toContain("Action Required");
  });

  it("7. QR Settings Update: Admin customizes Paytm UPI details", async () => {
    const newUpiId = "rangmanch2026@paytm";
    const updated = dataStore.updateQrSettings({
      upiId: newUpiId,
      upiName: "Rangmanch UP Cultural Secretariat",
      paymentInstructions: "Scan using Paytm, PhonePe or GPay. Enter exact fee and save UTR.",
    });

    await dataStore.flushPending();

    expect(updated.upiId).toBe(newUpiId);
    expect(dataStore.getQrSettings().upiId).toBe(newUpiId);
  });
});
