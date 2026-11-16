import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";

export async function GET() {
  await syncWithMongo();
  const gallery = dataStore.getAllGalleryItems();
  return NextResponse.json({ gallery });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    await syncWithMongo();

    const created = dataStore.createGalleryItem(body);
    await dataStore.flushPending();

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Gallery item ID is required." }, { status: 400 });
    }

    await syncWithMongo();
    const deleted = dataStore.deleteGalleryItem(id);
    if (!deleted) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    await dataStore.flushPending();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete gallery item" }, { status: 500 });
  }
}
