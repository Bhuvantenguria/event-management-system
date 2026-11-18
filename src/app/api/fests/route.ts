import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/fests
 * Public route to list all scheduled fests.
 */
export async function GET() {
  await syncWithMongo();
  const fests = dataStore.getAllFests();
  return NextResponse.json({ success: true, fests });
}

/**
 * POST /api/fests
 * Admin route to schedule a new festival edition.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, startDate, endDate, venue } = body;

    if (!name || !startDate || !endDate || !venue) {
      return NextResponse.json(
        { error: "Fest name, start date, end date, and venue are required." },
        { status: 400 }
      );
    }

    await syncWithMongo();
    const created = dataStore.createFest(body);
    await dataStore.flushPending();

    return NextResponse.json({ success: true, fest: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to schedule fest." }, { status: 500 });
  }
}

/**
 * PUT /api/fests
 * Admin route to update an existing scheduled fest or change primary status.
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
      return NextResponse.json({ error: "Fest ID is required for update." }, { status: 400 });
    }

    await syncWithMongo();
    const updated = dataStore.updateFest(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Fest schedule not found." }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true, fest: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update fest schedule." }, { status: 500 });
  }
}

/**
 * DELETE /api/fests
 * Admin route to delete a scheduled fest.
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
      return NextResponse.json({ error: "Fest ID is required." }, { status: 400 });
    }

    await syncWithMongo();
    const deleted = dataStore.deleteFest(id);
    if (!deleted) {
      return NextResponse.json({ error: "Fest schedule not found." }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true, message: "Fest schedule deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete fest schedule." }, { status: 500 });
  }
}
