import React from "react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">Last updated: January 2026</p>
      </div>

      <div className="bg-card rounded-xl border border-heritage-gold/30 p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>
            When registering as a participant on Rangmanch UP, we collect your name, college
            institution, email address, phone number, and student identification details.
            For paid events, we store the payment screenshot and UPI transaction reference (UTR)
            submitted solely for manual financial audit and ticket dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Protection of Financial Proofs</h2>
          <p>
            Payment screenshots uploaded by participants are strictly protected and only
            accessible to authorized Finance Administrators and Super Admins. We never share
            or sell participant data or payment screenshots to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">3. QR Ticket Data & Check-in Scans</h2>
          <p>
            Digital QR tickets contain cryptographically signed, unpredictable tokens used exclusively
            at the entry gate by authorized scanning staff to verify legitimate attendance. Scans are logged
            with timestamps to prevent duplicate re-entry.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Email Notifications</h2>
          <p>
            We use direct Gmail SMTP via Nodemailer to send transactional emails including registration
            confirmations, payment verification approvals/rejections, and QR ticket downloads. We do not
            send unsolicited spam.
          </p>
        </section>
      </div>
    </div>
  );
}
