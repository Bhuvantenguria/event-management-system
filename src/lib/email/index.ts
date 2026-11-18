import nodemailer from "nodemailer";
import { getBaseUrl } from "@/lib/utils";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// In-Memory Email Dispatch Log for diagnostics and audit
export interface EmailDispatchLog {
  id: string;
  to: string;
  subject: string;
  type: string;
  status: "sent" | "simulated" | "failed";
  timestamp: string;
  messageId?: string;
  error?: string;
}

export const emailDispatchLogs: EmailDispatchLog[] = [];

function cleanEnv(val?: string): string {
  if (!val) return "";
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.indexOf('"', 1) === trimmed.length - 1) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.indexOf("'", 1) === trimmed.length - 1)
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Robustly cleans and extracts a raw OAuth token or refresh token even if pasted as a query string or JSON.
 */
export function cleanOAuthToken(val?: string): string {
  if (!val) return "";
  let trimmed = cleanEnv(val);
  // Handle JSON if user pasted JSON response from OAuth playground
  if (trimmed.startsWith("{") && trimmed.includes("refresh_token")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.refresh_token) return String(parsed.refresh_token).trim();
    } catch {
      const m = trimmed.match(/"refresh_token"\s*:\s*"([^"]+)"/);
      if (m) return m[1].trim();
    }
  }
  // If query string with & e.g. "refresh_token=XYZ&..." or "code=XYZ&..."
  if (trimmed.includes("&")) {
    const parts = trimmed.split("&");
    const rfPart = parts.find((p) => p.startsWith("refresh_token="));
    if (rfPart) {
      return rfPart.replace("refresh_token=", "").trim();
    }
    const codePart = parts.find((p) => p.startsWith("code="));
    if (codePart) {
      return codePart.replace("code=", "").trim();
    }
    trimmed = parts[0].replace(/^code=/, "").replace(/^refresh_token=/, "").trim();
  }
  return trimmed;
}

/**
 * Sanitizes and auto-corrects Gmail account usernames to prevent authentication failure.
 */
export function sanitizeGmailUser(rawUser?: string): string {
  if (!rawUser) return "";
  let user = cleanEnv(rawUser).toLowerCase();
  // Self-heal common typo: "aiimssupoort@gmail.com" -> "aiimssupport@gmail.com"
  if (user === "aiimssupoort@gmail.com") {
    user = "aiimssupport@gmail.com";
  }
  return user;
}

/**
 * Checks whether Google OAuth2 credentials have been provided in the environment.
 */
export function isOAuth2Configured(): boolean {
  const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
  const refreshToken = cleanOAuthToken(process.env.GOOGLE_REFRESH_TOKEN);
  const user = sanitizeGmailUser(process.env.GMAIL_USER || process.env.SMTP_USER);

  if (!clientId || !clientSecret || !refreshToken || !user) return false;
  if (
    clientId.includes("your_") ||
    clientSecret.includes("your_") ||
    refreshToken.includes("your_") ||
    clientId.includes("placeholder")
  ) {
    return false;
  }
  return true;
}

/**
 * Checks whether valid Gmail email dispatch credentials (either OAuth2 or App Password/SMTP)
 * have been provided in the environment.
 */
export function isSmtpConfigured(): boolean {
  if (isOAuth2Configured()) return true;

  const user = sanitizeGmailUser(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);

  if (!user || !pass) return false;
  if (
    pass === "your_google_app_password" ||
    pass === "your_16_character_google_app_password" ||
    pass.includes("your_") ||
    pass.includes("placeholder")
  ) {
    return false;
  }
  return true;
}

/**
 * Returns the sanitized sender address.
 * Gmail requires that the "from" address matches the authenticated Gmail user.
 */
export function getSenderAddress(): string {
  const appName = cleanEnv(process.env.NEXT_PUBLIC_APP_NAME) || "AffinityAIIMS '26";
  const user = sanitizeGmailUser(process.env.GMAIL_USER || process.env.SMTP_USER);

  if (process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim()) {
    const fromVal = process.env.EMAIL_FROM.trim();
    // If authenticated user is a Gmail account, and EMAIL_FROM has a different @gmail.com address,
    // Google rejects sending mail as a different Gmail user (550 / 553 / bad credentials).
    // In this case, align sender with the authenticated user:
    if (user && fromVal.includes("@gmail.com") && !fromVal.toLowerCase().includes(user.toLowerCase())) {
      console.warn(
        `[Email Notice] EMAIL_FROM (${fromVal}) uses a different Gmail address than authenticated user (${user}). Automatically aligning sender address to prevent Gmail authentication rejection.`
      );
      return `"${appName}" <${user}>`;
    }
    return fromVal;
  }

  const email = user || "swar@aiimsraebareli.edu.in";
  return `"${appName}" <${email}>`;
}

