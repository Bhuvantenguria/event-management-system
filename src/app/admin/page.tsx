"use client";

import React from "react";
import Link from "next/link";
import { dataStore } from "@/lib/data-store";
import {
  Users,
  CalendarCheck,
  CreditCard,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Landmark,
  ArrowRight,
  ShieldCheck,
  ScanLine,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverviewDashboard() {
  const users = dataStore.getAllUsers();
  const registrations = dataStore.getAllRegistrations();
  const payments = dataStore.getAllPayments();
  const tickets = dataStore.getAllTickets();

  const totalParticipants = users.filter((u) => u.role === "participant").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const approvedPayments = payments.filter((p) => p.status === "approved").length;
  const rejectedPayments = payments.filter((p) => p.status === "rejected").length;
  const totalCheckIns = tickets.filter((t) => t.isScanned).length;

  const totalRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (p.amountSubmitted || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-heritage-maroon-dark via-heritage-charcoal to-heritage-maroon text-heritage-ivory p-6 sm:p-8 border-2 border-heritage-gold/40 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 jaali-bg opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-heritage-gold/20 text-heritage-gold-light text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Festival Administrative Oversight</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-heritage-ivory">
            Executive <span className="gold-gradient-text">Festival Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-heritage-sandstone max-w-xl">
            Live overview of participant onboarding, Paytm UPI financial verifications, turnstile
            attendance, and dynamic website content.
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Participants
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {totalParticipants}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">Registered</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Registrations
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {registrations.length}
          </span>
          <span className="text-[10px] text-heritage-gold font-semibold block">All Events</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Pending UPI
          </span>
          <span className="font-serif text-2xl font-black text-amber-600 dark:text-amber-400">
            {pendingPayments}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold block">Awaiting Review</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Approved Pay
          </span>
          <span className="font-serif text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {approvedPayments}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">Tickets Issued</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Gate Check-Ins
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {totalCheckIns}
          </span>
          <span className="text-[10px] text-heritage-gold font-semibold block">Scanned Passes</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Collections
          </span>
          <span className="font-serif text-xl font-black text-heritage-maroon dark:text-heritage-gold">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold block">Verified</span>
        </div>
      </div>

      {/* Fast Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/payments"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Verify Paytm UPI Proofs
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {pendingPayments} submissions awaiting audit
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/scanner"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Gate QR Turnstile Scanner
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Live camera check-in
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/events"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Events & Schedule CMS
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Manage competitions & venues
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
