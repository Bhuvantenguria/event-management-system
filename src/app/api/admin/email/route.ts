import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";
import {
  verifySmtpConnection,
  sendTestEmail,
  emailDispatchLogs,
  isSmtpConfigured,
  getSenderAddress,
} from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/email
 * Returns SMTP connection status, configuration state, sender address, and recent dispatch logs.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json(
      { error: "Forbidden: Administrator privilege required." },
      { status: 403 }
    );
  }

  const isConfigured = isSmtpConfigured();
  const senderAddress = getSenderAddress();
  const smtpUser = process.env.SMTP_USER || null;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT || "465";

  return NextResponse.json({
    status: isConfigured ? "configured" : "simulation_mode",
    isConfigured,
    senderAddress,
    smtpUser,
    smtpHost,
    smtpPort,
    logs: emailDispatchLogs.slice(0, 20),
  });
}

/**
 * POST /api/admin/email
 * Triggers either a live SMTP handshake verification or dispatches a test email.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json(
      { error: "Forbidden: Administrator privilege required." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { action, recipientEmail } = body;

    if (action === "verify") {
      const result = await verifySmtpConnection();
      return NextResponse.json(result);
    }

    if (action === "test") {
      const targetEmail = (recipientEmail || session?.user?.email || "").trim();
      if (!targetEmail) {
        return NextResponse.json(
          { error: "Recipient email address is required for test email dispatch." },
          { status: 400 }
        );
      }

      const sendResult = await sendTestEmail(targetEmail);
      return NextResponse.json({
        ...sendResult,
        recipient: targetEmail,
        logs: emailDispatchLogs.slice(0, 5),
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: 'verify' or 'test'." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process SMTP diagnostic request." },
      { status: 500 }
    );
  }
}
