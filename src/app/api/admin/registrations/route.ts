import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json(
      { error: "Forbidden: Administrator privilege required." },
      { status: 403 }
    );
  }

  await syncWithMongo();

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const status = searchParams.get("status");

  let registrations = dataStore.getAllRegistrations();

  if (eventId && eventId !== "all") {
    registrations = registrations.filter(
      (r) => r.eventId === eventId || r.eventTitle.toLowerCase().includes(eventId.toLowerCase())
    );
  }

  if (status && status !== "all") {
    if (status === "approved") {
      registrations = registrations.filter(
        (r) => r.paymentStatus === "approved" || r.registrationStatus === "confirmed"
      );
    } else if (status === "pending_verification") {
      registrations = registrations.filter((r) => r.paymentStatus === "pending_verification");
    } else if (status === "awaiting_payment") {
      registrations = registrations.filter(
        (r) => r.paymentStatus === "awaiting_payment" || r.amount === 0
      );
    }
  }

  return NextResponse.json(
    { registrations },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
