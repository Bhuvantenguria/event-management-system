import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { hasRole } from "@/lib/permissions";
import {
  sendPaymentApprovalEmail,
  sendPaymentRejectionEmail,
  sendPaymentResubmitEmail,
} from "@/lib/email";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  await syncWithMongo();
  let payments = dataStore.getAllPayments();
  if (statusFilter && statusFilter !== "all") {
    payments = payments.filter((p) => p.status === statusFilter);
  }

  // Enrich payment submissions with registration details
  const enriched = payments.map((p) => {
    const reg = dataStore.getRegistrationById(p.registrationId);
    return {
      ...p,
      registration: reg,
    };
  });

  return NextResponse.json({ payments: enriched });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const reviewerId = (session?.user as any)?.id || "usr-finance-admin-1";

  if (!hasRole(role, ["admin", "super_admin"])) {
    return NextResponse.json({ error: "Forbidden: Administrator privilege required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { paymentId, action, rejectionReason } = body;

    if (!paymentId || !action || !["approve", "reject", "resubmit"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid payment review payload. Action must be approve, reject, or resubmit." },
        { status: 400 }
      );
    }

    await syncWithMongo();

    const payment = dataStore.getAllPayments().find((p) => p.id === paymentId);
    if (!payment) {
      return NextResponse.json({ error: "Payment submission not found." }, { status: 404 });
    }

    const reg = dataStore.getRegistrationById(payment.registrationId);

    const success = dataStore.reviewPayment(paymentId, reviewerId, action, rejectionReason);
    if (!success) {
      return NextResponse.json({ error: "Payment review update failed." }, { status: 500 });
    }

    // Ensure all changes (payment, registration, ticket) are flushed to MongoDB Atlas
    await dataStore.flushPending();

    // Trigger Nodemailer notifications
    if (reg) {
      if (action === "approve") {
        const ticket = dataStore.getTicketByRegistrationId(reg.id);
        if (ticket) {
          sendPaymentApprovalEmail(
            reg.userEmail,
            reg.userName,
            reg.eventTitle,
            ticket.ticketNumber,
            ticket.qrToken
          ).catch((err) => console.warn("Payment approval email notice:", err?.message || err));
        }
      } else if (action === "resubmit") {
        sendPaymentResubmitEmail(
          reg.userEmail,
          reg.userName,
          reg.eventTitle,
          rejectionReason || "Please upload a clearer receipt screenshot showing the 12-digit UTR."
        ).catch((err) => console.warn("Payment resubmission email notice:", err?.message || err));
      } else if (action === "reject") {
        sendPaymentRejectionEmail(
          reg.userEmail,
          reg.userName,
          reg.eventTitle,
          rejectionReason || "Verification criteria not met. Please review submission details."
        ).catch((err) => console.warn("Payment rejection email notice:", err?.message || err));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${action}d successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process payment review." },
      { status: 500 }
    );
  }
}
