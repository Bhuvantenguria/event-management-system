import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// In-Memory Email Dispatch Log
export const emailDispatchLogs: Array<{
  id: string;
  to: string;
  subject: string;
  type: string;
  status: "sent" | "simulated" | "failed";
  timestamp: string;
  error?: string;
}> = [];

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || pass === "your_google_app_password") {
    // Returns null to simulate email gracefully in dev/preview without crashing
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function renderHeritageTemplate(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F5EEDC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #252321; }
    .container { max-width: 600px; margin: 30px auto; background-color: #FAF6EE; border: 1px solid #C5A15A; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(112, 43, 50, 0.1); }
    .header { background-color: #702B32; padding: 24px; text-align: center; border-bottom: 2px solid #C5A15A; }
    .header h1 { margin: 0; font-family: Georgia, serif; color: #DFC283; font-size: 24px; }
    .header p { margin: 4px 0 0; color: #F5EEDC; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
    .body { padding: 32px 24px; font-size: 14px; line-height: 1.6; color: #252321; }
    .footer { background-color: #252321; color: #F5EEDC; padding: 18px 24px; font-size: 11px; text-align: center; border-top: 1px solid #C5A15A; }
    .btn { display: inline-block; background-color: #702B32; color: #F5EEDC !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; border: 1px solid #C5A15A; margin: 16px 0; }
    .info-box { background-color: #EFE6D2; border-left: 4px solid #C5A15A; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Rangmanch '26</h1>
      <p>Uttar Pradesh Culture & Heritage College Festival</p>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>© 2026 Rangmanch UP Cultural Festival Secretariat</p>
      <p style="color: #DFC283;">A Grand Celebration of Awadhi, Kashi, and Braj Heritage</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendMail(
  options: EmailOptions,
  type = "general"
): Promise<{ success: boolean; simulated?: boolean; messageId?: string }> {
  const from = process.env.EMAIL_FROM || '"Rangmanch UP Cultural Fest" <fest.cultural.up@gmail.com>';
  const transporter = createTransporter();

  if (!transporter) {
    // Graceful simulation when Gmail SMTP credentials are not yet configured in env
    const logItem = {
      id: `mail-${Date.now()}`,
      to: options.to,
      subject: options.subject,
      type,
      status: "simulated" as const,
      timestamp: new Date().toISOString(),
    };
    emailDispatchLogs.unshift(logItem);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    });

    emailDispatchLogs.unshift({
      id: `mail-${Date.now()}`,
      to: options.to,
      subject: options.subject,
      type,
      status: "sent",
      timestamp: new Date().toISOString(),
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    emailDispatchLogs.unshift({
      id: `mail-${Date.now()}`,
      to: options.to,
      subject: options.subject,
      type,
      status: "failed",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
    return { success: false };
  }
}

// 1. Welcome Email
export async function sendWelcomeEmail(to: string, name: string) {
  const html = renderHeritageTemplate(
    "Welcome to Rangmanch UP 2026",
    `
      <h2 style="font-family: Georgia, serif; color: #702B32;">Pranam ${name},</h2>
      <p>Welcome to <strong>Rangmanch UP 2026</strong>! Your participant account has been successfully created.</p>
      <p>Explore over 40+ competitions across performing arts, athletics, literature, hackathons, and regional crafts.</p>
      <div class="info-box">
        <strong>Important Dates:</strong> 12th – 15th March 2026<br>
        <strong>Venue:</strong> University Heritage Grounds, Lucknow, Uttar Pradesh
      </div>
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/events" class="btn">Explore All Competitions</a>
    `
  );
  return sendMail({ to, subject: "Welcome to Rangmanch UP 2026!", html }, "welcome");
}

// 2. Payment Approval & Ticket Delivery Email
export async function sendPaymentApprovalEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  ticketNumber: string,
  qrToken: string
) {
  const html = renderHeritageTemplate(
    "Payment Approved - Your QR Ticket is Ready",
    `
      <h2 style="font-family: Georgia, serif; color: #702B32;">Congratulations ${participantName}!</h2>
      <p>Your manual Paytm UPI payment for <strong>${eventTitle}</strong> has been officially verified and approved by our finance committee.</p>
      <div class="info-box">
        <strong>Ticket Number:</strong> ${ticketNumber}<br>
        <strong>Security QR Code Token:</strong> <code style="font-family: monospace;">${qrToken}</code><br>
        <strong>Status:</strong> Entry Confirmed
      </div>
      <p>Your digital QR entry pass is now accessible on your participant dashboard.</p>
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/tickets" class="btn">View & Download QR Ticket</a>
    `
  );
  return sendMail(
    { to, subject: `[Confirmed] Payment Verified & Ticket Issued for ${eventTitle}`, html },
    "payment_approved"
  );
}

// 3. Payment Rejection Email
export async function sendPaymentRejectionEmail(
  to: string,
  participantName: string,
  eventTitle: string,
  rejectionReason: string
) {
  const html = renderHeritageTemplate(
    "Payment Verification Notice",
    `
      <h2 style="font-family: Georgia, serif; color: #702B32;">Hello ${participantName},</h2>
      <p>Our finance administration reviewed your submitted payment proof for <strong>${eventTitle}</strong>. Unfortunately, it could not be approved due to the following reason:</p>
      <div class="info-box" style="border-left-color: #8D3535; background-color: #F8E8E8;">
        <strong>Audit Feedback:</strong> ${rejectionReason}
      </div>
      <p>Please log in to your dashboard to inspect your submission or upload a valid transaction proof.</p>
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/payments" class="btn">Review Payment Details</a>
    `
  );
  return sendMail(
    { to, subject: `Action Required: Payment Verification Update for ${eventTitle}`, html },
    "payment_rejected"
  );
}

// 4. Test Email for Admin
export async function sendTestEmail(to: string) {
  const html = renderHeritageTemplate(
    "Nodemailer Gmail SMTP Diagnostics",
    `
      <h2 style="font-family: Georgia, serif; color: #702B32;">Gmail SMTP Operational Check</h2>
      <p>This is a diagnostic notification sent from the <strong>Rangmanch UP 2026 Festival Administration System</strong>.</p>
      <div class="info-box">
        <strong>Host:</strong> ${process.env.SMTP_HOST || "smtp.gmail.com"}<br>
        <strong>Port:</strong> ${process.env.SMTP_PORT || "465"}<br>
        <strong>Secure TLS:</strong> ${process.env.SMTP_SECURE || "true"}<br>
        <strong>Timestamp:</strong> ${new Date().toISOString()}
      </div>
      <p>If you received this message, your Gmail SMTP via Nodemailer is functioning perfectly.</p>
    `
  );
  return sendMail({ to, subject: "Rangmanch UP 2026: SMTP Test Notification", html }, "smtp_test");
}
