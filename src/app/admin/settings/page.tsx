"use client";

import React, { useState, useEffect } from "react";
import { dataStore } from "@/lib/data-store";
import {
  Settings,
  CreditCard,
  QrCode,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  Loader2,
  Eye,
  ShieldCheck,
  Mail,
  Send,
  RefreshCw,
  Activity,
  Server,
  Database,
  Trash2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const currentSettings = dataStore.getQrSettings();

  const [upiId, setUpiId] = useState(currentSettings.upiId);
  const [upiName, setUpiName] = useState(currentSettings.upiName);
  const [qrImageUrl, setQrImageUrl] = useState(currentSettings.qrImageUrl);
  const [paymentInstructions, setPaymentInstructions] = useState(
    currentSettings.paymentInstructions
  );
  const [isEnabled, setIsEnabled] = useState(currentSettings.isEnabled);

  const [saved, setSaved] = useState(false);
  const [isUploadingQr, setIsUploadingQr] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Gmail SMTP Diagnostics State
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const [isCheckingSmtp, setIsCheckingSmtp] = useState(false);
  const [smtpVerifyResult, setSmtpVerifyResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [testEmailTarget, setTestEmailTarget] = useState("");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Database Maintenance State
  const [isPurgingDb, setIsPurgingDb] = useState(false);
  const [dbPurgeResult, setDbPurgeResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const loadSmtpStatus = async () => {
    try {
      const res = await fetch("/api/admin/email");
      if (res.ok) {
        const data = await res.json();
        setSmtpStatus(data);
        if (data.smtpUser && !testEmailTarget) {
          setTestEmailTarget(data.smtpUser);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetch("/api/admin/qr-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.qrSettings) {
          if (data.qrSettings.upiId) setUpiId(data.qrSettings.upiId);
          if (data.qrSettings.upiName) setUpiName(data.qrSettings.upiName);
          if (data.qrSettings.qrImageUrl) setQrImageUrl(data.qrSettings.qrImageUrl);
          if (data.qrSettings.paymentInstructions) setPaymentInstructions(data.qrSettings.paymentInstructions);
          if (data.qrSettings.isEnabled !== undefined) setIsEnabled(data.qrSettings.isEnabled);
        }
      })
      .catch(() => {});

    loadSmtpStatus();
  }, []);

  const handleVerifySmtp = async () => {
    setIsCheckingSmtp(true);
    setSmtpVerifyResult(null);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify" }),
      });
      const data = await res.json();
      setSmtpVerifyResult({
        success: data.connected === true,
        message: data.message || (data.connected ? "Connection verified!" : "Handshake failed."),
      });
      loadSmtpStatus();
    } catch (err: any) {
      setSmtpVerifyResult({
        success: false,
        message: err?.message || "Failed to contact SMTP verification endpoint.",
      });
    } finally {
      setIsCheckingSmtp(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTarget.trim()) return;

    setIsSendingTestEmail(true);
    setTestEmailResult(null);

    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          recipientEmail: testEmailTarget.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestEmailResult({
          success: true,
          message: data.simulated
            ? `Email simulated successfully in Dev/Preview mode (No SMTP credentials configured).`
            : `Live diagnostic email dispatched to ${testEmailTarget}! Message ID: ${data.messageId || "Delivered"}`,
        });
      } else {
        setTestEmailResult({
          success: false,
          message: data.error || "Failed to dispatch test notification.",
        });
      }
      loadSmtpStatus();
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err?.message || "Network error while transmitting test email.",
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handlePurgeDummyData = async () => {
    if (!confirm("Are you sure you want to purge all legacy dummy data? Only essential admin credentials and active clubs/fests will be preserved.")) {
      return;
    }

    setIsPurgingDb(true);
    setDbPurgeResult(null);

    try {
      const res = await fetch("/api/admin/clean-dummy-data", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDbPurgeResult({
          success: true,
          message: data.message || "Database successfully cleaned! All dummy records removed.",
          details: data,
        });
      } else {
        setDbPurgeResult({
          success: false,
          message: data.error || "Failed to purge dummy data.",
        });
      }
    } catch (err: any) {
      setDbPurgeResult({
        success: false,
        message: err?.message || "Network error while cleaning database.",
      });
    } finally {
      setIsPurgingDb(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image size must be less than 8MB.");
      return;
    }

    setIsUploadingQr(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "affinity_aiims/qr");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setQrImageUrl(data.url);
      } else {
        // Fallback to local data URL preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setQrImageUrl(reader.result as string);
          }
        };
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload QR image to Cloudinary.");
    } finally {
      setIsUploadingQr(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      upiId: upiId.trim(),
      upiName: upiName.trim(),
      qrImageUrl: qrImageUrl.trim(),
      paymentInstructions: paymentInstructions.trim(),
      isEnabled,
    };

    try {
      await fetch("/api/admin/qr-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      console.warn("API qr-settings update notice:", err?.message);
    }

    dataStore.updateQrSettings(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/15 text-fest-sunset text-xs font-semibold mb-1">
          <QrCode className="w-3.5 h-3.5" />
          <span>Organizer Payment Gateway Replacement</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
          Organizer Paytm QR <span className="gold-gradient-text">Configuration</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          This single organizer Paytm QR is used across all festival event registrations. Update the QR code image, UPI ID, and beneficiary name anytime below.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Organizer Paytm QR settings updated successfully!</p>
            <p className="text-[11px] opacity-90">
              The updated QR code and UPI details are now live for all event registrations.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-3xl border-2 border-fest-gold/40 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-fest-sunset" />
                Paytm UPI Account Details
              </h2>
              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="rounded border-border text-fest-sunset focus:ring-fest-sunset"
                />
                <span className="font-bold text-foreground">Accepting Payments</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Organizer UPI ID *
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. organizer@paytm"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
                <span className="text-[10px] text-muted-foreground">
                  Official UPI VPA for receiving fee transfers
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Beneficiary / Organizer Name *
                </label>
                <input
                  type="text"
                  required
                  value={upiName}
                  onChange={(e) => setUpiName(e.target.value)}
                  placeholder="e.g. SWAR AIIMS Raebareli"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
                <span className="text-[10px] text-muted-foreground">
                  Name shown on participant UPI app screen
                </span>
              </div>
            </div>

            {/* QR Code Upload & URL */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-foreground block">
                Paytm QR Code Image (Cloudinary or Direct URL) *
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {qrImageUrl && (
                  <div className="w-24 h-24 rounded-2xl border-2 border-fest-gold/50 overflow-hidden bg-white p-1 shrink-0 shadow-sm">
                    <img
                      src={qrImageUrl}
                      alt="Paytm QR Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="url"
                    required
                    value={qrImageUrl}
                    onChange={(e) => setQrImageUrl(e.target.value)}
                    placeholder="https://... image link or upload below"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground font-mono"
                  />

                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-fest-plum hover:bg-fest-burgundy text-white font-bold cursor-pointer text-xs border border-fest-gold/40 shadow-sm transition-all">
                      {isUploadingQr ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-fest-gold-light" />
                      )}
                      <span>{isUploadingQr ? "Uploading..." : "Upload New QR Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        disabled={isUploadingQr}
                        className="hidden"
                      />
                    </label>

                    {isUploadingQr && (
                      <span className="text-[11px] text-fest-sunset">Uploading to Cloudinary...</span>
                    )}
                  </div>
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-destructive flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* Instructions to Participants */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Participant Payment Instructions &amp; Guidelines
              </label>
              <textarea
                rows={4}
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
                placeholder="1. Scan the Paytm UPI QR code...&#10;2. Enter registration amount...&#10;3. Copy 12-digit UTR..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
              />
              <span className="text-[10px] text-muted-foreground">
                Displayed directly on the participant payment submission portal.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white text-xs font-bold shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Update Paytm QR</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right: Live Participant Checkout Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-card border-2 border-fest-gold/60 p-6 shadow-xl space-y-5 text-center relative overflow-hidden">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-fest-sunset/15 text-fest-sunset text-[10px] font-bold uppercase tracking-wider">
              <Eye className="w-3 h-3" />
              <span>Participant Checkout Preview</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground block">
                Official Festival UPI Account
              </span>
              <h3 className="font-serif text-lg font-bold text-foreground">{upiName}</h3>
              <p className="font-mono text-xs font-semibold text-fest-sunset bg-fest-champagne/30 dark:bg-fest-charcoal py-1 px-3 rounded-full inline-block border border-fest-gold/30">
                {upiId}
              </p>
            </div>

            {/* QR Card */}
            <div className="p-4 rounded-2xl bg-white max-w-[210px] mx-auto border-2 border-fest-gold/50 shadow-md">
              <img
                src={qrImageUrl || "/placeholder.jpg"}
                alt="Organizer Paytm QR"
                className="w-full h-auto object-contain rounded"
              />
              <p className="text-[9px] font-bold text-gray-700 mt-2 tracking-wide uppercase">
                Paytm • GPay • PhonePe • BHIM
              </p>
            </div>

            <div className="p-4 rounded-xl bg-fest-champagne/20 dark:bg-fest-charcoal border border-border text-left text-xs space-y-2 text-foreground font-sans">
              <span className="font-bold block text-foreground flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-fest-sunset" />
                Payment Instructions:
              </span>
              <p className="whitespace-pre-line text-muted-foreground text-[11px] leading-relaxed">
                {paymentInstructions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gmail SMTP Diagnostics & Dispatch Card */}
      <div className="rounded-3xl bg-card border-2 border-fest-gold/40 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/15 text-fest-sunset text-xs font-semibold mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Nodemailer Gmail SMTP Engine</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground flex items-center">
              Gmail SMTP <span className="gold-gradient-text ml-1.5">Diagnostics &amp; Testing</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Verify live connectivity with Google SMTP servers and send test emails to validate notifications.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleVerifySmtp}
              disabled={isCheckingSmtp}
              className="px-4 py-2 rounded-xl bg-fest-plum hover:bg-fest-burgundy text-white text-xs font-bold border border-fest-gold/40 shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isCheckingSmtp ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Activity className="w-3.5 h-3.5 text-fest-gold-light" />
              )}
              <span>{isCheckingSmtp ? "Testing Handshake..." : "Verify Connection"}</span>
            </button>
          </div>
        </div>

        {/* Verification Result Feedback */}
        {smtpVerifyResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
              smtpVerifyResult.success
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 border border-destructive/30 text-destructive"
            }`}
          >
            {smtpVerifyResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <p className="font-medium">{smtpVerifyResult.message}</p>
          </div>
        )}

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Engine Status
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  smtpStatus?.isConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span className="font-bold text-xs text-foreground">
                {smtpStatus?.isConfigured ? "Live Gmail SMTP Active" : "Graceful Simulation Mode"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {smtpStatus?.isConfigured
                ? "Dispatches real emails to participant inboxes"
                : "Simulates dispatches in development logs without SMTP error crashes"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Sender Address (From)
            </span>
            <span className="font-mono text-xs font-semibold text-fest-sunset truncate block">
              {smtpStatus?.senderAddress || "AffinityAIIMS <swar@aiimsraebareli.edu.in>"}
            </span>
            <p className="text-[10px] text-muted-foreground">
              Displayed in participant inbox header
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Authenticated Account
            </span>
            <span className="font-mono text-xs font-semibold text-foreground truncate block">
              {smtpStatus?.smtpUser || "Not configured (set in .env)"}
            </span>
            <p className="text-[10px] text-muted-foreground">
              Host: {smtpStatus?.smtpHost || "smtp.gmail.com"}:{smtpStatus?.smtpPort || "465"}
            </p>
          </div>
        </div>

        {/* Test Email Dispatch Form */}
        <form onSubmit={handleSendTestEmail} className="p-5 rounded-2xl bg-background border border-border space-y-4">
          <h3 className="font-serif text-sm font-bold text-foreground flex items-center">
            <Send className="w-4 h-4 mr-1.5 text-fest-sunset" />
            Dispatch Diagnostic Test Email
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={testEmailTarget}
              onChange={(e) => setTestEmailTarget(e.target.value)}
              placeholder="Enter recipient email (e.g. your email to verify reception)"
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-card border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-fest-sunset"
            />
            <button
              type="submit"
              disabled={isSendingTestEmail}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50 transition-all shrink-0"
            >
              {isSendingTestEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isSendingTestEmail ? "Dispatching..." : "Send Test Email"}</span>
            </button>
          </div>

          {testEmailResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
                testEmailResult.success
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border border-destructive/30 text-destructive"
              }`}
            >
              {testEmailResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <p className="font-medium">{testEmailResult.message}</p>
            </div>
          )}
        </form>

        {/* Recent Dispatch Audit Log */}
        {smtpStatus?.logs && smtpStatus.logs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground">
                Recent Email Dispatch Logs ({smtpStatus.logs.length})
              </h4>
              <button
                type="button"
                onClick={loadSmtpStatus}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {smtpStatus.logs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.status === "sent"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : log.status === "simulated"
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                            : "bg-destructive/15 text-destructive border border-destructive/30"
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="font-bold text-foreground">{log.type}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        → {log.to}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate max-w-md">
                      {log.subject}
                    </p>
                    {log.error && (
                      <p className="text-[10px] text-destructive">{log.error}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Database Maintenance & Clean State Card */}
      <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-5">
        <div className="flex items-center space-x-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
              Database Maintenance & Dummy Data Cleanup
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Keep your production database pristine. Purge all legacy demo registrations, mock payments, and placeholder students while preserving administrator accounts.
            </p>
          </div>
        </div>

        {dbPurgeResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start space-x-2.5 ${
              dbPurgeResult.success
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-destructive/10 border border-destructive/30 text-destructive"
            }`}
          >
            {dbPurgeResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold block">{dbPurgeResult.message}</span>
              {dbPurgeResult.details && (
                <div className="text-[11px] opacity-90 font-mono">
                  Purged: {dbPurgeResult.details.deletedRegistrations || 0} registrations,{" "}
                  {dbPurgeResult.details.deletedPayments || 0} payments,{" "}
                  {dbPurgeResult.details.deletedTickets || 0} tickets,{" "}
                  {dbPurgeResult.details.deletedUsers || 0} demo students. Remaining essential admins:{" "}
                  {dbPurgeResult.details.remainingUsers || 0}.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-xs">Purge Legacy Dummy Records</h3>
            <p className="text-[11px] text-muted-foreground">
              Removes mock registrations (e.g. REG-2026-1001), sample UTR payments, demo tickets, and test student accounts from both in-memory cache and MongoDB Atlas.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePurgeDummyData}
            disabled={isPurgingDb}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isPurgingDb ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{isPurgingDb ? "Purging Records..." : "Purge All Dummy Data"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
