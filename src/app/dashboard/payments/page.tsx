"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { dataStore } from "@/lib/data-store";
import {
  CreditCard,
  QrCode,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  Eye,
  Loader2,
  ImageIcon,
  X,
  CloudUpload,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ParticipantPaymentsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "usr-student-1";

  const registrations = dataStore.getRegistrationsByUser(userId);
  const qrSettings = dataStore.getQrSettings();

  const [selectedRegId, setSelectedRegId] = useState<string>(
    registrations.find((r) => r.paymentStatus !== "approved")?.id || registrations[0]?.id || ""
  );

  const [amountSubmitted, setAmountSubmitted] = useState<number>(0);
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isUsingCustomUrl, setIsUsingCustomUrl] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image file size must be less than 8MB.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "rangmanch26/payments");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setScreenshotUrl(data.url);
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      setUploadError(err?.message || "Screenshot upload failed. Please try again or paste a link.");
    } finally {
      setIsUploading(false);
    }
  };

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedReg = registrations.find((r) => r.id === selectedRegId);
  const currentSubmission = selectedReg ? dataStore.getPaymentByRegistrationId(selectedReg.id) : undefined;

  const handleSelectReg = (regId: string) => {
    setSelectedRegId(regId);
    const reg = registrations.find((r) => r.id === regId);
    if (reg) {
      setAmountSubmitted(reg.amount);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!selectedReg) {
      setStatusMessage({ type: "error", text: "Please select an event registration." });
      return;
    }

    if (!utrNumber || utrNumber.trim().length < 8) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid 12-digit UPI Reference / UTR Number.",
      });
      return;
    }

    const img =
      screenshotUrl.trim() ||
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop";

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: selectedReg.id,
          amountSubmitted: amountSubmitted || selectedReg.amount,
          utrNumber: utrNumber.trim(),
          paymentScreenshotUrl: img,
          paymentDate,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payment proof.");
      }

      // Sync local cache
      dataStore.submitPaymentProof({
        registrationId: selectedReg.id,
        amountExpected: selectedReg.amount,
        amountSubmitted: amountSubmitted || selectedReg.amount,
        utrNumber: utrNumber.trim(),
        paymentScreenshotUrl: img,
        paymentDate,
        notes,
      });

      setStatusMessage({
        type: "success",
        text: "Payment proof submitted successfully! Stored in MongoDB & Cloudinary for administrative verification.",
      });

      // Reset inputs
      setUtrNumber("");
      setNotes("");
    } catch (err: any) {
      // Fallback in case of offline dev without API server running
      const isUnique = dataStore.isUtrUnique(utrNumber, currentSubmission?.id);
      if (!isUnique) {
        setStatusMessage({
          type: "error",
          text: "This UTR number has already been submitted for another registration. Duplicate transactions are not allowed.",
        });
        setIsSubmitting(false);
        return;
      }

      dataStore.submitPaymentProof({
        registrationId: selectedReg.id,
        amountExpected: selectedReg.amount,
        amountSubmitted: amountSubmitted || selectedReg.amount,
        utrNumber: utrNumber.trim(),
        paymentScreenshotUrl: img,
        paymentDate,
        notes,
      });

      setStatusMessage({
        type: "success",
        text: "Payment proof recorded locally for verification.",
      });
      setUtrNumber("");
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
          Manual Paytm QR <span className="gold-gradient-text">Payment Verification</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-sans">
          No payment gateways. Scan the official festival Paytm UPI QR code, complete payment,
          and upload proof with your 12-digit UTR number for manual administrative verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Paytm QR Code Instructions */}
        <div className="lg:col-span-5 bg-card rounded-2xl border-2 border-heritage-gold p-6 shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-heritage-gold-dark dark:text-heritage-gold block">
              Official Festival UPI Account
            </span>
            <h3 className="font-serif text-xl font-bold text-foreground">
              {qrSettings.upiName}
            </h3>
            <p className="font-mono text-xs font-semibold text-heritage-maroon dark:text-heritage-gold bg-heritage-sandstone/15 py-1 px-3 rounded-full inline-block">
              {qrSettings.upiId}
            </p>
          </div>

          {/* QR Image Display */}
          <div className="p-4 rounded-xl bg-white max-w-[240px] mx-auto border-2 border-heritage-gold/50 shadow-md">
            <img
              src={qrSettings.qrImageUrl}
              alt="Festival Paytm QR Code"
              className="w-full h-auto object-contain rounded"
            />
          </div>

          <div className="p-4 rounded-xl bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/30 text-left text-xs space-y-2 text-foreground font-sans">
            <span className="font-bold block text-foreground">Payment Instructions:</span>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {qrSettings.paymentInstructions}
            </p>
          </div>
        </div>

        {/* Right Column: Submit Payment Proof Form */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-heritage-gold/30 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
              <Upload className="w-5 h-5 mr-2 text-heritage-gold" />
              Submit / Resubmit Payment Proof
            </h2>
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-start space-x-2 font-sans ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border border-destructive/30 text-destructive"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmitProof} className="space-y-4">
            {/* Select Registration Dropdown */}
            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Select Event Registration *
              </label>
              <select
                value={selectedRegId}
                onChange={(e) => handleSelectReg(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
              >
                {registrations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.eventTitle} ({r.registrationNumber}) – {formatCurrency(r.amount)} [
                    {r.paymentStatus.replace("_", " ").toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            {selectedReg && (
              <div className="p-3.5 rounded-lg bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20 text-xs flex justify-between items-center font-sans">
                <div>
                  <span className="text-muted-foreground block">Registration Ref:</span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedReg.registrationNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block">Expected Amount:</span>
                  <span className="font-serif font-black text-sm text-heritage-maroon dark:text-heritage-gold">
                    {formatCurrency(selectedReg.amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Review feedback if rejected or resubmit */}
            {currentSubmission?.status === "resubmission_required" && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs text-amber-600 dark:text-amber-400 font-sans space-y-1">
                <span className="font-bold flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Finance Admin Feedback (Resubmission Requested):
                </span>
                <p>{currentSubmission.rejectionReason}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  12-Digit UTR / Transaction Ref No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 407512889912"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Amount Transferred (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={amountSubmitted || selectedReg?.amount || 0}
                  onChange={(e) => setAmountSubmitted(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
              />
            </div>

            {/* Cloudinary Image Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground font-sans block">
                  Payment Receipt Screenshot *
                </label>
                <button
                  type="button"
                  onClick={() => setIsUsingCustomUrl(!isUsingCustomUrl)}
                  className="text-[11px] text-muted-foreground hover:text-heritage-gold transition-colors underline"
                >
                  {isUsingCustomUrl ? "Upload File via Cloudinary" : "Or enter direct Image URL"}
                </button>
              </div>

              {uploadError && (
                <p className="text-xs text-red-500 font-sans">{uploadError}</p>
              )}

              {isUsingCustomUrl ? (
                <input
                  type="text"
                  placeholder="Paste direct Cloudinary or image link (e.g. https://res.cloudinary.com/...)"
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              ) : (
                <div className="space-y-3">
                  {screenshotUrl ? (
                    <div className="relative p-3 rounded-xl border border-heritage-gold/40 bg-card/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={screenshotUrl}
                          alt="Uploaded Receipt"
                          className="w-16 h-16 rounded-lg object-cover border border-border"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Screenshot Ready</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-xs font-mono">
                            {screenshotUrl.includes("cloudinary.com") ? "Stored on Cloudinary CDN" : "Uploaded Image Proof"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl("")}
                        className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-heritage-gold/60 rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors group">
                      <div className="flex flex-col items-center text-center space-y-2">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-8 h-8 text-heritage-gold animate-spin" />
                            <span className="text-xs font-semibold text-foreground">
                              Uploading to Cloudinary...
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Optimizing receipt image & generating secure URL
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="p-3 rounded-full bg-heritage-gold/10 text-heritage-gold group-hover:scale-110 transition-transform">
                              <CloudUpload className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-foreground block">
                                Click or drag Paytm transaction screenshot
                              </span>
                              <span className="text-[11px] text-muted-foreground block mt-0.5">
                                PNG, JPG, WEBP up to 8MB • Uploads directly to Cloudinary
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Sender UPI account name, bank details, or remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-heritage-gold animate-spin" />
                  <span>Submitting Payment Proof...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-heritage-gold" />
                  <span>Submit Payment Proof for Verification</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
