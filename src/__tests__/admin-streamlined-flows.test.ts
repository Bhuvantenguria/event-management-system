import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "../lib/data-store";

describe("Admin Streamlined Workflow & Features", () => {
  it("should create, read, update, and delete events with multiple pictures attached", () => {
    const newEvent = dataStore.createEvent({
      slug: "sitar-jugalbandi-test",
      title: "Sitar Jugalbandi Night",
      categoryKey: "cultural",
      category: "Cultural & Performing Arts",
      club: "Mudra Dance & Music Society",
      description: "Classical sitar and tabla battle with maestro accompaniment.",
      date: "14 March 2026",
      time: "06:00 PM",
      venue: "Nawab Wajid Ali Shah Auditorium",
      registrationFee: 400,
      teamSize: "1–2 Musicians",
      prizePool: "₹40,000",
      poster: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800",
      images: [
        "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800",
      ],
      status: "Registration Open",
      rules: ["15 minutes time limit", "Classical Indian ragas only"],
    });

    expect(newEvent.id).toBe("sitar-jugalbandi-test");
    expect(newEvent.images?.length).toBe(3);
    expect(newEvent.poster).toContain("1547153760");

    // Read by slug
    const fetched = dataStore.getEventBySlug("sitar-jugalbandi-test");
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe("Sitar Jugalbandi Night");

    // Update
    const updated = dataStore.updateEvent("sitar-jugalbandi-test", {
      prizePool: "₹50,000",
      status: "Registration Closed",
    });
    expect(updated?.prizePool).toBe("₹50,000");
    expect(updated?.status).toBe("Registration Closed");

    // Delete
    const deleted = dataStore.deleteEvent("sitar-jugalbandi-test");
    expect(deleted).toBe(true);
    expect(dataStore.getEventBySlug("sitar-jugalbandi-test")).toBeUndefined();
  });

  it("should perform full CRUD operations on festival gallery items", () => {
    // 1. Create
    const created = dataStore.createGalleryItem({
      title: "Ganga Aarti Twilight Glow Test",
      category: "Heritage Evenings",
      year: "2026",
      location: "Dashashwamedh Ghat",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800",
      caption: "Over 1,000 glowing brass lamps illuminating the sacred river.",
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("Ganga Aarti Twilight Glow Test");

    // 2. Read
    const found = dataStore.getGalleryItemById(created.id);
    expect(found).toBeDefined();
    expect(found?.year).toBe("2026");

    // 3. Update
    const updated = dataStore.updateGalleryItem(created.id, {
      title: "Ganga Aarti Twilight Glow (Grand Edition)",
      location: "Varanasi Main Ghats",
    });
    expect(updated?.title).toBe("Ganga Aarti Twilight Glow (Grand Edition)");
    expect(updated?.location).toBe("Varanasi Main Ghats");

    // 4. Delete
    const deleted = dataStore.deleteGalleryItem(created.id);
    expect(deleted).toBe(true);
    expect(dataStore.getGalleryItemById(created.id)).toBeUndefined();
  });

  it("should configure, update, and retrieve the organizer Paytm QR settings", () => {
    const original = dataStore.getQrSettings();
    expect(original.upiId).toBeDefined();

    // Admin updates organizer Paytm QR
    const updated = dataStore.updateQrSettings({
      upiId: "organizer.cultural@paytm",
      upiName: "AffinityAIIMS Central Fest Committee",
      qrImageUrl: "https://example.com/updated-paytm-qr.png",
      paymentInstructions: "Scan using Paytm/GPay/PhonePe and copy 12-digit UTR.",
      isEnabled: true,
    });

    expect(updated.upiId).toBe("organizer.cultural@paytm");
    expect(updated.upiName).toBe("AffinityAIIMS Central Fest Committee");
    expect(updated.qrImageUrl).toBe("https://example.com/updated-paytm-qr.png");

    // Check that getQrSettings reflects the updated values
    const live = dataStore.getQrSettings();
    expect(live.upiId).toBe("organizer.cultural@paytm");
  });

  it("should filter registrations specifically by event and support separated payment approvals", () => {
    const eventId = "kathak-jugalbandi";
    const reg = dataStore.createRegistration({
      eventId,
      eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
      userId: "usr-student-test",
      userName: "Rhea Sen",
      userEmail: "rhea@example.com",
      college: "Banaras Hindu University",
      participationType: "individual",
      amount: 300,
      paymentStatus: "pending_verification",
      registrationStatus: "pending",
    });

    // Check filtering by event
    const eventRegistrations = dataStore
      .getAllRegistrations()
      .filter((r) => r.eventId === eventId);
    expect(eventRegistrations.some((r) => r.id === reg.id)).toBe(true);

    // Submit payment proof
    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: 300,
      amountSubmitted: 300,
      utrNumber: "409988776655",
      paymentScreenshotUrl: "https://example.com/screenshot.jpg",
      paymentDate: "2026-03-05",
      notes: "Paid via Paytm UPI",
    });

    expect(payment.status).toBe("pending");

    // Separated approval: Admin approves payment
    const approved = dataStore.reviewPayment(payment.id, "usr-finance-admin-1", "approve");
    expect(approved).toBe(true);

    // Check registration status confirmed and ticket issued
    const updatedReg = dataStore.getRegistrationById(reg.id);
    expect(updatedReg?.paymentStatus).toBe("approved");
    expect(updatedReg?.registrationStatus).toBe("confirmed");

    const ticket = dataStore.getTicketByRegistrationId(reg.id);
    expect(ticket).toBeDefined();
    expect(ticket?.participantName).toBe("Rhea Sen");
  });
});
