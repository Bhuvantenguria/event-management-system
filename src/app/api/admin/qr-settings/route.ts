import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export async function GET() {
  await syncWithMongo();
  const qrSettings = dataStore.getQrSettings();
  return NextResponse.json({ qrSettings });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { upiId, upiName, qrImageUrl, paymentInstructions, isEnabled } = body;

    const updated = dataStore.updateQrSettings({
      upiId: upiId !== undefined ? upiId : undefined,
      upiName: upiName !== undefined ? upiName : undefined,
      qrImageUrl: qrImageUrl !== undefined ? qrImageUrl : undefined,
      paymentInstructions: paymentInstructions !== undefined ? paymentInstructions : undefined,
      isEnabled: isEnabled !== undefined ? isEnabled : undefined,
    });

    await dataStore.flushPending();

    return NextResponse.json({
      success: true,
      message: "Paytm QR configuration updated successfully.",
      qrSettings: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update QR settings." },
      { status: 500 }
    );
  }
}
