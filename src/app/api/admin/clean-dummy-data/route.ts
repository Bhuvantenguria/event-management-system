import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { purgeDummyDataFromMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";
import { dataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/clean-dummy-data
 * Administrator utility to purge all legacy dummy and mock records from dataStore and MongoDB Atlas,
 * ensuring only essential administrative data and active clubs/fests remain.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const result = await purgeDummyDataFromMongo();
    await dataStore.flushPending();

    return NextResponse.json({
      success: true,
      message: "All dummy data successfully purged from database. Essential admin accounts preserved.",
      ...result,
      remainingUsers: dataStore.getAllUsers().length,
      remainingRegistrations: dataStore.getAllRegistrations().length,
      remainingPayments: dataStore.getAllPayments().length,
      remainingTickets: dataStore.getAllTickets().length,
      clubsCount: dataStore.getAllClubs().length,
      festsCount: dataStore.getAllFests().length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to purge dummy data." }, { status: 500 });
  }
}
