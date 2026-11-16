import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const scannerId = (session?.user as any)?.id || "usr-scanner-staff-1";

  if (!hasRole(role, ["admin", "super_admin", "scanner_staff"])) {
    return NextResponse.json({ error: "Forbidden: Scanner staff privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { qrToken } = body;

    if (!qrToken || typeof qrToken !== "string") {
      return NextResponse.json({ error: "QR token string is required." }, { status: 400 });
    }

    await syncWithMongo();

    const result = dataStore.scanTicket(qrToken.trim(), scannerId);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          ticket: result.ticket,
        },
        { status: result.message.includes("Already scanned") ? 409 : 404 }
      );
    }

    // Flush scan status update to MongoDB Atlas
    await dataStore.flushPending();

    return NextResponse.json({
      success: true,
      message: result.message,
      ticket: result.ticket,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal scan processing error." }, { status: 500 });
  }
}
