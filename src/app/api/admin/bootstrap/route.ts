import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, email, password, name } = body;

    const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET || "admin-bootstrap-up-2026";

    if (!secret || secret !== bootstrapSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid bootstrap secret token." },
        { status: 401 }
      );
    }

    await syncWithMongo();

    const adminEmail = (email || "admin@aiimsraebareli.edu.in").toLowerCase().trim();
    const existing = dataStore.getUserByEmail(adminEmail);

    if (existing) {
      existing.role = "super_admin";
      if (password) {
        existing.passwordHash = await bcrypt.hash(password, 10);
      }
      await dataStore.flushPending();
      return NextResponse.json({
        success: true,
        message: `Super Admin account '${adminEmail}' updated successfully.`,
        user: { email: existing.email, role: existing.role },
      });
    }

    const rawPass = password || "Admin@1234";
    const passwordHash = await bcrypt.hash(rawPass, 10);

    const newAdmin = dataStore.createUser({
      name: name || "Super Administrator",
      email: adminEmail,
      passwordHash,
      role: "super_admin",
      college: "Festival Central Secretariat",
      emailVerified: true,
    });

    await dataStore.flushPending();

    return NextResponse.json({
      success: true,
      message: `Initial Super Admin account created for '${adminEmail}'.`,
      user: { email: newAdmin.email, role: newAdmin.role },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to bootstrap admin." },
      { status: 500 }
    );
  }
}
