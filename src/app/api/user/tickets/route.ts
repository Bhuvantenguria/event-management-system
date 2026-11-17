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

  const userEmail = session.user.email;
  const userTickets = dataStore.getTicketsByUser(userEmail);

  return NextResponse.json(
    { tickets: userTickets },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
