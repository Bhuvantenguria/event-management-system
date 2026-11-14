"use client";

import React, { useState } from "react";
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.updateQrSettings({
      upiId: upiId.trim(),
      upiName: upiName.trim(),
      qrImageUrl: qrImageUrl.trim(),
      paymentInstructions: paymentInstructions.trim(),
      isEnabled,
    });
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
    </div>
  );
}
