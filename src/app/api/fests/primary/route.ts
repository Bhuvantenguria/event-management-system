import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/fests/primary
 * Public route that returns the active primary fest schedule and countdown target date
 * used by the homepage timeclock to autosync.
 */
export async function GET() {
  await syncWithMongo();
  const countdown = dataStore.getPrimaryCountdown();
  const primaryFest = dataStore.getPrimaryFest();

  return NextResponse.json({
    success: true,
    ...countdown,
    fest: primaryFest || null,
  });
}

/**
 * POST /api/fests/primary
 * Admin route to set a specific scheduled fest as the primary fest for homepage timeclock.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { festId } = body;

    if (!festId) {
      return NextResponse.json({ error: "festId is required." }, { status: 400 });
    }

    await syncWithMongo();
    const success = dataStore.setPrimaryFest(festId);
    if (!success) {
      return NextResponse.json({ error: "Fest not found." }, { status: 404 });
    }

    await dataStore.flushPending();
    const countdown = dataStore.getPrimaryCountdown();

    return NextResponse.json({
      success: true,
      message: "Primary fest updated. Homepage countdown timeclock autosynced successfully.",
      ...countdown,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to set primary fest." }, { status: 500 });
  }
}
