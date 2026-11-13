import { describe, it, expect } from "vitest";
import { dataStore } from "@/lib/data-store";

describe("Digital QR Ticket Generation & Turnstile Scanner Check-in", () => {
  it("should perform atomic entry scan and reject duplicate scans", () => {
    // 1. Create registration and ticket
    const reg = dataStore.createRegistration({
      eventId: "kathak-jugalbandi",
      eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
      userId: "usr-gate-test-1",
      userName: "Kavita Rao",
      userEmail: "kavita@example.com",
      college: "Lucknow University",
      participationType: "individual",
      amount: 300,
      paymentStatus: "approved",
      registrationStatus: "confirmed",
    });

    const ticket = dataStore.createTicketForRegistration(reg);
    expect(ticket.isScanned).toBe(false);

    // 2. First scan -> MUST SUCCEED
    const scan1 = dataStore.scanTicket(ticket.qrToken, "usr-scanner-staff-1");
    expect(scan1.success).toBe(true);
    expect(scan1.ticket?.isScanned).toBe(true);
    expect(scan1.ticket?.scannedBy).toBe("usr-scanner-staff-1");
    expect(scan1.ticket?.scannedAt).toBeDefined();

    // 3. Duplicate scan with same token -> MUST BE REJECTED ATOMICALLY
    const scan2 = dataStore.scanTicket(ticket.qrToken, "usr-scanner-staff-2");
    expect(scan2.success).toBe(false);
    expect(scan2.alreadyScanned).toBe(true);
    expect(scan2.message).toContain("ALREADY SCANNED");
  });

  it("should fail gracefully on invalid or forged QR tokens", () => {
    const invalidScan = dataStore.scanTicket("FORGED-TOKEN-9999", "usr-scanner-staff-1");
    expect(invalidScan.success).toBe(false);
    expect(invalidScan.message).toContain("Invalid or unrecognized ticket token");
  });
});
