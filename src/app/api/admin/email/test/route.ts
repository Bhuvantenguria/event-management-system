import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTestEmail, emailDispatchLogs } from "@/lib/email";
import { hasRole } from "@/lib/permissions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, "super_admin")) {
    return NextResponse.json(
      { error: "Forbidden: Super Administrator access required to test SMTP." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { toEmail } = body;

    const targetEmail = toEmail || session?.user?.email || "admin@rangmanchup.in";

    const result = await sendTestEmail(targetEmail);

    return NextResponse.json({
      success: true,
      simulated: result.simulated || false,
      message: result.simulated
        ? `SMTP credentials not configured in environment. Notification simulated successfully for ${targetEmail}.`
        : `Diagnostic test email dispatched to ${targetEmail} via Gmail SMTP.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to dispatch test email." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ logs: emailDispatchLogs });
}
