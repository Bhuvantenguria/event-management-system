"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { dataStore } from "@/lib/data-store";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Ticket,
  Plus,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function MyRegistrationsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "usr-student-1";
  const registrations = dataStore.getRegistrationsByUser(userId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            My Event <span className="gold-gradient-text">Registrations</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Comprehensive history of your individual and team fest registrations
          </p>
        </div>
        <Link
          href="/events"
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register for New Event</span>
        </Link>
      </div>

      <div className="space-y-4">
        {registrations.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-foreground">
              No Registrations Yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
              Explore 40+ competitions across performing arts, athletics, literature, and technology.
            </p>
            <Link
              href="/events"
              className="px-6 py-2.5 rounded-md bg-heritage-maroon text-heritage-ivory text-xs font-bold border border-heritage-gold"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-card rounded-xl border border-heritage-gold/30 hover:border-heritage-gold p-5 sm:p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-heritage-gold bg-heritage-charcoal px-2 py-0.5 rounded">
                    {reg.registrationNumber}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {reg.participationType}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Registered on {formatDate(reg.createdAt)}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-foreground">
                  {reg.eventTitle}
                </h3>

                {reg.teamName && (
                  <p className="text-xs text-muted-foreground font-sans">
                    <span className="font-semibold text-foreground">Team Name:</span> {reg.teamName}{" "}
                    ({reg.teamMembers?.length || 1} Squad Members)
                  </p>
                )}

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-bold text-foreground">
                    Fee: {reg.amount === 0 ? "Free" : formatCurrency(reg.amount)}
                  </span>
                  <span>•</span>
                  <span>
                    Status:{" "}
                    {reg.paymentStatus === "approved" ? (
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        Payment Approved & Ticket Issued
                      </strong>
                    ) : reg.paymentStatus === "pending_verification" ? (
                      <strong className="text-amber-600 dark:text-amber-400">
                        Payment Proof Under Finance Review
                      </strong>
                    ) : (
                      <strong className="text-destructive">
                        Payment Required via Paytm QR
                      </strong>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                {reg.paymentStatus === "approved" ? (
                  <Link
                    href="/dashboard/tickets"
                    className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-heritage-gold" />
                    <span>Download QR Ticket</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/payments"
                    className="px-4 py-2 rounded-md bg-heritage-gold/20 hover:bg-heritage-gold/30 text-heritage-gold-dark dark:text-heritage-gold-light border border-heritage-gold/50 text-xs font-bold transition-colors"
                  >
                    <span>Submit UPI Proof</span>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
