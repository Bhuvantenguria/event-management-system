import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncWithMongo();

  const userId = (session.user as any).id;
  const userEmail = session.user.email;

  const userRegs = dataStore
    .getAllRegistrations()
    .filter(
      (r) =>
        (userId && r.userId === userId) ||
        (userEmail && r.userEmail.toLowerCase() === userEmail.toLowerCase())
    );

  const regIds = new Set(userRegs.map((r) => r.id));

  const userPayments = dataStore
    .getAllPayments()
    .filter((p) => regIds.has(p.registrationId))
    .map((p) => ({
      ...p,
      registration: userRegs.find((r) => r.id === p.registrationId),
    }));

  return NextResponse.json(
    { payments: userPayments },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
