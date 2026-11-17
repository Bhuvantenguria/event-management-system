import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  await syncWithMongo();
  const qrSettings = dataStore.getQrSettings();
  return NextResponse.json(
    { qrSettings },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
