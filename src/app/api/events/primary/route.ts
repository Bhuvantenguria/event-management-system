import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/events/primary
 * Public endpoint to fetch the current Primary Event countdown details for the Homepage Hero timeclock.
 * Provides targetDate, primaryEvent, and direct registrationUrl.
 */
export async function GET() {
  await syncWithMongo();
  const countdown = dataStore.getPrimaryEventCountdown();
  return NextResponse.json(countdown);
}

/**
 * POST /api/events/primary
 * Admin endpoint to designate an event as the Primary Event driving the homepage countdown.
 * Body: { eventId: string }
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required." }, { status: 400 });
    }

    const success = dataStore.setPrimaryEvent(eventId);
    if (!success) {
      return NextResponse.json({ error: "Event not found with provided ID." }, { status: 404 });
    }

    await dataStore.flushPending();
    const updatedCountdown = dataStore.getPrimaryEventCountdown();

    return NextResponse.json({
      message: `Event '${updatedCountdown.title}' set as Primary Event for Homepage countdown.`,
      ...updatedCountdown,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to set primary event." }, { status: 500 });
  }
}
