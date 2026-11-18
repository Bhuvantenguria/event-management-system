import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { sendPaymentSubmittedEmail } from "@/lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized: You must be signed in to submit payment proof." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    let {
      registrationId,
      eventId,
      eventSlug,
      eventTitle,
      participationType,
      teamName,
      teamMembers,
      amountSubmitted,
      utrNumber,
      paymentScreenshotUrl,
      paymentDate,
      paymentTime,
      notes,
    } = body;

    if (!utrNumber || !utrNumber.trim() || !paymentScreenshotUrl || !paymentScreenshotUrl.trim()) {
      return NextResponse.json(
        { error: "12-digit UTR number and payment receipt screenshot proof are compulsory." },
        { status: 400 }
      );
    }

    if (!registrationId && !eventId && !eventSlug) {
      return NextResponse.json(
        { error: "Please select an event registration or event to submit payment proof for." },
        { status: 400 }
      );
    }

    await syncWithMongo();

    let reg = registrationId ? dataStore.getRegistrationById(registrationId) : undefined;

    // If registrationId wasn't found or was an event ID/slug, create or locate the registration
    if (!reg && (eventId || eventSlug || (registrationId && registrationId.startsWith("event:")))) {
      const targetSlug = (eventSlug || eventId || registrationId.replace(/^event:/, "")).trim();
      const ev = dataStore.getEventBySlug(targetSlug) || dataStore.getEventById(targetSlug);
      const evTitle = ev?.title || eventTitle || targetSlug;
      const evFee = ev ? ev.registrationFee : (Number(amountSubmitted) || 0);

      const userId = (session.user as any).id || `usr-${Date.now()}`;
      const userName = session.user.name || "Participant";
      const userEmail = session.user.email;
      const college = (session.user as any).college || "College Participant";

      // Check if user already registered for this event
      const existing = dataStore
        .getRegistrationsByUser(userId)
        .find((r) => (r.eventId === targetSlug || r.eventId === ev?.id) && r.registrationStatus !== "cancelled");

      if (existing) {
        reg = existing;
        registrationId = existing.id;
      } else {
        reg = dataStore.createRegistration({
          eventId: ev?.id || targetSlug,
          eventTitle: evTitle,
          userId,
          userName,
          userEmail,
          college,
          participationType: participationType || "individual",
          teamName: teamName || undefined,
          teamMembers: teamMembers || undefined,
          amount: evFee,
          paymentStatus: "pending_verification",
          registrationStatus: "pending",
        });
        registrationId = reg.id;
      }
    }

    if (!reg) {
      return NextResponse.json(
        { error: "Event registration not found. Please select an event to register." },
        { status: 404 }
      );
    }

    const currentSubmission = dataStore.getPaymentByRegistrationId(registrationId);
    const isUnique = dataStore.isUtrUnique(utrNumber.trim(), currentSubmission?.id);
    if (!isUnique) {
      return NextResponse.json(
        { error: "This UTR / UPI reference number has already been submitted for another registration. Duplicate transactions are not allowed." },
        { status: 409 }
      );
    }

    const payment = dataStore.submitPaymentProof({
      registrationId,
      amountExpected: reg.amount,
      amountSubmitted: Number(amountSubmitted) || reg.amount,
      utrNumber: utrNumber.trim(),
      paymentScreenshotUrl,
      paymentDate: paymentDate || new Date().toISOString().split("T")[0],
      paymentTime,
      notes,
    });

    // Ensure payment submission is saved to MongoDB Atlas
    await dataStore.flushPending();

    // Trigger transactional payment proof received email (awaited for serverless reliability)
    try {
      await sendPaymentSubmittedEmail(
        session.user.email,
        session.user.name || "Participant",
        reg.eventTitle,
        utrNumber.trim(),
        Number(amountSubmitted) || reg.amount
      );
    } catch (err: any) {
      console.warn("Payment submission email notice:", err?.message || err);
    }

    return NextResponse.json({
      success: true,
      message: "Payment proof submitted successfully! Verification pending.",
      payment,
    });
  } catch (error: any) {
    console.error("Payment submission API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit payment proof." },
      { status: 500 }
    );
  }
}
