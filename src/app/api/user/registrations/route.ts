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

  // Search by either user ID or user email
  const userRegistrations = dataStore
    .getAllRegistrations()
    .filter(
      (r) =>
        (userId && r.userId === userId) ||
        (userEmail && r.userEmail.toLowerCase() === userEmail.toLowerCase())
    );

  return NextResponse.json(
    { registrations: userRegistrations },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
