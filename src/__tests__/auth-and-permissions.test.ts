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

  it("should authenticate admin using default credentials or env credentials", async () => {
    const { authOptions } = await import("@/lib/auth");
    const credentialsProvider = authOptions.providers[0] as any;
    const authorizeFn = credentialsProvider.options?.authorize || credentialsProvider.authorize;

    // Test 1: Default admin with extra spaces and uppercase in email
    const adminUser = await authorizeFn({
      email: "  Admin@RangmanchFest.in  ",
      password: "Admin@1234",
    });

    expect(adminUser).toBeDefined();
    expect(adminUser.role).toBe("super_admin");
    expect(adminUser.email).toBe("admin@rangmanchfest.in");

    // Test 2: AIIMS default admin
    const aiimsAdmin = await authorizeFn({
      email: "admin@aiimsraebareli.edu.in",
      password: "Admin@1234",
    });

    expect(aiimsAdmin).toBeDefined();
    expect(aiimsAdmin.role).toBe("super_admin");

    // Test 3: Custom environment variable admin
    process.env.ADMIN_EMAIL = "superboss@festival.org";
    process.env.ADMIN_PASSWORD = "CustomSecretPass@2026";

    const customAdmin = await authorizeFn({
      email: "superboss@festival.org",
      password: "CustomSecretPass@2026",
    });

    expect(customAdmin).toBeDefined();
    expect(customAdmin.email).toBe("superboss@festival.org");
    expect(customAdmin.role).toBe("super_admin");

    // Clean up
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
  });
});
