"use client";

import React, { useState } from "react";
import { dataStore } from "@/lib/data-store";
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AttendanceReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const tickets = dataStore.getAllTickets();

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.participantName.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.college.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "checked_in" && t.isScanned) ||
      (statusFilter === "pending" && !t.isScanned);

    return matchesSearch && matchesStatus;
  });

  const checkedInCount = tickets.filter((t) => t.isScanned).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Attendance & <span className="gold-gradient-text">Turnstile Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time gate ingress records, attendance verification logs, and turnstile statistics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-card border border-heritage-gold/30 text-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Checked In
            </span>
            <span className="font-serif text-base font-bold text-emerald-600 dark:text-emerald-400">
              {checkedInCount} / {tickets.length} Attendees
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-md bg-card border border-heritage-gold/40 text-foreground text-xs font-semibold hover:bg-heritage-sandstone/15 flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Export / Print</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search attendee, ticket ID, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          {["all", "checked_in", "pending"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? "bg-heritage-maroon text-heritage-ivory border border-heritage-gold"
                  : "bg-background text-foreground hover:bg-heritage-sandstone/15 border border-border"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Ticket No.</th>
                <th className="py-3 px-4">Attendee</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4 text-right">Check-in Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No attendee records found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-heritage-sandstone/10">
                    <td className="py-3 px-4 font-mono font-bold text-heritage-gold">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      {t.participantName}
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        {t.participantEmail}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{t.college}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {t.eventTitle}
                    </td>
                    <td className="py-3 px-4">
                      {t.isScanned ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3 mr-1" />
                          Not Checked In
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-muted-foreground">
                      {t.scannedAt
                        ? new Date(t.scannedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "—"}
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
