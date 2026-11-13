import { describe, it, expect } from "vitest";
import { dataStore } from "@/lib/data-store";

describe("Event Registration Engine", () => {
  it("should create individual registration with unique registration ID and token", () => {
    const reg = dataStore.createRegistration({
      eventId: "kathak-jugalbandi",
      eventTitle: "Kathak Jugalbandi – Classical Dance Confluence",
      userId: "usr-student-test-1",
      userName: "Meera Varma",
      userEmail: "meera@example.com",
      college: "Lucknow University",
      participationType: "individual",
      amount: 300,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    expect(reg.id).toBeDefined();
    expect(reg.registrationNumber).toMatch(/^REG-2026-\d{4}$/);
    expect(reg.qrToken).toContain("RNG-TKT-");
    expect(reg.paymentStatus).toBe("awaiting_payment");
  });

  it("should support team registrations with squad members roster", () => {
    const teamMembers = [
      { name: "Captain Vikramaditya", email: "vikram@example.com", isCaptain: true },
      { name: "Player Arjun", email: "arjun@example.com" },
      { name: "Player Devesh", email: "devesh@example.com" },
    ];

    const teamReg = dataStore.createRegistration({
      eventId: "royal-up-football-cup",
      eventTitle: "Chhatrapati Shivaji Memorial Football Cup",
      userId: "usr-student-test-2",
      userName: "Captain Vikramaditya",
      userEmail: "vikram@example.com",
      college: "BHU Varanasi",
      participationType: "team",
      teamName: "Kashi Knights FC",
      teamMembers,
      amount: 1500,
      paymentStatus: "awaiting_payment",
      registrationStatus: "pending",
    });

    expect(teamReg.teamName).toBe("Kashi Knights FC");
    expect(teamReg.teamMembers?.length).toBe(3);
    expect(teamReg.amount).toBe(1500);
  });
});
