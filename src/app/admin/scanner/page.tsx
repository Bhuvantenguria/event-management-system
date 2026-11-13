"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  ScanLine,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  User,
  GraduationCap,
  Calendar,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";

export default function GateQrScannerPage() {
  const { data: session } = useSession();
  const [manualToken, setManualToken] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "success" | "duplicate" | "error";
    message: string;
    ticket?: any;
  }>({ status: "idle", message: "" });

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const scannerRef = useRef<any>(null);

  const handleVerifyToken = async (token: string) => {
    if (!token.trim()) return;

    try {
      const res = await fetch("/api/admin/scanner/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: token.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setScanResult({
          status: "success",
          message: data.message,
          ticket: data.ticket,
        });
        setRecentScans((prev) => [
          { ...data.ticket, checkInTime: new Date().toLocaleTimeString() },
          ...prev.slice(0, 9),
        ]);
      } else if (res.status === 409) {
        setScanResult({
          status: "duplicate",
          message: data.error || "WARNING: TICKET ALREADY SCANNED PREVIOUSLY!",
          ticket: data.ticket,
        });
      } else {
        setScanResult({
          status: "error",
          message: data.error || "Invalid ticket or unauthorized pass.",
        });
      }
    } catch (err: any) {
      setScanResult({
        status: "error",
        message: err.message || "Failed to contact entry verification server.",
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyToken(manualToken);
    setManualToken("");
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const { Html5Qrcode } = await import("html5-qrcode");

      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleVerifyToken(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error("Camera access failed or unavailable in this environment", err);
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch {}
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Gate Entry <span className="gold-gradient-text">Live QR Scanner</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time atomic gate verification, attendee lookup, and duplicate pass prevention
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-foreground">Scanner Terminal Live</span>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Viewport & Manual Input */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-card rounded-2xl border-2 border-heritage-gold/50 p-6 shadow-xl space-y-4 text-center">
            {/* Camera Viewport Container */}
            <div className="relative min-h-[260px] rounded-xl overflow-hidden bg-black/90 border border-heritage-gold/30 flex flex-col items-center justify-center p-4">
              <div id="reader" className="w-full h-full max-w-[320px]" />

              {!cameraActive && (
                <div className="text-center space-y-3 py-6">
                  <Camera className="w-12 h-12 text-heritage-gold mx-auto" />
                  <p className="text-xs text-heritage-sandstone">
                    Tap below to initialize your device's camera for barcode/QR scanning.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors"
                  >
                    Start Live Camera Feed
                  </button>
                </div>
              )}

              {cameraActive && (
                <div className="mt-4">
                  <button
                    onClick={stopCamera}
                    className="px-4 py-1.5 rounded-md bg-destructive text-white text-xs font-semibold"
                  >
                    Stop Camera
                  </button>
                </div>
              )}
            </div>

            {/* Manual Lookup Option */}
            <form onSubmit={handleManualSubmit} className="pt-2 space-y-2 text-left">
              <label className="text-xs font-bold text-foreground block">
                Manual Token / Ticket Lookup
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter QR token (e.g. RNG-TKT-778899-KATHAK)"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-md bg-background border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold whitespace-nowrap transition-colors"
                >
                  Verify Entry
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Verification Result Panel */}
        <div className="md:col-span-5 space-y-4">
          <div
            className={`rounded-2xl border-2 p-6 shadow-xl transition-all ${
              scanResult.status === "success"
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200"
                : scanResult.status === "duplicate"
                ? "bg-destructive/15 border-destructive text-destructive"
                : scanResult.status === "error"
                ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300"
                : "bg-card border-heritage-gold/30 text-muted-foreground"
            }`}
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-border/40">
              {scanResult.status === "success" && (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-serif text-lg font-bold text-emerald-700 dark:text-emerald-300">
                    ENTRY APPROVED
                  </span>
                </>
              )}
              {scanResult.status === "duplicate" && (
                <>
                  <XCircle className="w-6 h-6 text-destructive shrink-0 animate-bounce" />
                  <span className="font-serif text-lg font-bold text-destructive">
                    DUPLICATE PASS ALERT!
                  </span>
                </>
              )}
              {scanResult.status === "error" && (
                <>
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                  <span className="font-serif text-lg font-bold">
                    INVALID TICKET
                  </span>
                </>
              )}
              {scanResult.status === "idle" && (
                <>
                  <ScanLine className="w-6 h-6 text-heritage-gold shrink-0" />
                  <span className="font-serif text-base font-bold text-foreground">
                    Awaiting Scan
                  </span>
                </>
              )}
            </div>

            {/* Scan Message & Ticket Details */}
            <div className="py-4 space-y-3">
              <p className="text-xs font-semibold leading-relaxed">
                {scanResult.message || "Point camera at attendee QR pass or enter code."}
              </p>

              {scanResult.ticket && (
                <div className="p-3.5 rounded-xl bg-background/80 border border-border text-xs text-foreground space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Attendee Name
                    </span>
                    <span className="font-bold text-sm">
                      {scanResult.ticket.participantName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Event
                    </span>
                    <span className="font-semibold text-heritage-maroon dark:text-heritage-gold">
                      {scanResult.ticket.eventTitle}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      College
                    </span>
                    <span>{scanResult.ticket.college}</span>
                  </div>
                  {scanResult.ticket.ticketNumber && (
                    <div className="font-mono text-[10px] text-muted-foreground">
                      Ticket #{scanResult.ticket.ticketNumber}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Recent Gate Check-Ins Log */}
          <div className="bg-card rounded-xl border border-heritage-gold/30 p-4 space-y-3">
            <span className="text-xs font-serif font-bold text-foreground block">
              Recent Gate Check-Ins ({recentScans.length})
            </span>
            {recentScans.length === 0 ? (
              <p className="text-xs text-muted-foreground">No scans in this session yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto text-xs pr-1">
                {recentScans.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-foreground">{item.participantName}</p>
                      <p className="text-[10px] text-muted-foreground">{item.eventTitle}</p>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">
                      {item.checkInTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
