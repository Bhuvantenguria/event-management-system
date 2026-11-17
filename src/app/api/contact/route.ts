import { NextResponse } from "next/server";
import { sendContactInquiryNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, college, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    sendContactInquiryNotification(
      name.trim(),
      email.trim(),
      college || "",
      subject || "General Inquiry",
      message.trim()
    ).catch((err) => {
      console.warn("Contact inquiry email dispatch notice:", err?.message || err);
    });

    return NextResponse.json({
      success: true,
      message: "Helpdesk inquiry received successfully! A coordinator will respond shortly.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process inquiry." },
      { status: 500 }
    );
  }
}
