"use client";

import React, { useState, useEffect } from "react";
import { dataStore, StoredRegistration, StoredEvent } from "@/lib/data-store";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  AlertTriangle,
  Sparkles,
  Eye,
  X,
  CreditCard,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<StoredRegistration[]>([]);
  const [events, setEvents] = useState<StoredEvent[]>([]);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Inspect Modal
  const [selectedReg, setSelectedReg] = useState<StoredRegistration | null>(null);

  const loadData = () => {
    setRegistrations([...dataStore.getAllRegistrations()]);
    setEvents([...dataStore.getAllEvents()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = registrations.filter((r) => {
    // Event Filter
    const matchesEvent =
      selectedEventId === "all" ||
      r.eventId === selectedEventId ||
      r.eventTitle.toLowerCase().includes(selectedEventId.toLowerCase());

    // Status Filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && (r.paymentStatus === "approved" || r.registrationStatus === "confirmed")) ||
      (statusFilter === "pending_verification" && r.paymentStatus === "pending_verification") ||
      (statusFilter === "awaiting_payment" && (r.paymentStatus === "awaiting_payment" || r.amount === 0));

    // Format Filter
    const matchesFormat =
      formatFilter === "all" || r.participationType === formatFilter;

    // Search Filter
    const matchesSearch =
      !search ||
      r.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.college.toLowerCase().includes(search.toLowerCase()) ||
      (r.teamName && r.teamName.toLowerCase().includes(search.toLowerCase()));

    return matchesEvent && matchesStatus && matchesFormat && matchesSearch;
  });

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      "Registration ID",
      "Event Title",
      "Participant Name",
      "Email",
      "College",
      "Format",
      "Team Name",
      "Amount",
      "Payment Status",
      "Registration Status",
      "Registered Date",
    ];

    const rows = filtered.map((r) => [
      r.registrationNumber,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.userName.replace(/"/g, '""')}"`,
      r.userEmail,
      `"${r.college.replace(/"/g, '""')}"`,
      r.participationType,
      `"${(r.teamName || "").replace(/"/g, '""')}"`,
      r.amount,
      r.paymentStatus,
      r.registrationStatus,
      formatDate(r.createdAt),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `registrations-${selectedEventId}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFilteredAmount = filtered.reduce((sum, r) => sum + (r.amount || 0), 0);
  const confirmedCount = filtered.filter(
    (r) => r.paymentStatus === "approved" || r.registrationStatus === "confirmed"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/15 text-fest-sunset text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Event Registration Roster &amp; Delegation Control</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Registrations <span className="gold-gradient-text">by Event Filter</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Filter participant rosters by specific competition, inspect team members, track fee statuses, and export event rosters.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-card border border-fest-gold/40 text-foreground text-xs font-bold hover:bg-fest-champagne/30 flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-fest-sunset" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-semibold hover:bg-muted flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Filtered Registrations
          </span>
          <span className="font-serif text-2xl font-black text-foreground">
            {filtered.length}
          </span>
          <span className="text-[10px] text-fest-gold block font-semibold">
            {selectedEventId === "all" ? "Across All Events" : "In Selected Event"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Confirmed Delegates
          </span>
          <span className="font-serif text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {confirmedCount}
          </span>
          <span className="text-[10px] text-emerald-600 block font-semibold">
            Tickets Issued
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Pending Verification
          </span>
          <span className="font-serif text-2xl font-black text-amber-600 dark:text-amber-400">
            {filtered.filter((r) => r.paymentStatus === "pending_verification").length}
          </span>
          <span className="text-[10px] text-amber-600 block font-semibold">
            Awaiting Approval
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Roster Value
          </span>
          <span className="font-serif text-xl font-black text-fest-burgundy dark:text-fest-gold">
            {formatCurrency(totalFilteredAmount)}
          </span>
          <span className="text-[10px] text-muted-foreground block font-semibold">
            Event Registrations
          </span>
        </div>
      </div>

      {/* PRIMARY FILTER BAR WITH DEDICATED EVENT SELECTOR */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* 1. DEDICATED EVENT FILTER DROPDOWN */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Filter by Event / Competition *
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-background border border-fest-gold/50 text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-fest-sunset"
            >
              <option value="all">🌟 All Events ({registrations.length} Total Registrations)</option>
              {events.map((ev) => {
                const count = registrations.filter((r) => r.eventId === ev.id).length;
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({count} {count === 1 ? "reg" : "regs"})
                  </option>
                );
              })}
            </select>
          </div>

          {/* 2. SEARCH INPUT */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Search Participant or Team
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-fest-sunset absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, college, email, reg ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
              />
            </div>
          </div>

          {/* 3. FORMAT SELECTOR */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-[11px] font-bold text-foreground block">Participation Format</label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-medium"
            >
              <option value="all">All Formats (Individual &amp; Team)</option>
              <option value="individual">Individual Only</option>
              <option value="team">Team Only</option>
            </select>
          </div>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 scrollbar-none border-t border-border/60 pt-3">
          <span className="text-[11px] font-bold text-muted-foreground mr-1">Status:</span>
          {[
            { id: "all", label: "All Statuses" },
            { id: "approved", label: "Confirmed / Approved" },
            { id: "pending_verification", label: "Pending Verification" },
            { id: "awaiting_payment", label: "Awaiting Payment" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-sm"
                  : "bg-background text-foreground hover:bg-fest-champagne/30 border border-border"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">Participant &amp; College</th>
                <th className="py-3 px-4">Event Selected</th>
                <th className="py-3 px-4">Format &amp; Team</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto text-fest-sunset mb-2 opacity-50" />
                    <p className="font-semibold">No registrations match the selected event and filters.</p>
                    <p className="text-[11px]">Try switching event to "All Events" or clearing search query.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-fest-champagne/20 transition-colors font-sans">
                    {/* Reg ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-fest-sunset">
                      {r.registrationNumber}
                    </td>

                    {/* Participant & College */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground">{r.userName}</p>
                      <p className="text-[11px] text-muted-foreground">{r.college}</p>
                      <p className="text-[10px] text-muted-foreground">{r.userEmail}</p>
                    </td>

                    {/* Event */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground">{r.eventTitle}</p>
                      <span className="text-[10px] text-fest-gold font-medium">
                        ID: {r.eventId}
                      </span>
                    </td>

                    {/* Format & Team */}
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-foreground block">
                        {r.participationType}
                      </span>
                      {r.teamName && (
                        <span className="text-[10px] text-fest-sunset font-medium block">
                          Team: {r.teamName} ({r.teamMembers?.length || 1} members)
                        </span>
                      )}
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-4 font-serif font-bold text-foreground">
                      {r.amount === 0 ? "Free Entry" : formatCurrency(r.amount)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {r.paymentStatus === "approved" || r.registrationStatus === "confirmed" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Confirmed
                        </span>
                      ) : r.paymentStatus === "pending_verification" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          Reviewing UPI
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-destructive/20 text-destructive border border-destructive/30">
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Action: Inspect Details */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-fest-gold/40 hover:bg-fest-sunset/15 text-fest-sunset text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Inspection Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl max-w-lg w-full border-2 border-fest-gold/60 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-fest-sunset font-mono">
                  {selectedReg.registrationNumber}
                </span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Registration Breakdown
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {/* Event Details */}
              <div className="p-3.5 rounded-xl bg-fest-champagne/20 dark:bg-fest-charcoal border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Registered Competition
                </span>
                <h4 className="font-serif text-sm font-bold text-foreground">
                  {selectedReg.eventTitle}
                </h4>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-muted-foreground">Participation Format:</span>
                  <span className="font-bold uppercase text-foreground">{selectedReg.participationType}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Fee Required:</span>
                  <span className="font-bold text-fest-burgundy dark:text-fest-gold font-serif">
                    {selectedReg.amount === 0 ? "Free Entry" : formatCurrency(selectedReg.amount)}
                  </span>
                </div>
              </div>

              {/* Participant Info */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Primary Participant
                </span>
                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <p className="font-bold text-foreground">{selectedReg.userName}</p>
                  <p className="text-muted-foreground">{selectedReg.userEmail}</p>
                  <p className="text-fest-sunset font-medium">{selectedReg.college}</p>
                </div>
              </div>

              {/* Team Members if Team */}
              {selectedReg.teamName && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Team Roster: {selectedReg.teamName}
                    </span>
                    <span className="text-[10px] text-fest-gold font-semibold">
                      {selectedReg.teamMembers?.length || 1} Registered Members
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border space-y-2 max-h-40 overflow-y-auto">
                    {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 ? (
                      selectedReg.teamMembers.map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
                          <div>
                            <span className="font-semibold text-foreground">{m.name}</span>
                            {m.isCaptain && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-fest-sunset/15 text-fest-sunset text-[9px] font-bold">
                                Captain
                              </span>
                            )}
                            <span className="block text-[10px] text-muted-foreground">{m.email}</span>
                          </div>
                          {m.phone && (
                            <span className="text-[10px] text-muted-foreground">{m.phone}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-[11px]">No extra team members listed.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Status & QR Token */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Payment Status
                  </span>
                  <span className="font-bold text-foreground capitalize mt-0.5 block">
                    {selectedReg.paymentStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Digital Ticket Token
                  </span>
                  <span className="font-mono text-[10px] text-fest-sunset truncate block mt-0.5 font-bold">
                    {selectedReg.qrToken}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2 rounded-xl bg-fest-plum text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
