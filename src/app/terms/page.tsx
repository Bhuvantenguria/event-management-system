import React from "react";

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Terms & Conditions
        </h1>
        <p className="text-xs text-muted-foreground">Last updated: January 2026</p>
      </div>

      <div className="bg-card rounded-xl border border-heritage-gold/30 p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Participant Eligibility & Code of Conduct</h2>
          <p>
            Participation is open to bonafide college and university students possessing valid
            institutional ID cards. Participants must uphold the dignity of the festival, respect
            heritage grounds, and adhere to zero-tolerance policies regarding ragging, violence, or substance abuse.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Manual Paytm QR Payment Policy</h2>
          <p>
            Payment for paid events must be completed manually via the verified Paytm QR code or UPI ID.
            Submitting fabricated or duplicate UTR numbers or altered screenshots constitutes fraud
            and will result in immediate disqualification and institution notification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Non-Transferability of QR Tickets</h2>
          <p>
            Each digital QR ticket is uniquely tied to the registered participant or team captain.
            Tickets cannot be resold, swapped, or shared. Attempting duplicate entry using a scanned ticket
            will flag an immediate gate security alert.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Event Schedules & Rulebook</h2>
          <p>
            The festival committee reserves the right to modify schedules, venues, or rules in response
            to weather or administrative exigencies. Registered delegates will receive real-time email
            and notification alerts.
          </p>
        </section>
      </div>
    </div>
  );
}
