import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required." },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    await syncWithMongo();

    const verification = dataStore.verifyPasswordResetToken(token, cleanEmail);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.reason || "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    const user = dataStore.getUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    dataStore.updateUserProfile(user.id, { passwordHash });
    await dataStore.flushPending();
    dataStore.consumePasswordResetToken(token, cleanEmail);

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully. You can now log in.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
