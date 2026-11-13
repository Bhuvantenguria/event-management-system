"use client";

import React, { useState } from "react";
import { dataStore } from "@/lib/data-store";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminRegistrationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const registrations = dataStore.getAllRegistrations();

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      !search ||
      r.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.college.toLowerCase().includes(search.toLowerCase()) ||
      (r.teamName && r.teamName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || r.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Participant <span className="gold-gradient-text">Registrations</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Inspect all festival event registrations, team rosters, and payment statuses
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-md bg-card border border-heritage-gold/40 text-foreground text-xs font-semibold hover:bg-heritage-sandstone/15 flex items-center space-x-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-heritage-gold" />
          <span>Export Roster</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search participant, team, event, reg ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {["all", "approved", "pending_verification", "awaiting_payment"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-heritage-maroon text-heritage-ivory border border-heritage-gold"
                  : "bg-background text-foreground hover:bg-heritage-sandstone/15 border border-border"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">Participant & College</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-heritage-sandstone/10">
                  <td className="py-3 px-4 font-mono font-bold text-heritage-gold">
                    {r.registrationNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    {r.userName}
                    <span className="block text-[10px] text-muted-foreground font-normal">
                      {r.college} • {r.userEmail}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground">
                    {r.eventTitle}
                    {r.teamName && (
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        Team: {r.teamName} ({r.teamMembers?.length || 1} members)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 capitalize">{r.participationType}</td>
                  <td className="py-3 px-4 font-bold">
                    {r.amount === 0 ? "Free" : formatCurrency(r.amount)}
                  </td>
                  <td className="py-3 px-4">
                    {r.paymentStatus === "approved" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        Approved
                      </span>
                    ) : r.paymentStatus === "pending_verification" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        Reviewing Proof
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/20 text-destructive">
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground font-mono">
                    {formatDate(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
