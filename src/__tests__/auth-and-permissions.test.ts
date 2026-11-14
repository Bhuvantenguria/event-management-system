import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import { dataStore } from "@/lib/data-store";
import { hasRole, ROLE_PERMISSIONS } from "@/lib/permissions";

describe("Participant & Admin Authentication & RBAC", () => {
  it("should securely store participant credentials with bcrypt hashing", async () => {
    const rawPassword = "StrongPassword@2026";
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const user = dataStore.createUser({
      name: "Rohit Agnihotri",
      email: "rohit.test@gmail.com",
      passwordHash,
      role: "participant",
      college: "Banaras Hindu University",
      studentId: "BHU-2025-4421",
      emailVerified: false,
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("rohit.test@gmail.com");

    // Test password match
    const isMatch = await bcrypt.compare(rawPassword, user.passwordHash);
    expect(isMatch).toBe(true);

    // Test incorrect password
    const isFalse = await bcrypt.compare("WrongPassword", user.passwordHash);
    expect(isFalse).toBe(false);
  });

  it("should enforce strict role permissions", () => {
    expect(hasRole("admin", "admin")).toBe(true); // Single Admin has universal access
    expect(hasRole("super_admin", "admin")).toBe(true);
    expect(hasRole("student", "admin")).toBe(false);
    expect(hasRole("participant", "admin")).toBe(false);
    expect(hasRole("student", "student")).toBe(true);
  });

  it("should have correct permission lists per role", () => {
    expect(ROLE_PERMISSIONS.admin).toContain("*");
    expect(ROLE_PERMISSIONS.super_admin).toContain("*");
    expect(ROLE_PERMISSIONS.student).toContain("tickets:own");
    expect(ROLE_PERMISSIONS.participant).toContain("tickets:own");
  });
});
