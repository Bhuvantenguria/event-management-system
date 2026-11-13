"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const FAQS = [
  {
    question: "How does the Paytm QR manual payment process work?",
    answer:
      "When registering for a paid event or sports tournament, the system presents the official festival Paytm QR code and UPI ID. Scan using any UPI app (Paytm, Google Pay, PhonePe, BHIM), complete the transfer, and upload your payment screenshot along with the 12-digit UPI Reference/UTR number. Our finance team verifies this against bank records and approves it within a few hours.",
  },
  {
    question: "When and how do I receive my digital QR ticket?",
    answer:
      "For free events, tickets are generated immediately. For paid events, your digital QR ticket is generated automatically the moment your payment submission is approved by our Finance Administrator. You can view/download it anytime from 'My Tickets' in your dashboard, and a copy is also emailed to your registered address.",
  },
  {
    question: "Can I register as an individual or bring a college team?",
    answer:
      "Both! Each event specifies whether it supports Individual, Team, or both formats. Team captains can register their team name, specify member names, emails, phones, and student IDs. All team members receive their digital credentials.",
  },
  {
    question: "How does entry scanning work at festival venues?",
    answer:
      "Our gate volunteers and scanner staff use high-precision live camera QR scanners on the platform. Present your digital ticket on your phone screen or printed copy. Scans are cryptographically verified in real-time, preventing unauthorized duplicates.",
  },
  {
    question: "What should I do if my payment requires resubmission or gets rejected?",
    answer:
      "If the finance admin notes an incorrect UTR number or blurry screenshot, your status changes to 'Resubmission Required' with an explanatory note. You can simply go to your dashboard, upload the corrected screenshot or UTR number, and resubmit without re-registering.",
  },
  {
    question: "Is accommodation provided for outstation participants?",
    answer:
      "Yes, on-campus heritage hostel accommodation is available on a first-come, first-served basis for all verified college delegates registered in at least two competitive events. Detailed accommodation passes can be requested in your participant dashboard.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-border/40">
      <HeritageDivider
        subtitle="Clarifications & Guidelines"
        title="Frequently Asked Questions"
      />

      <div className="space-y-4 mt-10">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-card border border-fest-gold/30 hover:border-fest-sunset overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between text-foreground hover:bg-fest-champagne/30 transition-colors focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-base sm:text-lg font-bold pr-4">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? "bg-fest-sunset text-white rotate-180"
                      : "bg-fest-champagne/40 dark:bg-fest-charcoal text-muted-foreground"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 font-sans">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
