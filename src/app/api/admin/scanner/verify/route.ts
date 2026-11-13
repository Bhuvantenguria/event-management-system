import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const staffId = (session?.user as any)?.id || "usr-scanner-staff-1";

  if (!hasRole(role, ["super_admin", "scanner_staff", "event_coordinator", "event_admin"])) {
    return NextResponse.json(
      { error: "Forbidden: Scanner staff or admin privileges required for entry verification." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { qrToken } = body;

    if (!qrToken || typeof qrToken !== "string") {
      return NextResponse.json({ error: "Missing or invalid QR token." }, { status: 400 });
    }

    await syncWithMongo();
    const result = dataStore.scanTicket(qrToken.trim(), staffId);

    if (!result.success) {
      if (result.alreadyScanned) {
        return NextResponse.json(
          {
            error: result.message,
            alreadyScanned: true,
            ticket: result.ticket,
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      ticket: result.ticket,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to verify entry scan." },
      { status: 500 }
    );
  }
}
