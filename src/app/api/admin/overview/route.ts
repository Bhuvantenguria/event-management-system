import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json(
      { error: "Forbidden: Administrator privilege required." },
      { status: 403 }
    );
  }

  await syncWithMongo();

  const registrations = dataStore.getAllRegistrations();
  const payments = dataStore.getAllPayments();
  const events = dataStore.getAllEvents();
  const gallery = dataStore.getAllGalleryItems();
  const qrSettings = dataStore.getQrSettings();

  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const approvedPayments = payments.filter((p) => p.status === "approved").length;

  const totalRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (p.amountSubmitted || 0), 0);

  return NextResponse.json(
    {
      stats: {
        totalEvents: events.length,
        totalRegistrations: registrations.length,
        pendingPayments,
        approvedPayments,
        totalRevenue,
        galleryCount: gallery.length,
        qrSettings,
      },
      recentRegistrations: registrations.slice(-6).reverse(),
      recentPayments: payments.slice(-6).reverse().map((p) => ({
        ...p,
        registration: dataStore.getRegistrationById(p.registrationId),
      })),
      events,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
