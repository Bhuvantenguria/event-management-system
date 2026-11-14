"use client";

import React, { useState, useEffect } from "react";
import { dataStore, StoredPaymentSubmission, StoredRegistration } from "@/lib/data-store";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileCheck,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  X,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminPaymentsApprovalPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Filters
  const [activeTab, setActiveTab] = useState<string>("pending"); // default to pending for approval focus
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [searchUtr, setSearchUtr] = useState<string>("");

  // Inspection modal
  const [selectedProof, setSelectedProof] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Review modal (for Reject or Resubmit notes)
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    paymentId: string;
    action: "approve" | "reject" | "resubmit";
    reason: string;
  }>({ open: false, paymentId: "", action: "approve", reason: "" });

  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  const loadData = () => {
    const all = dataStore.getAllPayments().map((p) => ({
      ...p,
      registration: dataStore.getRegistrationById(p.registrationId),
    }));
    setPayments(all);
    setEvents([...dataStore.getAllEvents()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Quick 1-click Approve
  const handleDirectApprove = (paymentId: string, participantName: string) => {
    const success = dataStore.reviewPayment(paymentId, "usr-finance-admin-1", "approve");
    if (success) {
      loadData();
      if (selectedProof?.id === paymentId) {
        setSelectedProof(null);
      }
      setNotification({
        type: "success",
        message: `Payment approved for ${participantName}! Registration is confirmed and digital ticket has been issued.`,
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Open modal for Reject or Resubmit with custom explanation
  const openActionModal = (payment: any, action: "reject" | "resubmit") => {
    setReviewModal({
      open: true,
      paymentId: payment.id,
      action,
      reason:
        action === "reject"
          ? "Unverified bank credit or invalid UTR number."
          : "Screenshot is blurry or incomplete. Please upload official receipt showing 12-digit UTR.",
    });
  };

  const submitActionModal = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.reviewPayment(
      reviewModal.paymentId,
      "usr-finance-admin-1",
      reviewModal.action,
      reviewModal.reason
    );
    setReviewModal({ open: false, paymentId: "", action: "approve", reason: "" });
    if (selectedProof?.id === reviewModal.paymentId) {
      setSelectedProof(null);
    }
    loadData();
    setNotification({
      type: "info",
      message: `Payment status marked as ${reviewModal.action === "reject" ? "Rejected" : "Resubmission Required"}.`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredPayments = payments.filter((p) => {
    // Status tab filter
    const matchesTab = activeTab === "all" || p.status === activeTab;

    // Event filter
    const matchesEvent =
      selectedEventId === "all" ||
      p.registration?.eventId === selectedEventId ||
      p.registration?.eventTitle?.toLowerCase().includes(selectedEventId.toLowerCase());

    // Search query
    const matchesSearch =
      !searchUtr ||
      p.utrNumber.toLowerCase().includes(searchUtr.toLowerCase()) ||
      p.registration?.registrationNumber?.toLowerCase().includes(searchUtr.toLowerCase()) ||
      p.registration?.userName?.toLowerCase().includes(searchUtr.toLowerCase()) ||
      p.registration?.college?.toLowerCase().includes(searchUtr.toLowerCase());

    return matchesTab && matchesEvent && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const approvedCount = payments.filter((p) => p.status === "approved").length;
  const resubmitCount = payments.filter((p) => p.status === "resubmission_required").length;
  const rejectedCount = payments.filter((p) => p.status === "rejected").length;

  const totalVerifiedRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (p.amountSubmitted || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/15 text-fest-sunset text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Finance &amp; Audit Queue (Separated)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Paytm QR <span className="gold-gradient-text">Payment Approvals</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Dedicated queue to audit student payment receipts, verify 12-digit UPI UTR numbers, grant confirmed tickets, or request resubmission.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className="p-3 rounded-2xl bg-card border border-fest-gold/30 shadow-sm text-right">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">
              Verified Revenue
            </span>
            <span className="font-serif text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalVerifiedRevenue)}
            </span>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Primary KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-amber-500/15 border-amber-500 shadow-md ring-2 ring-amber-500/30"
              : "bg-card border-fest-gold/30 hover:border-fest-sunset shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
              Pending Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-serif text-2xl font-black text-amber-600 dark:text-amber-400 block mt-1">
            {pendingCount}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Needs admin verification
          </span>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "approved"
              ? "bg-emerald-500/15 border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
              : "bg-card border-fest-gold/30 hover:border-fest-sunset shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
              Approved
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-serif text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
            {approvedCount}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Tickets generated &amp; issued
          </span>
        </button>

        <button
          onClick={() => setActiveTab("resubmission_required")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "resubmission_required"
              ? "bg-blue-500/15 border-blue-500 shadow-md ring-2 ring-blue-500/30"
              : "bg-card border-fest-gold/30 hover:border-fest-sunset shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
              Resubmission
            </span>
            <AlertTriangle className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-serif text-2xl font-black text-blue-600 dark:text-blue-400 block mt-1">
            {resubmitCount}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Clarification requested
          </span>
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "rejected"
              ? "bg-destructive/15 border-destructive shadow-md ring-2 ring-destructive/30"
              : "bg-card border-fest-gold/30 hover:border-fest-sunset shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-destructive block">
              Rejected
            </span>
            <XCircle className="w-4 h-4 text-destructive" />
          </div>
          <span className="font-serif text-2xl font-black text-destructive block mt-1">
            {rejectedCount}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Invalid / uncredited
          </span>
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-fest-sunset absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by 12-digit UTR, Reg ID, student..."
            value={searchUtr}
            onChange={(e) => setSearchUtr(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
          />
        </div>

        {/* Event Filter & Status Pill */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground font-semibold"
          >
            <option value="all">All Competitions ({payments.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-sm"
                : "bg-background text-foreground hover:bg-fest-champagne/30 border border-border"
            }`}
          >
            All Submissions
          </button>
        </div>
      </div>

      {/* APPROVAL SUBMISSIONS TABLE */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Reg No.</th>
                <th className="py-3 px-4">Participant &amp; Event</th>
                <th className="py-3 px-4">12-Digit UTR Number</th>
                <th className="py-3 px-4">Amount Expected vs Paid</th>
                <th className="py-3 px-4">Receipt Proof</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <FileCheck className="w-8 h-8 mx-auto text-fest-sunset mb-2 opacity-50" />
                    <p className="font-semibold">No payment submissions found matching filter.</p>
                    <p className="text-[11px]">All submissions in this category are fully processed.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const reg = p.registration;
                  const isPending = p.status === "pending";
                  const isApproved = p.status === "approved";
                  const isMismatch = p.amountSubmitted < p.amountExpected;

                  return (
                    <tr key={p.id} className="hover:bg-fest-champagne/20 transition-colors font-sans">
                      {/* Reg No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-fest-sunset">
                        {reg?.registrationNumber || p.registrationId}
                      </td>

                      {/* Participant & Event */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{reg?.userName || "Participant"}</p>
                        <p className="text-[11px] text-fest-gold font-medium">{reg?.eventTitle}</p>
                        <p className="text-[10px] text-muted-foreground">{reg?.college}</p>
                      </td>

                      {/* UTR */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-foreground text-xs">
                            {p.utrNumber}
                          </span>
                          <button
                            onClick={() => handleCopyUtr(p.utrNumber)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground"
                            title="Copy UTR"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground block">
                          Paid on {p.paymentDate}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-bold text-foreground text-sm block">
                          {formatCurrency(p.amountSubmitted)}
                        </span>
                        {isMismatch ? (
                          <span className="text-[10px] text-destructive font-semibold">
                            ⚠️ Expected: {formatCurrency(p.amountExpected)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            Expected: {formatCurrency(p.amountExpected)}
                          </span>
                        )}
                      </td>

                      {/* Receipt Preview */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedProof(p)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-fest-plum/10 hover:bg-fest-plum/20 text-fest-plum dark:text-fest-gold font-semibold text-xs border border-fest-gold/30"
                        >
                          <Eye className="w-3.5 h-3.5 text-fest-sunset" />
                          <span>Inspect Proof</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending Review
                          </span>
                        )}
                        {p.status === "resubmission_required" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Resubmit Asked
                          </span>
                        )}
                        {p.status === "rejected" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-destructive/20 text-destructive border border-destructive/30">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Verification Decision Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleDirectApprove(p.id, reg?.userName || "Participant")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
                              title="Approve payment & issue ticket"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => openActionModal(p, "resubmit")}
                              className="px-2.5 py-1.5 rounded-xl border border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 text-xs font-semibold"
                              title="Request clearer screenshot or corrected UTR"
                            >
                              Resubmit
                            </button>
                            <button
                              onClick={() => openActionModal(p, "reject")}
                              className="px-2.5 py-1.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-semibold"
                              title="Reject submission"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            Processed ({p.reviewedBy ? `by ${p.reviewedBy}` : "verified"})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT RECEIPT PROOF MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl max-w-2xl w-full border-2 border-fest-gold/60 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-fest-sunset font-mono">
                  {selectedProof.registration?.registrationNumber || selectedProof.registrationId}
                </span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Audit Payment Receipt Proof
                </h3>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs font-sans">
              {/* Receipt Image Display */}
              <div className="space-y-2">
                <span className="font-bold block text-foreground">
                  Uploaded Payment Screenshot
                </span>
                <div className="rounded-2xl overflow-hidden border-2 border-fest-gold/40 bg-black max-h-80 flex items-center justify-center group relative">
                  <img
                    src={selectedProof.paymentScreenshotUrl}
                    alt="Payment receipt proof"
                    className="max-h-80 w-auto object-contain"
                  />
                  <a
                    href={selectedProof.paymentScreenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/70 text-white text-[10px] font-bold flex items-center space-x-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Full Size</span>
                  </a>
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-fest-champagne/20 dark:bg-fest-charcoal border border-border space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      12-Digit UTR / Transaction Reference
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="font-mono font-bold text-sm text-foreground">
                        {selectedProof.utrNumber}
                      </span>
                      <button
                        onClick={() => handleCopyUtr(selectedProof.utrNumber)}
                        className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-semibold text-fest-sunset flex items-center space-x-1"
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Amount Paid
                      </span>
                      <span className="font-serif font-black text-base text-fest-burgundy dark:text-fest-gold">
                        {formatCurrency(selectedProof.amountSubmitted)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Amount Expected
                      </span>
                      <span className="font-serif font-black text-base text-foreground">
                        {formatCurrency(selectedProof.amountExpected)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Participant Details */}
                <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Participant &amp; Event
                  </span>
                  <p className="font-bold text-foreground">
                    {selectedProof.registration?.userName || "Participant"}
                  </p>
                  <p className="text-fest-sunset font-semibold">
                    {selectedProof.registration?.eventTitle}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedProof.registration?.college} • {selectedProof.registration?.userEmail}
                  </p>
                  {selectedProof.notes && (
                    <p className="pt-2 text-[11px] text-foreground italic border-t border-border/60">
                      Note from student: "{selectedProof.notes}"
                    </p>
                  )}
                </div>

                {/* Status Callout if Reviewed */}
                {selectedProof.status !== "pending" && (
                  <div className="p-3 rounded-xl bg-card border border-border">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Audit Decision
                    </span>
                    <span className="font-bold capitalize text-foreground">
                      Status: {selectedProof.status.replace("_", " ")}
                    </span>
                    {selectedProof.rejectionReason && (
                      <p className="text-[11px] text-destructive mt-1">
                        Reason: {selectedProof.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Approval Decision Controls */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs font-semibold"
              >
                Close
              </button>

              {selectedProof.status === "pending" && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openActionModal(selectedProof, "reject")}
                    className="px-3.5 py-2 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-bold"
                  >
                    Reject Payment
                  </button>
                  <button
                    onClick={() => openActionModal(selectedProof, "resubmit")}
                    className="px-3.5 py-2 rounded-xl border border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 text-xs font-bold"
                  >
                    Request Resubmission
                  </button>
                  <button
                    onClick={() =>
                      handleDirectApprove(
                        selectedProof.id,
                        selectedProof.registration?.userName || "Participant"
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve &amp; Issue Ticket</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT / RESUBMIT REASON MODAL */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl max-w-md w-full border-2 border-fest-gold/60 p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-foreground">
              {reviewModal.action === "reject"
                ? "Confirm Payment Rejection"
                : "Request Payment Resubmission"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {reviewModal.action === "reject"
                ? "State the reason why this payment submission cannot be validated. This will cancel the registration."
                : "Provide specific feedback so the participant can upload a clearer screenshot or correct UTR."}
            </p>

            <form onSubmit={submitActionModal} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-bold block mb-1 text-foreground">
                  Reason / Feedback Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewModal.reason}
                  onChange={(e) => setReviewModal({ ...reviewModal, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setReviewModal({ ...reviewModal, open: false })}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-md ${
                    reviewModal.action === "reject"
                      ? "bg-destructive hover:brightness-110"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {reviewModal.action === "reject"
                    ? "Confirm Rejection"
                    : "Send Resubmission Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
