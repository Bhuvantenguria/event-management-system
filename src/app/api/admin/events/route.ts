import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export async function GET() {
  await syncWithMongo();
  const events = dataStore.getAllEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    await syncWithMongo();

    const created = dataStore.createEvent(body);
    await dataStore.flushPending();

    return NextResponse.json({ success: true, event: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create event" }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: "Event ID is required for update." }, { status: 400 });
    }

    await syncWithMongo();

    const updated = dataStore.updateEvent(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update event" }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    await syncWithMongo();
    const deleted = dataStore.deleteEvent(id);
    if (!deleted) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete event" }, { status: 500 });
  }
}
