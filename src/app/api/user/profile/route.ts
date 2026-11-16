import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncWithMongo();

  const user = dataStore.getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      studentId: user.studentId,
      createdAt: user.createdAt,
    },
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, college, studentId, currentPassword, newPassword } = body;

    await syncWithMongo();

    const user = dataStore.getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (college !== undefined) updates.college = college;
    if (studentId !== undefined) updates.studentId = studentId;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect current password." },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = dataStore.updateUserProfile(user.id, updates);
    await dataStore.flushPending();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updated?.id,
        name: updated?.name,
        email: updated?.email,
        phone: updated?.phone,
        college: updated?.college,
        studentId: updated?.studentId,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
