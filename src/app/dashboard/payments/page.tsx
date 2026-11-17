"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { dataStore, StoredRegistration, StoredEvent } from "@/lib/data-store";
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
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

function PaymentsContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const queryRegId = searchParams.get("regId");
  const queryEventSlug = searchParams.get("event");

  const [registrations, setRegistrations] = useState<StoredRegistration[]>([]);
  const [availableEvents, setAvailableEvents] = useState<StoredEvent[]>([]);
  const [qrSettings, setQrSettings] = useState({
    upiId: "festpay@ptaxis",
    upiName: "Parampara Fest Committee",
    qrImageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    paymentInstructions: "1. Scan using Paytm / PhonePe / GPay.\n2. Note down the 12-digit UTR/Ref No.\n3. Take a screenshot.\n4. Upload below with the UTR.",
    isEnabled: true,
  });

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [selectedItemKey, setSelectedItemKey] = useState<string>("");

  const [teamName, setTeamName] = useState<string>("");
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

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch real-time registrations, QR settings, and available events
  const loadInitialData = async () => {
    setIsLoadingData(true);
    try {
      const [regsRes, qrRes, eventsRes] = await Promise.allSettled([
        fetch("/api/user/registrations", { cache: "no-store" }),
        fetch("/api/qr-settings", { cache: "no-store" }),
        fetch("/api/events", { cache: "no-store" }),
      ]);

      let userRegs: StoredRegistration[] = [];
      if (regsRes.status === "fulfilled" && regsRes.value.ok) {
        const data = await regsRes.value.json();
        if (data.registrations && Array.isArray(data.registrations)) {
          userRegs = data.registrations;
          setRegistrations(userRegs);
        }
      } else {
        const userId = (session?.user as any)?.id || session?.user?.email || "";
        userRegs = dataStore.getRegistrationsByUser(userId);
        setRegistrations(userRegs);
      }

      if (qrRes.status === "fulfilled" && qrRes.value.ok) {
        const data = await qrRes.value.json();
        if (data.qrSettings) {
          setQrSettings(data.qrSettings);
        }
      } else {
        setQrSettings(dataStore.getQrSettings());
      }

      let evList: StoredEvent[] = [];
      if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
        const data = await eventsRes.value.json();
        if (data.events && Array.isArray(data.events)) {
          evList = data.events;
          setAvailableEvents(evList);
        }
      } else {
        evList = dataStore.getAllEvents();
        setAvailableEvents(evList);
      }

      // Automatically select appropriate key:
      if (queryRegId && userRegs.some((r) => r.id === queryRegId)) {
        setSelectedItemKey(queryRegId);
        const match = userRegs.find((r) => r.id === queryRegId);
        if (match) setAmountSubmitted(match.amount);
      } else if (queryEventSlug && evList.some((e) => e.slug === queryEventSlug || e.id === queryEventSlug)) {
        const matchEv = evList.find((e) => e.slug === queryEventSlug || e.id === queryEventSlug);
        if (matchEv) {
          setSelectedItemKey(`event:${matchEv.slug || matchEv.id}`);
          setAmountSubmitted(matchEv.registrationFee);
        }
      } else {
        const pending = userRegs.find((r) => r.paymentStatus !== "approved");
        if (pending) {
          setSelectedItemKey(pending.id);
          setAmountSubmitted(pending.amount);
        } else if (userRegs.length > 0) {
          setSelectedItemKey(userRegs[0].id);
          setAmountSubmitted(userRegs[0].amount);
        } else if (evList.length > 0) {
          setSelectedItemKey(`event:${evList[0].slug || evList[0].id}`);
          setAmountSubmitted(evList[0].registrationFee);
        }
      }
    } catch (err) {
      console.error("Failed to load payments data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [session]);

  const isSelectedEventDirect = selectedItemKey.startsWith("event:");
  const selectedEventSlug = isSelectedEventDirect
    ? selectedItemKey.replace(/^event:/, "")
    : "";
  const selectedDirectEvent = isSelectedEventDirect
    ? availableEvents.find((e) => e.slug === selectedEventSlug || e.id === selectedEventSlug)
    : undefined;

  const selectedReg = !isSelectedEventDirect
    ? registrations.find((r) => r.id === selectedItemKey)
    : undefined;

  const currentSubmission = selectedReg
    ? dataStore.getPaymentByRegistrationId(selectedReg.id)
    : undefined;

  const handleSelectOption = (key: string) => {
    setSelectedItemKey(key);
    if (key.startsWith("event:")) {
      const slug = key.replace(/^event:/, "");
      const ev = availableEvents.find((e) => e.slug === slug || e.id === slug);
      if (ev) {
        setAmountSubmitted(ev.registrationFee);
      }
    } else {
      const reg = registrations.find((r) => r.id === key);
      if (reg) {
        setAmountSubmitted(reg.amount);
      }
    }
  };

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
      formData.append("folder", "affinity_aiims/payments");

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
      // Fallback preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setScreenshotUrl(reader.result);
        }
      };
      setUploadError(err?.message || "Cloud upload note: Using local preview image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!selectedItemKey) {
      setStatusMessage({
        type: "error",
        text: "Please select an event or registration to link this payment to.",
      });
      return;
    }

    if (!utrNumber || utrNumber.trim().length < 6) {
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
      const payload: any = {
        amountSubmitted: Number(amountSubmitted) || (selectedReg ? selectedReg.amount : (selectedDirectEvent?.registrationFee || 0)),
        utrNumber: utrNumber.trim(),
        paymentScreenshotUrl: img,
        paymentDate,
        notes,
      };

      if (isSelectedEventDirect && selectedDirectEvent) {
        payload.eventId = selectedDirectEvent.id;
        payload.eventSlug = selectedDirectEvent.slug;
        payload.eventTitle = selectedDirectEvent.title;
        payload.participationType = teamName.trim() ? "team" : "individual";
        payload.teamName = teamName.trim() || undefined;
      } else if (selectedReg) {
        payload.registrationId = selectedReg.id;
      }

      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payment proof.");
      }

      setStatusMessage({
        type: "success",
        text: "Payment proof and registration submitted successfully! Our administrative team will verify your payment shortly.",
      });

      // Clear input fields
      setUtrNumber("");
      setNotes("");
      setTeamName("");

      // Reload fresh registrations and select the latest one
      await loadInitialData();
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to submit payment proof. Please verify and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const expectedFee = selectedReg
    ? selectedReg.amount
    : selectedDirectEvent
    ? selectedDirectEvent.registrationFee
    : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full max-w-full overflow-x-hidden font-sans">
      <div className="border-b border-border pb-4">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-fest-sunset block mb-1">
          Festival Payment Portal
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
          Paytm UPI <span className="gold-gradient-text">Payment Verification</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-1">
          Scan the official festival Paytm UPI QR code, complete payment, and upload your payment proof with the 12-digit UTR reference number.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Paytm QR Code Instructions */}
        <div className="lg:col-span-5 bg-card rounded-2xl border-2 border-fest-gold/50 p-6 shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-fest-sunset block">
              Official Festival UPI Account
            </span>
            <h3 className="font-serif text-xl font-bold text-foreground">
              {qrSettings.upiName}
            </h3>
            <p className="font-mono text-xs font-semibold text-fest-sunset bg-fest-sunset/10 py-1 px-3 rounded-full inline-block border border-fest-sunset/30">
              {qrSettings.upiId}
            </p>
          </div>

          {/* QR Image Display */}
          <div className="p-4 rounded-xl bg-white max-w-[240px] mx-auto border-2 border-fest-gold/40 shadow-md">
            <img
              src={qrSettings.qrImageUrl}
              alt="Festival Paytm QR Code"
              className="w-full h-auto object-contain rounded"
            />
          </div>

          <div className="p-4 rounded-xl bg-card border border-fest-gold/30 text-left text-xs space-y-2 text-foreground font-sans">
            <span className="font-bold block text-foreground flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-fest-sunset" />
              Payment Instructions:
            </span>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {qrSettings.paymentInstructions}
            </p>
          </div>
        </div>

        {/* Right Column: Submit Payment Proof Form */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-fest-gold/30 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
              <Upload className="w-5 h-5 mr-2 text-fest-sunset" />
              Submit Payment Proof &amp; Complete Registration
            </h2>
          </div>

          {/* Helper notice if no registrations yet */}
          {registrations.length === 0 && !isLoadingData && (
            <div className="p-3.5 rounded-xl bg-fest-sunset/10 border border-fest-sunset/30 text-xs text-foreground flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-fest-sunset shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-fest-sunset">No pending registration found.</p>
                <p className="text-muted-foreground mt-0.5">
                  You can select an event from the dropdown below to register and submit your payment in one step!
                </p>
              </div>
            </div>
          )}

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
            {/* Select Registration / Event Dropdown */}
            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Select Event / Registration *
              </label>

              {isLoadingData ? (
                <div className="w-full px-3 py-2.5 text-xs rounded-md bg-background border border-border text-muted-foreground flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-fest-sunset" />
                  <span>Loading events and registrations...</span>
                </div>
              ) : (
                <select
                  value={selectedItemKey}
                  onChange={(e) => handleSelectOption(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-md bg-background border border-fest-gold/40 text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                >
                  {/* Group 1: Pending Registrations */}
                  {registrations.filter((r) => r.paymentStatus !== "approved").length > 0 && (
                    <optgroup label="📋 Your Unpaid / Pending Registrations">
                      {registrations
                        .filter((r) => r.paymentStatus !== "approved")
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.eventTitle} ({r.registrationNumber}) – {formatCurrency(r.amount)} [{r.paymentStatus.replace("_", " ").toUpperCase()}]
                          </option>
                        ))}
                    </optgroup>
                  )}

                  {/* Group 2: Approved Registrations */}
                  {registrations.filter((r) => r.paymentStatus === "approved").length > 0 && (
                    <optgroup label="✅ Your Approved Registrations">
                      {registrations
                        .filter((r) => r.paymentStatus === "approved")
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.eventTitle} ({r.registrationNumber}) – Approved (Ticket Issued)
                          </option>
                        ))}
                    </optgroup>
                  )}

                  {/* Group 3: All Available Festival Events to Register & Pay */}
                  {availableEvents.length > 0 && (
                    <optgroup label="✨ Register & Pay for New Event">
                      {availableEvents.map((ev) => (
                        <option key={`event:${ev.slug || ev.id}`} value={`event:${ev.slug || ev.id}`}>
                          {ev.title} – {formatCurrency(ev.registrationFee)} ({ev.category})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              )}
            </div>

            {/* Event Details Card */}
            {(selectedReg || selectedDirectEvent) && (
              <div className="p-3.5 rounded-lg bg-fest-sunset/10 border border-fest-gold/30 text-xs flex justify-between items-center font-sans">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Selected Event:</span>
                  <span className="font-bold text-foreground">
                    {selectedReg ? selectedReg.eventTitle : selectedDirectEvent?.title}
                  </span>
                  {selectedReg && (
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      Ref: {selectedReg.registrationNumber}
                    </span>
                  )}
                  {selectedDirectEvent && (
                    <span className="text-[10px] text-fest-sunset block">
                      New Event Registration
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[11px]">Payable Amount:</span>
                  <span className="font-serif font-black text-sm text-fest-sunset">
                    {formatCurrency(expectedFee)}
                  </span>
                </div>
              </div>
            )}

            {/* Team Name Input if registering directly for team/group event */}
            {isSelectedEventDirect && (
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Team Name / Squad Name (Optional for Solo, Required for Teams)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Awadh Strikers FC or Solo"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
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
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Amount Transferred (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={amountSubmitted || expectedFee}
                  onChange={(e) => setAmountSubmitted(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Additional Notes (Bank, UPI handle, etc.)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid via GPay from HDFC Bank"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>
            </div>

            {/* Payment Screenshot Upload */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-foreground font-sans block">
                Payment Screenshot Receipt * (Max 8MB)
              </label>

              {!isUsingCustomUrl ? (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-fest-gold/40 rounded-xl p-4 sm:p-6 text-center hover:border-fest-sunset transition-colors bg-fest-sunset/5">
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center space-y-2 py-2">
                        <Loader2 className="w-8 h-8 animate-spin text-fest-sunset" />
                        <span className="text-xs text-muted-foreground font-sans">
                          Uploading payment proof image...
                        </span>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <CloudUpload className="w-8 h-8 text-fest-sunset mx-auto mb-2" />
                        <span className="text-xs font-bold text-foreground block">
                          Click to browse and upload receipt screenshot
                        </span>
                        <span className="text-[11px] text-muted-foreground font-sans block mt-1">
                          PNG, JPG, WEBP, or PDF image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {uploadError && (
                    <p className="text-[11px] text-destructive font-sans">{uploadError}</p>
                  )}

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsUsingCustomUrl(true)}
                      className="text-[11px] text-fest-sunset hover:underline font-sans"
                    >
                      Or paste an image URL directly
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or your image link"
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsUsingCustomUrl(false)}
                      className="text-[11px] text-fest-sunset hover:underline font-sans"
                    >
                      Or upload file from device
                    </button>
                  </div>
                </div>
              )}

              {screenshotUrl && (
                <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img
                      src={screenshotUrl}
                      alt="Uploaded proof preview"
                      className="w-12 h-12 object-cover rounded border border-border shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-foreground block truncate">
                        Receipt Image Attached
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {screenshotUrl}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenshotUrl("")}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isUploading || isLoadingData}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Payment Proof...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Payment Proof for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ParticipantPaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-fest-sunset" />
          <span>Loading payments portal...</span>
        </div>
      }
    >
      <PaymentsContent />
    </Suspense>
  );
}