/**
 * Creates and configures a Nodemailer transporter.
 * Robustly handles:
 *  1. Google OAuth2 (GMAIL_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN).
 *  2. Google App Passwords copied with spaces (e.g. "abcd efgh ijkl mnop") -> sanitized to "abcdefghijklmnop".
 *  3. Gmail service preset vs custom host/port settings.
 *  4. Port 465 (SSL direct, secure: true) vs Port 587 (TLS/STARTTLS, secure: false).
 *  5. Graceful simulation mode when credentials are absent or placeholders.
 */
export function createTransporter() {
  if (!isSmtpConfigured()) {
    // Return null to simulate email gracefully in dev/preview without crashing
    return null;
  }

  // 1. Google OAuth2 Transport
  if (isOAuth2Configured()) {
    const user = sanitizeGmailUser(process.env.GMAIL_USER || process.env.SMTP_USER);
    const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
    const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
    const refreshToken = cleanOAuthToken(process.env.GOOGLE_REFRESH_TOKEN);

    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4, // Explicitly force IPv4 to prevent hanging on AWS Lambda / Vercel IPv6
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      pool: false,
      auth: {
        type: "OAuth2",
        user,
        clientId,
        clientSecret,
        refreshToken,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
    } as any);
  }

  // 2. Google App Password / SMTP Transport
  const user = sanitizeGmailUser(process.env.SMTP_USER);
  // Strip all whitespace from the Google App Password
  const pass = cleanEnv(process.env.SMTP_PASS).replace(/\s+/g, "");

  const rawHost = cleanEnv(process.env.SMTP_HOST) || "smtp.gmail.com";
  const port = parseInt(cleanEnv(process.env.SMTP_PORT) || "465", 10);

  const isPort465 = port === 465;
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1"
      : isPort465;

  return nodemailer.createTransport({
    host: rawHost,
    port,
    secure,
    requireTLS: !secure && port === 587,
    family: 4, // Explicitly force IPv4 on serverless to avoid IPv6 routing blackholes
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    pool: false, // Serverless best practice: avoid reusing frozen sockets
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  } as any);
}

/**
 * Performs a live handshake verification with the SMTP server.
 */
export async function verifySmtpConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
  user?: string;
  host?: string;
  port?: number;
  authMethod?: "OAuth2" | "AppPassword" | "None";
  error?: string;
}> {
  if (!isSmtpConfigured()) {
    return {
      configured: false,
      connected: false,
      authMethod: "None",
      message:
        "Gmail credentials (either OAuth2 or Google App Password) are not configured in environment variables. Email notifications will operate in graceful simulation mode.",
    };
  }

  const isOAuth = isOAuth2Configured();
  const transporter = createTransporter();
  if (!transporter) {
    return {
      configured: false,
      connected: false,
      authMethod: isOAuth ? "OAuth2" : "AppPassword",
      message: "Failed to initialize email transporter.",
    };
  }

  const user = sanitizeGmailUser(process.env.GMAIL_USER || process.env.SMTP_USER);
  const host = isOAuth ? "Gmail OAuth2 (google.com)" : cleanEnv(process.env.SMTP_HOST) || "smtp.gmail.com";
  const port = isOAuth ? 465 : parseInt(cleanEnv(process.env.SMTP_PORT) || "465", 10);

  try {
    await transporter.verify();
    return {
      configured: true,
      connected: true,
      authMethod: isOAuth ? "OAuth2" : "AppPassword",
      message: `Gmail ${isOAuth ? "OAuth2" : "SMTP"} connection established successfully! Ready to dispatch live emails as ${user}.`,
      user,
      host,
      port,
    };
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("[Email Verify Error]:", errorMsg);

    let userFriendlyMessage = `${isOAuth ? "OAuth2" : "SMTP"} connection failed: ${errorMsg}`;
    if (
      errorMsg.includes("535") ||
      errorMsg.includes("Username and Password not accepted") ||
      errorMsg.includes("BadCredentials")
    ) {
      userFriendlyMessage = `Google SMTP Authentication Rejected (535-5.7.8): Google accounts require a 16-character Google App Password (not your regular personal password). Alternatively, set up Google OAuth2 with GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.`;
    } else if (errorMsg.includes("invalid_grant") || errorMsg.includes("Token has been expired or revoked")) {
      userFriendlyMessage = `Google OAuth2 Token Expired or Revoked (invalid_grant): The GOOGLE_REFRESH_TOKEN is invalid or expired. In Google Cloud testing mode, refresh tokens expire every 7 days. Please regenerate a refresh token or set the OAuth consent screen to In Production.`;
    } else if (errorMsg.includes("Greeting never received") || errorMsg.includes("ETIMEDOUT")) {
      userFriendlyMessage = `SMTP Connection Timeout (Greeting never received): The connection to smtp.gmail.com timed out during the greeting handshake. On Vercel, this usually happens when IPv6 routing hangs or when serverless functions exit prematurely. We have enforced IPv4 with extended timeouts. If using Port 465, you can also test Port 587 with SMTP_SECURE=false.`;
    }

    return {
      configured: true,
      connected: false,
      authMethod: isOAuth ? "OAuth2" : "AppPassword",
      message: userFriendlyMessage,
      user,
      host,
      port,
      error: errorMsg,
    };
  }
}

