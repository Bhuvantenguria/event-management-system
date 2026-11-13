"use client";

import React, { useState, useEffect } from "react";
import { dataStore, StoredPaymentSubmission } from "@/lib/data-store";
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
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchUtr, setSearchUtr] = useState<string>("");
  const [selectedProof, setSelectedProof] = useState<any | null>(null);

  // Review modal state
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    paymentId: string;
    action: "approve" | "reject" | "resubmit";
    reason: string;
  }>({ open: false, paymentId: "", action: "approve", reason: "" });

  const loadPayments = () => {
    const all = dataStore.getAllPayments().map((p) => ({
      ...p,
      registration: dataStore.getRegistrationById(p.registrationId),
    }));
    setPayments(all);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleReviewAction = (
    paymentId: string,
    action: "approve" | "reject" | "resubmit"
  ) => {
    if (action === "approve") {
      dataStore.reviewPayment(paymentId, "usr-finance-admin-1", "approve");
      loadPayments();
    } else {
      setReviewModal({
        open: true,
        paymentId,
        action,
        reason: action === "reject" ? "Invalid transaction ID or unverified bank credit." : "Screenshot is blurry; please upload clear receipt.",
      });
    }
  };

  const submitReviewModal = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.reviewPayment(
      reviewModal.paymentId,
      "usr-finance-admin-1",
      reviewModal.action,
      reviewModal.reason
    );
    setReviewModal({ open: false, paymentId: "", action: "approve", reason: "" });
    loadPayments();
  };

  const filteredPayments = payments.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch =
      !searchUtr ||
      p.utrNumber.toLowerCase().includes(searchUtr.toLowerCase()) ||
      p.registration?.registrationNumber?.toLowerCase().includes(searchUtr.toLowerCase()) ||
      p.registration?.userName?.toLowerCase().includes(searchUtr.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalVerifiedRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (p.amountSubmitted || 0), 0);

  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Manual Paytm QR <span className="gold-gradient-text">Verification</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Finance Admin dashboard to verify UPI transaction references (UTR), audit payment
            screenshots, and grant cryptographic tickets.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-sans">
          <div className="p-3 rounded-lg bg-card border border-heritage-gold/30">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">
              Verified Revenue
            </span>
            <span className="font-serif text-base font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalVerifiedRevenue)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-card border border-heritage-gold/30">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">
              Pending Review
            </span>
            <span className="font-serif text-base font-bold text-amber-600 dark:text-amber-400">
              {pendingCount} submissions
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by UTR number, Reg ID, or participant..."
            value={searchUtr}
            onChange={(e) => setSearchUtr(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {["all", "pending", "approved", "rejected", "resubmission_required"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                filter === st
                  ? "bg-heritage-maroon text-heritage-ivory border border-heritage-gold"
                  : "bg-background text-foreground hover:bg-heritage-sandstone/15 border border-border"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Reg No.</th>
                <th className="py-3 px-4">Participant & Event</th>
                <th className="py-3 px-4">UTR / Ref No.</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Screenshot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No payment submissions matching filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-heritage-sandstone/10 font-sans">
                    <td className="py-3.5 px-4 font-mono font-bold text-heritage-gold">
                      {p.registration?.registrationNumber || p.registrationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground">
                        {p.registration?.userName || "Participant"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.registration?.eventTitle}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.registration?.college}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {p.utrNumber}
                      <span className="block text-[10px] text-muted-foreground font-sans">
                        Paid: {p.paymentDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {formatCurrency(p.amountSubmitted)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedProof(p)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-heritage-sandstone/15 hover:bg-heritage-sandstone/30 border border-heritage-gold/30 text-[11px] font-semibold text-foreground"
                      >
                        <Eye className="w-3.5 h-3.5 text-heritage-gold" />
                        <span>Inspect Receipt</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === "approved" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      )}
                      {p.status === "pending" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </span>
                      )}
                      {p.status === "rejected" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/20 text-destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </span>
                      )}
                      {p.status === "resubmission_required" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Resubmission
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === "pending" ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleReviewAction(p.id, "approve")}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                            title="Approve & Generate Digital Ticket"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewAction(p.id, "resubmit")}
                            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold transition-colors"
                            title="Request Resubmission"
                          >
                            Resubmit
                          </button>
                          <button
                            onClick={() => handleReviewAction(p.id, "reject")}
                            className="px-2.5 py-1 rounded bg-destructive hover:opacity-90 text-white text-[11px] font-semibold transition-colors"
                            title="Reject Payment Proof"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2 text-[11px] text-muted-foreground">
                          <span>Reviewed by {p.reviewedBy || "Finance"}</span>
                          <button
                            onClick={() => handleReviewAction(p.id, "approve")}
                            className="text-heritage-gold hover:underline font-semibold"
                          >
                            Re-verify
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Inspection Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-xl w-full border border-heritage-gold p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Payment Proof Screenshot
              </h3>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-sans text-muted-foreground">
              <p>
                <strong className="text-foreground">Participant:</strong>{" "}
                {selectedProof.registration?.userName} ({selectedProof.registration?.userEmail})
              </p>
              <p>
                <strong className="text-foreground">UTR Number:</strong>{" "}
                <span className="font-mono text-heritage-gold font-bold">
                  {selectedProof.utrNumber}
                </span>
              </p>
              <p>
                <strong className="text-foreground">Amount:</strong>{" "}
                {formatCurrency(selectedProof.amountSubmitted)}
              </p>
              {selectedProof.notes && (
                <p>
                  <strong className="text-foreground">Participant Notes:</strong>{" "}
                  {selectedProof.notes}
                </p>
              )}
            </div>

            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden border border-heritage-gold/30 max-h-[380px] bg-black/40 flex items-center justify-center">
              <img
                src={selectedProof.paymentScreenshotUrl}
                alt="Payment Proof Receipt"
                className="w-full h-auto max-h-[380px] object-contain"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
              <button
                onClick={() => setSelectedProof(null)}
                className="px-4 py-1.5 rounded-md border border-border text-xs font-semibold text-foreground hover:bg-muted"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection / Resubmission Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-md w-full border border-heritage-gold p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-foreground capitalize">
              {reviewModal.action === "reject" ? "Reject Payment Proof" : "Request Resubmission"}
            </h3>

            <p className="text-xs text-muted-foreground font-sans">
              Provide an explanatory reason for the participant. This note will appear on their
              dashboard and in their automated notification email.
            </p>

            <form onSubmit={submitReviewModal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Reason / Feedback Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewModal.reason}
                  onChange={(e) =>
                    setReviewModal({ ...reviewModal, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ ...reviewModal, open: false })}
                  className="px-3 py-1.5 rounded-md border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-md text-xs font-bold text-white ${
                    reviewModal.action === "reject"
                      ? "bg-destructive hover:opacity-90"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  Confirm {reviewModal.action === "reject" ? "Rejection" : "Resubmission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
