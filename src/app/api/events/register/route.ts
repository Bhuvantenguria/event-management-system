import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "You must be logged in to register for an event." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { eventSlug, eventTitle, participationType, teamName, teamMembers, amount } = body;

    if (!eventSlug || !eventTitle) {
      return NextResponse.json(
        { error: "Event slug and title are required." },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id || "usr-student-1";
    const userName = session.user.name || "Participant";
    const userEmail = session.user.email;
    const college = (session.user as any).college || "College Participant";

    await syncWithMongo();

    // Check duplicate registration
    const existing = dataStore
      .getRegistrationsByUser(userId)
      .find((r) => r.eventId === eventSlug && r.registrationStatus !== "cancelled");

    if (existing) {
      return NextResponse.json(
        {
          error: "You have already registered for this event.",
          registration: existing,
        },
        { status: 409 }
      );
    }

    const isFree = !amount || amount === 0;

    const newReg = dataStore.createRegistration({
      eventId: eventSlug,
      eventTitle,
      userId,
      userName,
      userEmail,
      college,
      participationType: participationType || "individual",
      teamName: teamName || undefined,
      teamMembers: teamMembers || undefined,
      amount: amount || 0,
      paymentStatus: isFree ? "approved" : "awaiting_payment",
      registrationStatus: isFree ? "confirmed" : "pending",
    });

    // If free event, generate digital ticket immediately
    if (isFree) {
      dataStore.createTicketForRegistration(newReg);
    }

    return NextResponse.json({
      success: true,
      message: isFree
        ? "Registration confirmed! Your digital QR ticket is ready."
        : "Registration created! Please proceed to Paytm QR payment verification.",
      registration: newReg,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process event registration." },
      { status: 500 }
    );
  }
}
