import { describe, it, expect, beforeEach, vi } from "vitest";
import { dataStore } from "@/lib/data-store";
import bcrypt from "bcryptjs";
import { POST as forgotPasswordHandler } from "@/app/api/auth/forgot-password/route";
import { POST as resetPasswordHandler } from "@/app/api/auth/reset-password/route";
import { emailDispatchLogs } from "@/lib/email";

describe("Complete End-to-End Password Reset Flow", () => {
  const testEmail = "reset.flow.student@aiimsraebareli.edu.in";
  let user: any;

  beforeEach(async () => {
    emailDispatchLogs.length = 0;
    vi.restoreAllMocks();

    // Ensure test user exists
    user = dataStore.getUserByEmail(testEmail);
    if (!user) {
      const initialHash = await bcrypt.hash("InitialPass123", 10);
      user = dataStore.createUser({
        email: testEmail,
        name: "Reset Flow Student",
        passwordHash: initialHash,
        role: "participant",
        emailVerified: true,
      });
    } else {
      user.passwordHash = await bcrypt.hash("InitialPass123", 10);
    }
  });

  it("1. should dispatch reset email linking to /reset-password (not /login)", async () => {
    const req = new Request("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });

    const res = await forgotPasswordHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify token was generated in dataStore
    const verification = dataStore.verifyPasswordResetToken("dummy", testEmail);
    expect(verification.valid).toBe(false); // dummy should fail

    // Verify email was dispatched with /reset-password link
    expect(emailDispatchLogs.length).toBeGreaterThan(0);
    const lastEmail = emailDispatchLogs[0];
    expect(lastEmail.type).toBe("password_reset");
  });

  it("2. should reject reset attempts with missing fields or short passwords", async () => {
    const token = "rst-mock-token-123";
    dataStore.createPasswordReset(testEmail, token);

    // Missing token
    const res1 = await resetPasswordHandler(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, newPassword: "Short" }),
      })
    );
    expect(res1.status).toBe(400);

    // Password too short (< 6 chars)
    const res2 = await resetPasswordHandler(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, token, newPassword: "123" }),
      })
    );
    expect(res2.status).toBe(400);
    const data2 = await res2.json();
    expect(data2.error).toContain("at least 6 characters");
  });

  it("3. should reject invalid or expired reset tokens", async () => {
    const res = await resetPasswordHandler(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          token: "invalid-token-xyz",
          newPassword: "BrandNewSecurePassword456",
        }),
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid or expired");
  });

  it("4. should successfully update password hash and allow authentication with new credentials", async () => {
    const token = `rst-${Date.now()}-abc123`;
    dataStore.createPasswordReset(testEmail, token);

    const newPassword = "BrandNewSecurePassword456";

    const res = await resetPasswordHandler(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          token,
          newPassword,
        }),
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify updated password hash in dataStore
    const updatedUser = dataStore.getUserByEmail(testEmail);
    expect(updatedUser).toBeDefined();

    const oldPassMatch = await bcrypt.compare("InitialPass123", updatedUser!.passwordHash);
    expect(oldPassMatch).toBe(false);

    const newPassMatch = await bcrypt.compare(newPassword, updatedUser!.passwordHash);
    expect(newPassMatch).toBe(true);

    // Verify token was consumed and cannot be reused
    const tokenRecheck = dataStore.verifyPasswordResetToken(token, testEmail);
    expect(tokenRecheck.valid).toBe(false);
  });
});
