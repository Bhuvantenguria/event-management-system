import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, college, studentId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters in length." },
        { status: 400 }
      );
    }

    await syncWithMongo();
    const existingUser = dataStore.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = dataStore.createUser({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "participant",
      phone: phone || "",
      college: college || "",
      studentId: studentId || "",
      emailVerified: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! You can now log in.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
