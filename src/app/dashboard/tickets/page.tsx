"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { dataStore, StoredTicket } from "@/lib/data-store";
import {
  Ticket as TicketIcon,
  Download,
  Printer,
  Calendar,
  MapPin,
  User,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { LotusOrnament } from "@/components/ui/heritage-decorations";

export default function DigitalTicketsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<StoredTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/tickets");
      return;
    }

    if (status === "authenticated") {
      const loadTickets = async () => {
        setIsLoading(true);
        try {
          const res = await fetch("/api/user/tickets", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.tickets && Array.isArray(data.tickets)) {
              setTickets(data.tickets);
              return;
            }
          }
        } catch {}
        const userEmail = session?.user?.email || "";
        setTickets(dataStore.getTicketsByUser(userEmail));
        setIsLoading(false);
      };

      loadTickets().finally(() => setIsLoading(false));
    }
  }, [status, session, router]);

  useEffect(() => {
    // Generate QR codes for all tickets
    tickets.forEach((t) => {
      QRCode.toDataURL(t.qrToken, {
        width: 240,
        margin: 1,
        color: {
          dark: "#252321",
          light: "#F5EEDC",
        },
      })
        .then((url) => {
          setQrImages((prev) => ({ ...prev, [t.id]: url }));
        })
        .catch(console.error);
    });
  }, [tickets]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTicket = (ticket: StoredTicket) => {
    const qrUrl = qrImages[ticket.id];
    if (!qrUrl) return;

    // Create a temporary canvas or download link for the QR pass
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `ticket-${ticket.ticketNumber}-${ticket.qrToken}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Digital Entry <span className="gold-gradient-text">QR Tickets</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Cryptographically signed digital entry passes for verified festival events
          </p>
        </div>

        {tickets.length > 0 && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-md bg-card border border-heritage-gold/50 text-foreground hover:bg-heritage-sandstone/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Print All Tickets</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-fest-sunset mx-auto" />
          <p className="text-xs text-muted-foreground">Loading your digital QR entry tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border space-y-3">
          <TicketIcon className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-serif text-lg font-bold text-foreground">
            No Active Tickets Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Digital QR tickets are generated automatically once your Paytm QR payment is
            verified by our finance team, or instantly for free competitions.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="relative rounded-2xl overflow-hidden bg-card border-2 border-heritage-gold shadow-2xl transition-all"
            >
              {/* Royal Arch Top Accent Banner */}
              <div className="bg-heritage-maroon text-heritage-ivory px-4 sm:px-6 py-3 sm:py-4 border-b border-heritage-gold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-heritage-charcoal flex items-center justify-center border border-heritage-gold shrink-0">
                    <LotusOrnament className="w-4 h-4 text-heritage-gold" />
                  </div>
                  <div>
                    <span className="font-serif text-base font-bold text-heritage-gold-light">
                      AffinityAIIMS 2026
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-heritage-sandstone block font-sans">
                      Official Entry Pass • 12–15 March 2026
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-sans text-heritage-sandstone block">
                      Ticket ID
                    </span>
                    <span className="font-mono text-xs font-bold text-heritage-gold">
                      {t.ticketNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadTicket(t)}
                    title="Download QR Pass Image"
                    className="p-1.5 rounded-lg bg-heritage-charcoal hover:bg-black/60 text-heritage-gold border border-heritage-gold/40 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Ticket Card Body */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Event & Participant Information */}
                <div className="md:col-span-8 space-y-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-heritage-gold-dark dark:text-heritage-gold font-sans block">
                      Confirmed Entry
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-foreground mt-1">
                      {t.eventTitle}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Participant Name
                      </span>
                      <p className="font-semibold text-foreground flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-heritage-gold" />
                        {t.participantName}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        College / University
                      </span>
                      <p className="font-semibold text-foreground flex items-center">
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-heritage-gold" />
                        {t.college}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Scheduled Date & Time
                      </span>
                      <p className="font-semibold text-foreground flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-heritage-gold" />
                        {t.eventDate}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Venue & Gate
                      </span>
                      <p className="font-semibold text-foreground flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-heritage-gold" />
                        {t.eventVenue}
                      </p>
                    </div>
                  </div>

                  {/* Verification Checkmark */}
                  <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-sans font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographically Signed & Authenticated for Gate Entry</span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 rounded-xl border border-heritage-gold/40 text-center">
                  <div className="p-2 bg-heritage-ivory rounded-lg border border-heritage-gold/50 shadow-md">
                    {qrImages[t.id] ? (
                      <img
                        src={qrImages[t.id]}
                        alt={`QR Pass for ${t.ticketNumber}`}
                        className="w-40 h-40 object-contain"
                      />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center text-xs text-muted-foreground">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[10px] font-bold text-foreground mt-2 break-all">
                    {t.qrToken}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5 font-sans">
                    Present at Entry Turnstile
                  </span>
                </div>
              </div>

              {/* Bottom Cutout Line */}
              <div className="px-4 sm:px-6 py-2.5 bg-muted/50 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-muted-foreground font-sans">
                <span>Registration Ref: {t.registrationId}</span>
                <span>Carry valid Student ID card alongside this QR ticket.</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
