import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isSmtpConfigured,
  getSenderAddress,
  createTransporter,
  verifySmtpConnection,
  sendMail,
  sendWelcomeEmail,
  sendRegistrationConfirmationEmail,
  sendPaymentSubmittedEmail,
  sendPaymentApprovalEmail,
  sendPaymentRejectionEmail,
  sendPaymentResubmitEmail,
  sendPasswordResetEmail,
  sendContactInquiryNotification,
  sendTestEmail,
  emailDispatchLogs,
} from "@/lib/email";
import { getBaseUrl, PRODUCTION_URL } from "@/lib/utils";
import { dataStore } from "@/lib/data-store";
import bcrypt from "bcryptjs";

describe("Gmail SMTP Email Sending Pipeline & Diagnostics", () => {
  beforeEach(() => {
    emailDispatchLogs.length = 0;
  });

  describe("1. Configuration & Credential Sanitization", () => {
    it("should report unconfigured when SMTP_USER or SMTP_PASS is missing or placeholder", () => {
      const origUser = process.env.SMTP_USER;
      const origPass = process.env.SMTP_PASS;

      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      expect(isSmtpConfigured()).toBe(false);

      process.env.SMTP_USER = "test@gmail.com";
      process.env.SMTP_PASS = "your_16_character_google_app_password";
      expect(isSmtpConfigured()).toBe(false);

      process.env.SMTP_USER = "test@gmail.com";
      process.env.SMTP_PASS = "placeholder_pass";
      expect(isSmtpConfigured()).toBe(false);

      // Restore
      if (origUser) process.env.SMTP_USER = origUser;
      else delete process.env.SMTP_USER;
      if (origPass) process.env.SMTP_PASS = origPass;
      else delete process.env.SMTP_PASS;
    });

    it("should report configured when actual credentials are provided", () => {
      const origUser = process.env.SMTP_USER;
      const origPass = process.env.SMTP_PASS;

      process.env.SMTP_USER = "swar.aiims@gmail.com";
      process.env.SMTP_PASS = "abcd efgh ijkl mnop"; // Google App Password format with spaces

      expect(isSmtpConfigured()).toBe(true);

      // Cleanup
      if (origUser) process.env.SMTP_USER = origUser;
      else delete process.env.SMTP_USER;
      if (origPass) process.env.SMTP_PASS = origPass;
      else delete process.env.SMTP_PASS;
    });

    it("should compute robust sender address matching authenticated user", () => {
      const origFrom = process.env.EMAIL_FROM;
      const origUser = process.env.SMTP_USER;

      delete process.env.EMAIL_FROM;
      process.env.SMTP_USER = "fest.secretariat@gmail.com";
      const sender = getSenderAddress();
      expect(sender).toContain("fest.secretariat@gmail.com");
      expect(sender).toContain("AffinityAIIMS '26");

      process.env.EMAIL_FROM = '"SWAR AIIMS" <custom@domain.edu>';
      expect(getSenderAddress()).toBe('"SWAR AIIMS" <custom@domain.edu>');

      // Cleanup
      if (origFrom) process.env.EMAIL_FROM = origFrom;
      else delete process.env.EMAIL_FROM;
      if (origUser) process.env.SMTP_USER = origUser;
      else delete process.env.SMTP_USER;
    });

    it("should automatically align mismatched Gmail EMAIL_FROM with authenticated SMTP_USER", () => {
      const origFrom = process.env.EMAIL_FROM;
      const origUser = process.env.SMTP_USER;

      process.env.SMTP_USER = "aiimsrblswar@gmail.com";
      process.env.EMAIL_FROM = "Rangmanch UP Cultural Fest <fest.cultural.up@gmail.com>";

      const sender = getSenderAddress();
      expect(sender).toContain("aiimsrblswar@gmail.com");
      expect(sender).not.toContain("fest.cultural.up@gmail.com");

      // Cleanup
      if (origFrom) process.env.EMAIL_FROM = origFrom;
      else delete process.env.EMAIL_FROM;
      if (origUser) process.env.SMTP_USER = origUser;
      else delete process.env.SMTP_USER;
    });

    it("should resolve production domain as default base URL avoiding localhost:3000", () => {
      const origUrl = process.env.NEXTAUTH_URL;
      delete process.env.NEXTAUTH_URL;

      expect(getBaseUrl()).toBe(PRODUCTION_URL);
      expect(getBaseUrl()).toBe("https://event-management-system-kappa-gold.vercel.app");

      if (origUrl) process.env.NEXTAUTH_URL = origUrl;
    });

    it("should properly strip spaces from Google App Passwords during transporter creation", () => {
      const origUser = process.env.SMTP_USER;
      const origPass = process.env.SMTP_PASS;

      process.env.SMTP_USER = "fest.aiims@gmail.com";
      process.env.SMTP_PASS = "abcd efgh ijkl mnop";

      const transporter: any = createTransporter();
      expect(transporter).not.toBeNull();
      // Transporter options should have sanitized password
      expect(transporter?.options?.auth?.pass).toBe("abcdefghijklmnop");
      expect(transporter?.options?.auth?.user).toBe("fest.aiims@gmail.com");

      // Cleanup
      if (origUser) process.env.SMTP_USER = origUser;
      else delete process.env.SMTP_USER;
      if (origPass) process.env.SMTP_PASS = origPass;
      else delete process.env.SMTP_PASS;
    });
  });

  describe("2. Connection Verification & Simulation Handshake", () => {
    it("should return clean simulation status when credentials are not configured", async () => {
      const origUser = process.env.SMTP_USER;
      delete process.env.SMTP_USER;

      const result = await verifySmtpConnection();
      expect(result.configured).toBe(false);
      expect(result.connected).toBe(false);
      expect(result.message).toContain("simulation mode");

      if (origUser) process.env.SMTP_USER = origUser;
    });
  });

  describe("3. Transactional Email Dispatches & Template Verifications", () => {
    it("should dispatch welcome email with proper recipient and metadata", async () => {
      const res = await sendWelcomeEmail("test.student@example.com", "Ananya Sharma");
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "welcome");
      expect(log).toBeDefined();
      expect(log?.to).toBe("test.student@example.com");
      expect(log?.subject).toContain("AffinityAIIMS '26");
    });

    it("should dispatch registration confirmation for free events with instant ticket", async () => {
      const res = await sendRegistrationConfirmationEmail(
        "free.attendee@example.com",
        "Rohan Verma",
        "Navotsav Heritage Walk",
        true,
        0,
        {
          participationType: "individual",
          ticketNumber: "TKT-FREE-9900",
          qrToken: "AFF-QR-9900-NAVOTSAV",
        }
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "registration");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("[Confirmed]");
      expect(log?.subject).toContain("Navotsav Heritage Walk");
    });

    it("should dispatch registration confirmation for paid events with Paytm QR prompt", async () => {
      const res = await sendRegistrationConfirmationEmail(
        "paid.attendee@example.com",
        "Karan Malhotra",
        "Battle of the Bands",
        false,
        500,
        {
          participationType: "team",
          teamName: "Awadh Rockers",
        }
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find(
        (l) => l.type === "registration" && l.to === "paid.attendee@example.com"
      );
      expect(log).toBeDefined();
      expect(log?.subject).toContain("[Action Required]");
      expect(log?.subject).toContain("Battle of the Bands");
    });

    it("should dispatch payment proof received confirmation with UTR", async () => {
      const res = await sendPaymentSubmittedEmail(
        "karan.malhotra@example.com",
        "Karan Malhotra",
        "Battle of the Bands",
        "412399887766",
        500
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "payment_submitted");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("412399887766");
      expect(log?.to).toBe("karan.malhotra@example.com");
    });

    it("should dispatch payment approval notification with ticket and token", async () => {
      const res = await sendPaymentApprovalEmail(
        "approved.student@example.com",
        "Priya Saxena",
        "Kathak Jugalbandi",
        "TKT-KATHAK-7788",
        "AFF-QR-7788-KATHAK"
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "payment_approved");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("[Confirmed]");
      expect(log?.subject).toContain("Kathak Jugalbandi");
    });

    it("should dispatch payment rejection notice with audit feedback", async () => {
      const res = await sendPaymentRejectionEmail(
        "rejected.student@example.com",
        "Amitabh Ray",
        "Mughal Jaali 3D Hackathon",
        "UTR could not be matched with bank statement."
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "payment_rejected");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("Action Required");
      expect(log?.subject).toContain("Mughal Jaali 3D Hackathon");
    });

    it("should dispatch payment resubmission notice with clearer receipt instructions", async () => {
      const res = await sendPaymentResubmitEmail(
        "resubmit.student@example.com",
        "Divya Patel",
        "Shaam-e-Awadh Poetry",
        "Receipt screenshot was blurred and cut off on the sides."
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "payment_resubmit");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("[Action Required] Resubmit Payment Proof");
      expect(log?.subject).toContain("Shaam-e-Awadh Poetry");
    });

    it("should dispatch password reset instructions with secure link", async () => {
      const res = await sendPasswordResetEmail(
        "reset.user@example.com",
        "https://event-management-system-kappa-gold.vercel.app/login?resetToken=sample-token-123"
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "password_reset");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("Password Reset Request");
    });

    it("should dispatch contact helpdesk inquiry notification", async () => {
      const res = await sendContactInquiryNotification(
        "Dr. Sameer Khan",
        "sameer.k@medicalcollege.edu",
        "KGMU Lucknow",
        "Group Accommodation Request",
        "Requesting hostel accommodation for 20 delegation participants."
      );
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "contact_inquiry");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("Group Accommodation Request");
    });

    it("should dispatch diagnostic operational test email", async () => {
      const res = await sendTestEmail("admin.tester@aiimsraebareli.edu.in");
      expect(res.success).toBe(true);

      const log = emailDispatchLogs.find((l) => l.type === "smtp_test");
      expect(log).toBeDefined();
      expect(log?.subject).toContain("Gmail SMTP Operational Test");
      expect(log?.to).toBe("admin.tester@aiimsraebareli.edu.in");
    });
  });

  describe("4. End-to-End Business Flow Email Triggering", () => {
    it("should trigger resubmit email when admin requests resubmission in dataStore / payments", async () => {
      const testEmail = `resubmit.flow.${Date.now()}@example.com`;
      const reg = dataStore.createRegistration({
        eventId: "kathak-jugalbandi",
        eventTitle: "Kathak Jugalbandi",
        userId: `usr-${Date.now()}`,
        userName: "Sanjay Sen",
        userEmail: testEmail,
        college: "BHU",
        participationType: "individual",
        amount: 300,
        paymentStatus: "pending_verification",
        registrationStatus: "pending",
      });

      const payment = dataStore.submitPaymentProof({
        registrationId: reg.id,
        amountExpected: 300,
        amountSubmitted: 300,
        utrNumber: `99887766${Date.now().toString().slice(-4)}`,
        paymentScreenshotUrl: "https://example.com/receipt.jpg",
        paymentDate: new Date().toISOString().split("T")[0],
      });

      // Admin reviews payment with resubmit
      const success = dataStore.reviewPayment(
        payment.id,
        "usr-finance-admin-1",
        "resubmit",
        "Please provide screenshot showing complete 12-digit UTR."
      );
      expect(success).toBe(true);

      const updatedReg = dataStore.getRegistrationById(reg.id);
      expect(updatedReg?.paymentStatus).toBe("resubmission_required");

      // Trigger resubmission notification
      await sendPaymentResubmitEmail(
        updatedReg!.userEmail,
        updatedReg!.userName,
        updatedReg!.eventTitle,
        "Please provide screenshot showing complete 12-digit UTR."
      );

      const resubmitLog = emailDispatchLogs.find(
        (l) => l.type === "payment_resubmit" && l.to === testEmail
      );
      expect(resubmitLog).toBeDefined();
      expect(resubmitLog?.subject).toContain("Resubmit Payment Proof");
    });
  });
});
