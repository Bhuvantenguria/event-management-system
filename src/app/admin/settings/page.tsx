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

    setIsUploadingQr(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "rangmanch26/qr");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload QR image.");
      }

      setQrImageUrl(data.url);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload QR image to Cloudinary.");
    } finally {
      setIsUploadingQr(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.updateQrSettings({
      upiId,
      upiName,
      qrImageUrl,
      paymentInstructions,
      isEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
          System & Paytm QR <span className="gold-gradient-text">Configuration</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage official festival Paytm UPI accounts, payment instructions, and QR code banners
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Paytm QR settings updated and published live across the platform.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card rounded-2xl border border-heritage-gold/30 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-heritage-gold" />
              Paytm UPI QR Configuration
            </h2>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="rounded border-border text-heritage-maroon"
              />
              <span className="font-semibold text-foreground">Accepting Payments</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Official Festival UPI ID *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="upfest.cultural@paytm"
                className="w-full px-3 py-2 text-xs rounded bg-background border border-border text-foreground font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Beneficiary UPI Name *
              </label>
              <input
                type="text"
                required
                value={upiName}
                onChange={(e) => setUpiName(e.target.value)}
                placeholder="Rangmanch UP Cultural Committee"
                className="w-full px-3 py-2 text-xs rounded bg-background border border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              Paytm QR Code Image (Cloudinary or Direct URL) *
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {qrImageUrl && (
                <div className="w-24 h-24 rounded-xl border border-heritage-gold/40 overflow-hidden bg-background shrink-0 p-1">
                  <img
                    src={qrImageUrl}
                    alt="Current Paytm QR"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  required
                  value={qrImageUrl}
                  onChange={(e) => setQrImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-background border border-border text-foreground font-mono"
                  placeholder="https://res.cloudinary.com/... or /images/qr.png"
                />
                <div className="flex items-center space-x-3">
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground text-xs cursor-pointer border border-border transition-colors">
                    {isUploadingQr ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-heritage-gold animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-heritage-gold" />
                        <span>Upload New QR to Cloudinary</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingQr}
                      onChange={handleQrUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadError && (
                    <span className="text-[11px] text-red-500">{uploadError}</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Direct Cloudinary secure CDN URL or upload from local device. Displayed to participants on the payment screen.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Participant Payment Instructions
            </label>
            <textarea
              rows={4}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded bg-background border border-border text-foreground font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4 text-heritage-gold" />
          <span>Save QR Settings</span>
        </button>
      </form>
    </div>
  );
}
