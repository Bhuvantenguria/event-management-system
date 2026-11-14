"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { dataStore } from "@/lib/data-store";
import {
  CalendarCheck,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Retrieve user registrations and tickets from dataStore
  const userEmail = user?.email || "student@example.com";
  const userId = (user as any)?.id || "usr-student-1";

  const registrations = dataStore.getRegistrationsByUser(userId);
  const tickets = dataStore.getTicketsByUser(userEmail);

  const approvedCount = registrations.filter((r) => r.paymentStatus === "approved").length;
  const pendingCount = registrations.filter((r) => r.paymentStatus === "pending_verification").length;
  const awaitingPaymentCount = registrations.filter(
    (r) => r.paymentStatus === "awaiting_payment" || r.paymentStatus === "resubmission_required"
  ).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-heritage-maroon to-heritage-charcoal text-heritage-ivory p-6 sm:p-8 border border-heritage-gold/40 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 jaali-bg opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-heritage-gold/20 text-heritage-gold-light text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome, {user?.name || "Participant"}!</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-heritage-ivory">
            Participant <span className="gold-gradient-text">Command Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-heritage-sandstone font-sans max-w-xl">
            Track your event registrations, submit manual Paytm UPI payment proofs, download
            cryptographic QR tickets, and manage college credentials.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-card border border-heritage-gold/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-sans font-semibold text-muted-foreground uppercase tracking-wider block">
              Registered Events
            </span>
            <span className="font-serif text-2xl font-black text-foreground mt-1 block">
              {registrations.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-heritage-gold/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-sans font-semibold text-muted-foreground uppercase tracking-wider block">
              Verified Tickets
            </span>
            <span className="font-serif text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {approvedCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/30">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-heritage-gold/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-sans font-semibold text-muted-foreground uppercase tracking-wider block">
              Pending Verification
            </span>
            <span className="font-serif text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
              {pendingCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-heritage-gold/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-sans font-semibold text-muted-foreground uppercase tracking-wider block">
              Action Required
            </span>
            <span className="font-serif text-2xl font-black text-heritage-red mt-1 block">
              {awaitingPaymentCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Required Banner if pending payment */}
      {awaitingPaymentCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div className="text-xs sm:text-sm font-sans">
              <span className="font-bold text-foreground">Action Required:</span> You have{" "}
              {awaitingPaymentCount} registration(s) requiring Paytm UPI payment proof or resubmission.
            </div>
          </div>
          <Link
            href="/dashboard/payments"
            className="w-full sm:w-auto text-center px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shrink-0 transition-colors"
          >
            Submit Payment Proof
          </Link>
        </div>
      )}

      {/* Recent Registrations Table */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              My Festival Registrations
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Status of your registered events and tournaments
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center space-x-1 text-xs font-bold text-heritage-maroon dark:text-heritage-gold hover:underline"
          >
            <span>+ Register for More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Reg No.</th>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    You haven't registered for any events yet.{" "}
                    <Link href="/events" className="text-heritage-gold font-bold underline">
                      Explore Competitions
                    </Link>
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-heritage-sandstone/10">
                    <td className="py-3.5 px-4 font-mono font-bold text-heritage-gold">
                      {reg.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {reg.eventTitle}
                      {reg.teamName && (
                        <span className="block text-[11px] text-muted-foreground font-normal">
                          Team: {reg.teamName}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 capitalize">{reg.participationType}</td>
                    <td className="py-3.5 px-4 font-bold">
                      {reg.amount === 0 ? "Free" : formatCurrency(reg.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {reg.paymentStatus === "approved" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      )}
                      {reg.paymentStatus === "pending_verification" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </span>
                      )}
                      {(reg.paymentStatus === "awaiting_payment" ||
                        reg.paymentStatus === "resubmission_required") && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-destructive/20 text-destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {reg.paymentStatus === "resubmission_required"
                            ? "Resubmit Proof"
                            : "Awaiting Payment"}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {reg.paymentStatus === "approved" ? (
                        <Link
                          href="/dashboard/tickets"
                          className="px-3 py-1 rounded bg-heritage-maroon text-heritage-ivory text-[11px] font-semibold border border-heritage-gold hover:bg-heritage-maroon-dark transition-colors inline-block"
                        >
                          View Ticket
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard/payments"
                          className="px-3 py-1 rounded bg-heritage-gold/20 text-heritage-gold-dark dark:text-heritage-gold-light border border-heritage-gold/40 text-[11px] font-semibold hover:bg-heritage-gold/30 transition-colors inline-block"
                        >
                          Pay / Proof
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
