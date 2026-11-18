import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/clubs
 * Public route to list all active college cultural clubs.
 */
export async function GET() {
  await syncWithMongo();
  const clubs = dataStore.getAllClubs();
  return NextResponse.json({ success: true, clubs });
}

/**
 * POST /api/clubs
 * Admin route to create a new college cultural club.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, category } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Club name and category are required." }, { status: 400 });
    }

    await syncWithMongo();
    const created = dataStore.createClub(body);
    await dataStore.flushPending();

    return NextResponse.json({ success: true, club: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create club" }, { status: 500 });
  }
}

/**
 * PUT /api/clubs
 * Admin route to update an existing college cultural club.
 */
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Club ID is required for update." }, { status: 400 });
    }

    await syncWithMongo();
    const updated = dataStore.updateClub(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true, club: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update club" }, { status: 500 });
  }
}

/**
 * DELETE /api/clubs
 * Admin route to delete a club.
 */
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Club ID is required." }, { status: 400 });
    }

    await syncWithMongo();
    const deleted = dataStore.deleteClub(id);
    if (!deleted) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true, message: "Club deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete club" }, { status: 500 });
  }
}
