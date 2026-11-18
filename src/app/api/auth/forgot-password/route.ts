import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { sendPasswordResetEmail } from "@/lib/email";
import { getBaseUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    await syncWithMongo();

    const user = dataStore.getUserByEmail(cleanEmail);

    // If user exists, generate reset link and dispatch email
    if (user) {
      const resetToken = `rst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const baseUrl = getBaseUrl();
      const resetUrl = `${baseUrl}/login?resetToken=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

      try {
        await sendPasswordResetEmail(cleanEmail, resetUrl);
      } catch (err: any) {
        console.warn("Password reset email dispatch notice:", err?.message || err);
      }
    }

    // Always return success for security (prevents email enumeration attacks)
    return NextResponse.json({
      success: true,
      message: `If an account exists for ${cleanEmail}, a secure password reset link has been dispatched via Gmail SMTP.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
