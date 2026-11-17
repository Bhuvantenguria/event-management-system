"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dataStore } from "@/lib/data-store";
import {
  Users,
  Calendar,
  CreditCard,
  Image as ImageIcon,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverviewDashboard() {
  const [stats, setStats] = useState({
    totalEvents: dataStore.getAllEvents().length,
    totalRegistrations: dataStore.getAllRegistrations().length,
    pendingPayments: dataStore.getAllPayments().filter((p) => p.status === "pending").length,
    approvedPayments: dataStore.getAllPayments().filter((p) => p.status === "approved").length,
    totalRevenue: dataStore
      .getAllPayments()
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + (p.amountSubmitted || 0), 0),
    galleryCount: dataStore.getAllGalleryItems().length,
  });

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const {
    totalEvents,
    totalRegistrations,
    pendingPayments,
    approvedPayments,
    totalRevenue,
    galleryCount,
  } = stats;

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
            Admin <span className="gold-gradient-text">Command Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-heritage-sandstone max-w-xl">
            Streamlined controls to create events with multiple pictures, manage gallery media CRUD,
            update the organizer Paytm QR code, filter registrations by event, and approve payments.
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Events Hosted
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {totalEvents}
          </span>
          <span className="text-[10px] text-heritage-gold font-semibold block">Active &amp; Open</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Registrations
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {totalRegistrations}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">All Events</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Pending UPI
          </span>
          <span className="font-serif text-2xl font-black text-amber-600 dark:text-amber-400">
            {pendingPayments}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold block">Needs Approval</span>
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
            Gallery Media
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {galleryCount}
          </span>
          <span className="text-[10px] text-heritage-gold font-semibold block">Items Curated</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-heritage-gold/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Verified Collections
          </span>
          <span className="font-serif text-xl font-black text-heritage-maroon dark:text-heritage-gold">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold block">Paytm UPI</span>
        </div>
      </div>

      {/* Fast Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/events"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Create &amp; Manage Events
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Upload multiple pics &amp; edit details
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/registrations"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Registrations by Event Filter
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Inspect teams &amp; rosters per contest
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>

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
                Separated Payment Approvals
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {pendingPayments} submissions awaiting review
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/gallery"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Gallery Media (Full CRUD)
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Create, update &amp; delete festival photos
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 rounded-2xl bg-card border border-heritage-gold/40 hover:border-heritage-gold shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-heritage-maroon/10 text-heritage-maroon dark:text-heritage-gold flex items-center justify-center border border-heritage-gold/30 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground">
                Organizer Paytm QR Settings
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Update UPI QR image &amp; beneficiary ID
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-heritage-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
