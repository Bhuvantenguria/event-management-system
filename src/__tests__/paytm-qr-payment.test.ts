import { describe, it, expect } from "vitest";
import { dataStore } from "@/lib/data-store";

describe("Manual Paytm QR Verification Workflow", () => {
  it("should process payment proof submission and enforce unique UTR reference", () => {
    // 1. Create registration
    const reg = dataStore.createRegistration({
      eventId: "ghazal-and-kavi-sammelan",
      eventTitle: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
      userId: "usr-student-test-3",
      userName: "Divya Pandey",
      userEmail: "divya@example.com",
      college: "Allahabad University",
      participationType: "individual",
      amount: 200,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    const uniqueUtr = `UTR-${Date.now()}`;

    // 2. Submit payment proof
    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: 200,
      amountSubmitted: 200,
      utrNumber: uniqueUtr,
      paymentScreenshotUrl: "https://example.com/receipt.jpg",
      paymentDate: "2026-03-02",
      notes: "Transferred via Paytm UPI",
    });

    expect(payment.status).toBe("pending");
    expect(payment.utrNumber).toBe(uniqueUtr);

    // Verify registration status updated to pending_verification
    const updatedReg = dataStore.getRegistrationById(reg.id);
    expect(updatedReg?.paymentStatus).toBe("pending_verification");

    // 3. Test duplicate UTR rejection
    const isDuplicateAllowed = dataStore.isUtrUnique(uniqueUtr);
    expect(isDuplicateAllowed).toBe(false);
  });

  it("should approve payment and automatically provision verified digital ticket", () => {
    const reg = dataStore.createRegistration({
      eventId: "banarasi-handicraft-hackathon",
      eventTitle: "Shilpkar: Crafts & 3D Hackathon",
      userId: "usr-student-test-4",
      userName: "Tarun Gupta",
      userEmail: "tarun@example.com",
      college: "IIT BHU",
      participationType: "individual",
      amount: 400,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: 400,
      amountSubmitted: 400,
      utrNumber: `UTR-HACK-${Date.now()}`,
      paymentScreenshotUrl: "https://example.com/hack.jpg",
      paymentDate: "2026-03-02",
    });

    // Finance Admin approves
    const approved = dataStore.reviewPayment(payment.id, "usr-finance-admin-1", "approve");
    expect(approved).toBe(true);

    // Registration should now be approved and confirmed
    const updatedReg = dataStore.getRegistrationById(reg.id);
    expect(updatedReg?.paymentStatus).toBe("approved");
    expect(updatedReg?.registrationStatus).toBe("confirmed");

    // Digital ticket must be generated
    const ticket = dataStore.getTicketByRegistrationId(reg.id);
    expect(ticket).toBeDefined();
    expect(ticket?.isValid).toBe(true);
    expect(ticket?.isScanned).toBe(false);
    expect(ticket?.ticketNumber).toMatch(/^TKT-UP-2026-\d{4}$/);
  });

  it("should allow requesting resubmission with feedback notes", () => {
    const reg = dataStore.createRegistration({
      eventId: "folk-fusion-band-war",
      eventTitle: "Dhun: Eastern Classical & Rock Fusion",
      userId: "usr-student-test-5",
      userName: "Sanjay Sen",
      userEmail: "sanjay@example.com",
      college: "AMU Aligarh",
      participationType: "team",
      amount: 600,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    const payment = dataStore.submitPaymentProof({
      registrationId: reg.id,
      amountExpected: 600,
      amountSubmitted: 600,
      utrNumber: `UTR-BLURRY-${Date.now()}`,
      paymentScreenshotUrl: "https://example.com/blurry.jpg",
      paymentDate: "2026-03-02",
    });

    const resubmitAction = dataStore.reviewPayment(
      payment.id,
      "usr-finance-admin-1",
      "resubmit",
      "Screenshot is blurry, UTR digits are illegible."
    );
    expect(resubmitAction).toBe(true);

    const recheck = dataStore.getPaymentByRegistrationId(reg.id);
    expect(recheck?.status).toBe("resubmission_required");
    expect(recheck?.rejectionReason).toBe("Screenshot is blurry, UTR digits are illegible.");

    const regStatus = dataStore.getRegistrationById(reg.id);
    expect(regStatus?.paymentStatus).toBe("resubmission_required");
  });
});