/**
 * Renders the responsive AffinityAIIMS Royal & Heritage email layout.
 */
function renderHeritageTemplate(title: string, contentHtml: string): string {
  const appName = cleanEnv(process.env.NEXT_PUBLIC_APP_NAME) || "AffinityAIIMS '26";
  const appTagline =
    cleanEnv(process.env.NEXT_PUBLIC_APP_TAGLINE) ||
    "AIIMS Raebareli Annual Inter-Collegiate Cultural Festival";
  const appUrl = getBaseUrl();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #191820; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5E8D0; }
    .container { max-width: 600px; margin: 30px auto; background-color: #24222C; border: 1px solid #D4AD63; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
    .header { background: linear-gradient(135deg, #681F38 0%, #402044 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #D4AD63; }
    .header h1 { margin: 0; font-family: Georgia, serif; color: #D4AD63; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; color: #F5E8D0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
    .body { padding: 32px 28px; font-size: 14px; line-height: 1.7; color: #E8E0D2; }
    .body strong { color: #FFFFFF; }
    .body h2 { font-family: Georgia, serif; color: #D4AD63; margin-top: 0; font-size: 20px; }
    .footer { background-color: #15141B; color: #A89E90; padding: 22px 24px; font-size: 11px; text-align: center; border-top: 1px solid rgba(212, 173, 99, 0.3); }
    .btn { display: inline-block; background: linear-gradient(135deg, #E87545 0%, #681F38 100%); color: #FFFFFF !important; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-weight: bold; border: 1px solid #D4AD63; margin: 20px 0; text-align: center; font-size: 13px; }
    .info-box { background-color: #2E2B38; border-left: 4px solid #D4AD63; padding: 14px 18px; margin: 18px 0; border-radius: 6px; color: #F5E8D0; font-size: 13px; }
    .warning-box { background-color: #38242A; border-left: 4px solid #E87545; padding: 14px 18px; margin: 18px 0; border-radius: 6px; color: #F5E8D0; font-size: 13px; }
    .ticket-badge { display: inline-block; background-color: #3E1825; border: 1px dashed #D4AD63; padding: 6px 14px; border-radius: 6px; font-family: monospace; color: #E87545; font-size: 14px; font-weight: bold; margin: 6px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appName}</h1>
      <p>${appTagline}</p>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>© 2026 AffinityAIIMS • Student Welfare Association Raebareli (SWAR)</p>
      <p style="color: #D4AD63; margin-top: 4px;">AIIMS Campus, Dalmau Road, Munshiganj, Raebareli, UP 229405</p>
      <p style="font-size: 10px; color: #887E70; margin-top: 6px;">Festival Secretariat: swar@aiimsraebareli.edu.in</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Universal email dispatcher supporting both live Gmail SMTP and graceful dev simulation.
 */
export async function sendMail(
  options: EmailOptions,
  type = "general"
): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  const from = getSenderAddress();
  const transporter = createTransporter();

  if (!transporter) {
    // Graceful simulation when Gmail SMTP credentials are not yet configured in env
    const logItem: EmailDispatchLog = {
      id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      to: options.to,
      subject: options.subject,
      type,
      status: "simulated",
      timestamp: new Date().toISOString(),
    };
    emailDispatchLogs.unshift(logItem);
    console.log(
      `[Email Simulated] Dispatched '${type}' notification to ${options.to} (Subject: "${options.subject}")`
    );
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
      replyTo: options.replyTo || "swar@aiimsraebareli.edu.in",
    });

    const logItem: EmailDispatchLog = {
      id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      to: options.to,
      subject: options.subject,
      type,
      status: "sent",
      timestamp: new Date().toISOString(),
      messageId: info.messageId,
    };
    emailDispatchLogs.unshift(logItem);
    console.log(
      `[Email Sent] Successfully delivered '${type}' email to ${options.to} (MessageId: ${info.messageId})`
    );

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const logItem: EmailDispatchLog = {
      id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      to: options.to,
      subject: options.subject,
      type,
      status: "failed",
      timestamp: new Date().toISOString(),
      error: errorMsg,
    };
    emailDispatchLogs.unshift(logItem);
    console.error(`[Email Failed] Delivery failure for '${type}' to ${options.to}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}

// 1. Welcome Email for New Account
export async function sendWelcomeEmail(to: string, name: string) {
  const appUrl = getBaseUrl();
  const html = renderHeritageTemplate(
    "Welcome to AffinityAIIMS '26",
    `
      <h2>Greetings ${name},</h2>
      <p>Welcome to <strong>AffinityAIIMS '26</strong> — the Annual Inter-Collegiate Cultural Festival organized by the Student Welfare Association of Raebareli (SWAR), AIIMS Raebareli.</p>
      <p>Your participant account has been successfully initialized. You can now register for 40+ competitions across performing arts, athletics, debates, hackathons, and regional crafts.</p>
      <div class="info-box">
        <strong>Festival Dates:</strong> 12th – 15th March 2026<br>
        <strong>Venue:</strong> AIIMS Campus, Dalmau Road, Munshiganj, Raebareli, UP 229405<br>
        <strong>Organizing Body:</strong> SWAR Council &amp; University Cultural Clubs
      </div>
      <a href="${appUrl}/events" class="btn">Explore All Competitions</a>
      <p style="font-size: 12px; color: #A89E90; margin-top: 16px;">
        For registration assistance or accommodation queries, reach out to our 24/7 student helpline at <strong>swar@aiimsraebareli.edu.in</strong>.
      </p>
    `
  );
  return sendMail(
    {
      to,
      subject: "Welcome to AffinityAIIMS '26 – Welcome to Rangmanch UP 2026!",
      html,
    },
    "welcome"
  );
}

// 2. Event Registration Confirmation Email (Paid or Free)
export async function sendRegistrationConfirmationEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  isFree: boolean,
  amount: number,
  details?: {
    participationType?: string;
    teamName?: string;
    ticketNumber?: string;
    qrToken?: string;
  }
) {
  const appUrl = getBaseUrl();

  const freeContent = `
    <h2>Registration Confirmed: ${eventTitle}</h2>
    <p>Dear <strong>${participantName}</strong>,</p>
    <p>Your registration for <strong>${eventTitle}</strong> has been officially confirmed! Since this is a complimentary festival event, your digital QR pass has been generated immediately.</p>
    <div class="info-box">
      <strong>Ticket Number:</strong> ${details?.ticketNumber || "CONFIRMED"}<br>
      <strong>Entry Security Token:</strong> <span class="ticket-badge">${details?.qrToken || "READY-AT-DOOR"}</span><br>
      <strong>Format:</strong> ${details?.participationType === "team" ? `Team (${details.teamName || "Squad"})` : "Individual"}
    </div>
    <a href="${appUrl}/dashboard/tickets" class="btn">Access Digital QR Pass</a>
  `;

  const paidContent = `
    <h2>Registration Received: ${eventTitle}</h2>
    <p>Dear <strong>${participantName}</strong>,</p>
    <p>We have received your registration for <strong>${eventTitle}</strong>. Please complete your manual Paytm UPI fee transfer to confirm your entry slot.</p>
    <div class="info-box">
      <strong>Event Fee:</strong> ₹${amount}<br>
      <strong>Participation:</strong> ${details?.participationType === "team" ? `Team: ${details.teamName || "Squad"}` : "Individual"}<br>
      <strong>Status:</strong> Awaiting Paytm UPI Verification
    </div>
    <div class="warning-box">
      <strong>Next Step:</strong> Scan the festival organizer Paytm QR code on your dashboard, copy your 12-digit transaction UTR reference number, and upload your payment receipt screenshot.
    </div>
    <a href="${appUrl}/dashboard/payments" class="btn">Submit Paytm UPI Proof</a>
  `;

  const html = renderHeritageTemplate(
    `Registration: ${eventTitle}`,
    isFree ? freeContent : paidContent
  );

  return sendMail(
    {
      to,
      subject: isFree
        ? `[Confirmed] Registration & QR Pass for ${eventTitle}`
        : `[Action Required] Complete Paytm UPI Payment for ${eventTitle}`,
      html,
    },
    "registration"
  );
}

// 3. Payment Proof Submitted Notification
export async function sendPaymentSubmittedEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  utrNumber: string,
  amount: number
) {
  const appUrl = getBaseUrl();
  const html = renderHeritageTemplate(
    "Payment Proof Under Verification",
    `
      <h2>Payment Proof Received</h2>
      <p>Dear <strong>${participantName}</strong>,</p>
      <p>Your manual Paytm UPI payment proof for <strong>${eventTitle}</strong> has been received and queued for finance audit.</p>
      <div class="info-box">
        <strong>Event:</strong> ${eventTitle}<br>
        <strong>Amount Submitted:</strong> ₹${amount}<br>
        <strong>12-Digit UTR / Ref No:</strong> <code style="color: #E87545; font-family: monospace;">${utrNumber}</code><br>
        <strong>Status:</strong> Pending Finance Verification (usually 1–4 hours)
      </div>
      <p>Once approved, your cryptographic QR entry ticket will be generated automatically and sent to your email and participant dashboard.</p>
      <a href="${appUrl}/dashboard/payments" class="btn">Check Verification Status</a>
    `
  );
  return sendMail(
    {
      to,
      subject: `Payment Proof Received for ${eventTitle} (UTR: ${utrNumber})`,
      html,
    },
    "payment_submitted"
  );
}

// 4. Payment Approval & Ticket Delivery Email
export async function sendPaymentApprovalEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  ticketNumber: string,
  qrToken: string
) {
  const appUrl = getBaseUrl();
  const html = renderHeritageTemplate(
    "Payment Verified - Your QR Ticket is Ready",
    `
      <h2>Congratulations ${participantName}!</h2>
      <p>Your Paytm UPI payment for <strong>${eventTitle}</strong> has been officially audited and approved by our finance committee.</p>
      <div class="info-box">
        <strong>Ticket Number:</strong> ${ticketNumber}<br>
        <strong>Security QR Code Token:</strong><br>
        <div class="ticket-badge">${qrToken}</div><br>
        <strong>Status:</strong> Entry Confirmed &amp; Pass Active
      </div>
      <p>Your high-resolution digital entry QR ticket is ready for download and offline printing from your student dashboard.</p>
      <a href="${appUrl}/dashboard/tickets" class="btn">View &amp; Download QR Ticket</a>
    `
  );
  return sendMail(
    {
      to,
      subject: `[Confirmed] Payment Verified & Ticket Issued for ${eventTitle}`,
      html,
    },
    "payment_approved"
  );
}

// 5. Payment Rejection Email
export async function sendPaymentRejectionEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  rejectionReason: string
) {
  const appUrl = getBaseUrl();
  const html = renderHeritageTemplate(
    "Payment Verification Notice",
    `
      <h2>Hello ${participantName},</h2>
      <p>Our finance administration reviewed your submitted payment proof for <strong>${eventTitle}</strong>. Unfortunately, the submission could not be verified.</p>
      <div class="warning-box">
        <strong>Audit Feedback:</strong> ${rejectionReason}
      </div>
      <p>If you believe this is in error, please review your transaction details or contact the SWAR finance desk with your banking statement.</p>
      <a href="${appUrl}/dashboard/payments" class="btn">Review Payment Details</a>
    `
  );
  return sendMail(
    {
      to,
      subject: `Action Required: Payment Verification Update for ${eventTitle}`,
      html,
    },
    "payment_rejected"
  );
}

// 6. Payment Resubmission Request Email
export async function sendPaymentResubmitEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  resubmitReason: string
) {
  const appUrl = getBaseUrl();
  const html = renderHeritageTemplate(
    "Resubmission Required: Payment Proof",
    `
      <h2>Action Required: ${participantName}</h2>
      <p>Our finance administration inspected your payment proof for <strong>${eventTitle}</strong>. A clearer transaction receipt is required before your ticket can be issued.</p>
      <div class="warning-box">
        <strong>Organizer Feedback:</strong> ${resubmitReason}
      </div>
      <p>Please visit your payment dashboard to upload an official receipt showing the bank timestamp and complete 12-digit UPI reference number.</p>
      <a href="${appUrl}/dashboard/payments" class="btn">Resubmit Payment Proof</a>
    `
  );
  return sendMail(
    {
      to,
      subject: `[Action Required] Resubmit Payment Proof for ${eventTitle}`,
      html,
    },
    "payment_resubmit"
  );
}

// 7. Password Reset Email
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = renderHeritageTemplate(
    "Password Reset Request",
    `
      <h2>Password Reset Instructions</h2>
      <p>We received a request to reset the password for your <strong>AffinityAIIMS '26</strong> account.</p>
      <div class="info-box">
        Click the button below to establish a new password. This reset link is active for 60 minutes.
      </div>
      <a href="${resetUrl}" class="btn">Reset My Password</a>
      <p style="font-size: 11px; color: #A89E90; margin-top: 16px;">
        If you did not request a password reset, you can safely ignore this notification. Your account remains secure.
      </p>
    `
  );
  return sendMail(
    {
      to,
      subject: "AffinityAIIMS '26: Password Reset Request",
      html,
    },
    "password_reset"
  );
}

// 8. Contact Inquiry Notification Email
export async function sendContactInquiryNotification(
  name: string,
  email: string,
  college: string,
  subject: string,
  message: string
) {
  const recipient = cleanEnv(process.env.SMTP_USER) || "swar@aiimsraebareli.edu.in";
  const html = renderHeritageTemplate(
    `Helpdesk Inquiry: ${subject}`,
    `
      <h2>New Helpdesk Inquiry</h2>
      <div class="info-box">
        <strong>Sender Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>College / Institute:</strong> ${college || "Not specified"}<br>
        <strong>Subject:</strong> ${subject}
      </div>
      <p style="white-space: pre-line; background: #2E2B38; padding: 16px; border-radius: 8px;">
        ${message}
      </p>
    `
  );
  return sendMail(
    {
      to: recipient,
      subject: `[Helpdesk Ticket] ${subject} (from ${name})`,
      html,
      replyTo: email,
    },
    "contact_inquiry"
  );
}

// 9. Diagnostic Test Email
export async function sendTestEmail(to: string) {
  const host = cleanEnv(process.env.SMTP_HOST) || "smtp.gmail.com";
  const port = cleanEnv(process.env.SMTP_PORT) || "465";
  const user = cleanEnv(process.env.SMTP_USER) || "Not configured";
  const sender = getSenderAddress();

  const html = renderHeritageTemplate(
    "Gmail SMTP Operational Check",
    `
      <h2>Gmail SMTP Operational Diagnostics</h2>
      <p>This is a live diagnostic notification dispatched from the <strong>AffinityAIIMS '26 Festival Administration Platform</strong>.</p>
      <div class="info-box">
        <strong>Status:</strong> Gmail SMTP Connected &amp; Operational<br>
        <strong>Host:</strong> ${host}<br>
        <strong>Port:</strong> ${port}<br>
        <strong>Authenticated User:</strong> ${user}<br>
        <strong>From Header:</strong> ${sender}<br>
        <strong>Dispatched At:</strong> ${new Date().toISOString()}
      </div>
      <p>If you received this message in your inbox, your Nodemailer Gmail SMTP pipeline is functioning with 100% reliability.</p>
    `
  );
  return sendMail(
    {
      to,
      subject: "AffinityAIIMS '26: Gmail SMTP Operational Test",
      html,
    },
    "smtp_test"
  );
}
