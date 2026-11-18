import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendViaGmailRestApi,
  sendMail,
  isOAuth2Configured,
  cleanOAuthToken,
  sanitizeGmailUser,
  emailDispatchLogs,
} from "@/lib/email";

describe("Password Visibility & Gmail REST API Integration", () => {
  beforeEach(() => {
    emailDispatchLogs.length = 0;
    vi.restoreAllMocks();
  });

  describe("Gmail REST API over HTTPS (Port 443)", () => {
    it("should return error if OAuth2 credentials are not configured", async () => {
      const origClientId = process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_ID;

      const result = await sendViaGmailRestApi({
        from: "AffinityAIIMS '26 <aiimssupport@gmail.com>",
        to: "bhuvantenguria37@gmail.com",
        subject: "Test Subject",
        html: "<p>Hello</p>",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Missing OAuth2 credentials");

      if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId;
    });

    it("should gracefully handle token exchange failure without throwing uncaught exceptions", async () => {
      const origClientId = process.env.GOOGLE_CLIENT_ID;
      const origSecret = process.env.GOOGLE_CLIENT_SECRET;
      const origRefresh = process.env.GOOGLE_REFRESH_TOKEN;
      const origUser = process.env.GMAIL_USER;

      process.env.GOOGLE_CLIENT_ID = "mock-id.apps.googleusercontent.com";
      process.env.GOOGLE_CLIENT_SECRET = "mock-secret";
      process.env.GOOGLE_REFRESH_TOKEN = "1//mock-refresh";
      process.env.GMAIL_USER = "aiimssupport@gmail.com";

      // Mock fetch failure for token endpoint
      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "invalid_grant", error_description: "Bad refresh token" }),
      } as any);

      const result = await sendViaGmailRestApi({
        from: "AffinityAIIMS '26 <aiimssupport@gmail.com>",
        to: "bhuvantenguria37@gmail.com",
        subject: "Test Subject",
        html: "<p>Hello</p>",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Google OAuth2 token exchange failed");
      expect(fetchMock).toHaveBeenCalled();

      // Cleanup
      if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId;
      else delete process.env.GOOGLE_CLIENT_ID;
      if (origSecret) process.env.GOOGLE_CLIENT_SECRET = origSecret;
      else delete process.env.GOOGLE_CLIENT_SECRET;
      if (origRefresh) process.env.GOOGLE_REFRESH_TOKEN = origRefresh;
      else delete process.env.GOOGLE_REFRESH_TOKEN;
      if (origUser) process.env.GMAIL_USER = origUser;
      else delete process.env.GMAIL_USER;
    });

    it("should successfully encode message and dispatch via Gmail REST API when credentials are valid", async () => {
      const origClientId = process.env.GOOGLE_CLIENT_ID;
      const origSecret = process.env.GOOGLE_CLIENT_SECRET;
      const origRefresh = process.env.GOOGLE_REFRESH_TOKEN;
      const origUser = process.env.GMAIL_USER;

      process.env.GOOGLE_CLIENT_ID = "mock-id.apps.googleusercontent.com";
      process.env.GOOGLE_CLIENT_SECRET = "mock-secret";
      process.env.GOOGLE_REFRESH_TOKEN = "1//mock-refresh";
      process.env.GMAIL_USER = "aiimssupport@gmail.com";

      // Mock token endpoint and Gmail send endpoint
      const fetchMock = vi
        .spyOn(globalThis, "fetch")
        // 1. Token response
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ access_token: "mock-access-token-xyz" }),
        } as any)
        // 2. Gmail send response
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ id: "gmail-rest-msg-12345", threadId: "thread-123" }),
        } as any);

      const result = await sendViaGmailRestApi({
        from: "AffinityAIIMS '26 <aiimssupport@gmail.com>",
        to: "bhuvantenguria37@gmail.com",
        subject: "AffinityAIIMS '26: Password Reset Request",
        html: "<p>Click here to reset your password</p>",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("gmail-rest-msg-12345");
      expect(fetchMock).toHaveBeenCalledTimes(2);

      // Verify the request body of the second call contains the base64 encoded 'raw' string
      const sendCallArgs = fetchMock.mock.calls[1];
      expect(sendCallArgs[0]).toBe("https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
      const body = JSON.parse(sendCallArgs[1]?.body as string);
      expect(body).toHaveProperty("raw");
      expect(typeof body.raw).toBe("string");

      // Cleanup
      if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId;
      else delete process.env.GOOGLE_CLIENT_ID;
      if (origSecret) process.env.GOOGLE_CLIENT_SECRET = origSecret;
      else delete process.env.GOOGLE_CLIENT_SECRET;
      if (origRefresh) process.env.GOOGLE_REFRESH_TOKEN = origRefresh;
      else delete process.env.GOOGLE_REFRESH_TOKEN;
      if (origUser) process.env.GMAIL_USER = origUser;
      else delete process.env.GMAIL_USER;
    });

    it("should prioritize Gmail REST API in sendMail() when OAuth2 is configured", async () => {
      const origClientId = process.env.GOOGLE_CLIENT_ID;
      const origSecret = process.env.GOOGLE_CLIENT_SECRET;
      const origRefresh = process.env.GOOGLE_REFRESH_TOKEN;
      const origUser = process.env.GMAIL_USER;

      process.env.GOOGLE_CLIENT_ID = "mock-id.apps.googleusercontent.com";
      process.env.GOOGLE_CLIENT_SECRET = "mock-secret";
      process.env.GOOGLE_REFRESH_TOKEN = "1//mock-refresh";
      process.env.GMAIL_USER = "aiimssupport@gmail.com";

      // Mock token endpoint and Gmail send endpoint
      vi.spyOn(globalThis, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ access_token: "mock-token" }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ id: "1a1ee9fb62fc78cd" }),
        } as any);

      const result = await sendMail(
        {
          to: "bhuvantenguria37@gmail.com",
          subject: "AffinityAIIMS '26: Password Reset Request",
          html: "<p>Password reset instructions</p>",
        },
        "password_reset"
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("1a1ee9fb62fc78cd");

      // Verify log entry
      expect(emailDispatchLogs.length).toBe(1);
      expect(emailDispatchLogs[0].status).toBe("sent");
      expect(emailDispatchLogs[0].messageId).toBe("1a1ee9fb62fc78cd");
      expect(emailDispatchLogs[0].type).toBe("password_reset");

      // Cleanup
      if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId;
      else delete process.env.GOOGLE_CLIENT_ID;
      if (origSecret) process.env.GOOGLE_CLIENT_SECRET = origSecret;
      else delete process.env.GOOGLE_CLIENT_SECRET;
      if (origRefresh) process.env.GOOGLE_REFRESH_TOKEN = origRefresh;
      else delete process.env.GOOGLE_REFRESH_TOKEN;
      if (origUser) process.env.GMAIL_USER = origUser;
      else delete process.env.GMAIL_USER;
    });
  });
});
