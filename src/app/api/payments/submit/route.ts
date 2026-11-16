import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

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
    const {
      registrationId,
      amountSubmitted,
      utrNumber,
      paymentScreenshotUrl,
      paymentDate,
      paymentTime,
      notes,
    } = body;

    if (!registrationId || !utrNumber || !paymentScreenshotUrl) {
      return NextResponse.json(
        { error: "Missing required fields: registrationId, utrNumber, and payment screenshot proof are required." },
        { status: 400 }
      );
    }

    await syncWithMongo();

    const reg = dataStore.getRegistrationById(registrationId);
    if (!reg) {
      return NextResponse.json(
        { error: "Event registration not found." },
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
