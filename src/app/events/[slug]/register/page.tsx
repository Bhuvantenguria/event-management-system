"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CreditCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { dataStore } from "@/lib/data-store";

const EVENT_METADATA: Record<string, any> = {
  "kathak-jugalbandi": {
    title: "Kathak Jugalbandi – Classical Dance Confluence",
    slug: "kathak-jugalbandi",
    category: "Cultural & Performing Arts",
    registrationFee: 300,
    participationType: "both",
    minTeamSize: 1,
    maxTeamSize: 2,
  },
  "royal-up-football-cup": {
    title: "Chhatrapati Shivaji Memorial Football Cup",
    slug: "royal-up-football-cup",
    category: "Sports & Athletics Arena",
    registrationFee: 1500,
    participationType: "team",
    minTeamSize: 11,
    maxTeamSize: 16,
  },
  "ghazal-and-kavi-sammelan": {
    title: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
    slug: "ghazal-and-kavi-sammelan",
    category: "Literary, Debating & Poetry",
    registrationFee: 200,
    participationType: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
  },
};

export default function EventRegistrationPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const storeEvent = dataStore.getEventBySlug(params.slug) || dataStore.getEventById(params.slug);
  const event = storeEvent
    ? {
        title: storeEvent.title,
        slug: storeEvent.slug,
        category: storeEvent.category,
        registrationFee: storeEvent.registrationFee,
        participationType: "both",
        minTeamSize: 1,
        maxTeamSize: 16,
      }
    : EVENT_METADATA[params.slug] || {
        title: params.slug.replace(/-/g, " ").toUpperCase(),
        slug: params.slug,
        category: "Featured Event",
        registrationFee: 300,
        participationType: "both",
        minTeamSize: 1,
        maxTeamSize: 4,
      };

  const isTeamRequired = event.participationType === "team";
  const [participationType, setParticipationType] = useState<"individual" | "team">(
    isTeamRequired ? "team" : "individual"
  );

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string; phone: string }>>([
    { name: "", email: "", phone: "" },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddMember = () => {
    if (teamMembers.length + 1 >= event.maxTeamSize) {
      setError(`Maximum team size for this event is ${event.maxTeamSize} members.`);
      return;
    }
    setError("");
    setTeamMembers([...teamMembers, { name: "", email: "", phone: "" }]);
  };

  const handleRemoveMember = (idx: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: string, value: string) => {
    const updated = [...teamMembers];
    (updated[idx] as any)[field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      router.push(`/login?callbackUrl=/events/${event.slug}/register`);
      return;
    }

    if (participationType === "team" && !teamName.trim()) {
      setError("Please specify your Team / Roster Name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: event.slug,
          eventTitle: event.title,
          participationType,
          teamName: participationType === "team" ? teamName : undefined,
          teamMembers: participationType === "team" ? teamMembers : undefined,
          amount: event.registrationFee,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to register for event.");
        return;
      }

      if (event.registrationFee > 0) {
        // Redirect to Paytm QR payment page with specific registration pre-selected
        const regParam = data.registration?.id ? `?regId=${encodeURIComponent(data.registration.id)}&event=${encodeURIComponent(event.slug)}` : `?event=${encodeURIComponent(event.slug)}`;
        router.push(`/dashboard/payments${regParam}`);
      } else {
        // Free event -> Go directly to tickets
        router.push("/dashboard/tickets");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An error occurred while submitting registration.");
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Event Overview
        </Link>
      </div>

      {/* Header */}
      <div className="bg-card rounded-2xl border-2 border-heritage-gold/50 p-6 sm:p-8 shadow-xl space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-heritage-gold-dark dark:text-heritage-gold font-sans block">
          Official Festival Registration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
          {event.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-muted-foreground pt-1">
          <span>Category: <strong className="text-foreground">{event.category}</strong></span>
          <span>•</span>
          <span>
            Fee:{" "}
            <strong className="text-heritage-maroon dark:text-heritage-gold font-serif text-sm">
              {event.registrationFee === 0 ? "Free Entry" : formatCurrency(event.registrationFee)}
            </strong>
          </span>
          <span>•</span>
          <span>Format: <strong className="text-foreground capitalize">{event.participationType}</strong></span>
        </div>
      </div>

      {/* Auth Check Reminder if Guest */}
      {!session && status !== "loading" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
          <span>You need to be signed in as a participant to submit this registration.</span>
          <Link
            href={`/login?callbackUrl=/events/${event.slug}/register`}
            className="px-3.5 py-1.5 rounded-lg bg-heritage-maroon text-heritage-ivory font-bold hover:bg-heritage-maroon-dark transition-colors shrink-0 text-center w-full sm:w-auto"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center space-x-2 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Participation Format Toggle if event allows both */}
        {event.participationType === "both" && (
          <div className="bg-card rounded-xl border border-heritage-gold/30 p-5 space-y-2">
            <label className="text-xs font-bold text-foreground font-sans block">
              Participation Mode
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setParticipationType("individual")}
                className={`py-2 px-4 rounded-md text-xs font-bold transition-all ${
                  participationType === "individual"
                    ? "bg-heritage-maroon text-heritage-ivory border border-heritage-gold"
                    : "bg-background text-foreground border border-border"
                }`}
              >
                Solo / Individual
              </button>
              <button
                type="button"
                onClick={() => setParticipationType("team")}
                className={`py-2 px-4 rounded-md text-xs font-bold transition-all ${
                  participationType === "team"
                    ? "bg-heritage-maroon text-heritage-ivory border border-heritage-gold"
                    : "bg-background text-foreground border border-border"
                }`}
              >
                College Team / Duo
              </button>
            </div>
          </div>
        )}

        {/* Team Details if Team mode */}
        {participationType === "team" && (
          <div className="bg-card rounded-2xl border border-heritage-gold/30 p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-lg font-bold text-foreground">
              Team Roster Details
            </h2>

            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Team / Squad Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Awadh Strikers FC or Banaras Classical Duo"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
              />
            </div>

            {/* Team Members List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground font-sans">
                  Additional Team Members (Captain is automatically included)
                </span>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center space-x-1 text-xs text-heritage-maroon dark:text-heritage-gold font-bold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder={`Member ${idx + 1} Name`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-background border border-border text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-background border border-border text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={member.phone}
                      onChange={(e) => handleMemberChange(idx, "phone", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-background border border-border text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-destructive hover:opacity-80 p-1"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Payment Explanation */}
        <div className="rounded-xl bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/30 p-5 space-y-2 text-xs font-sans">
          <span className="font-bold flex items-center text-foreground">
            <QrCode className="w-4 h-4 mr-1.5 text-heritage-gold" />
            Paytm QR Manual Verification Protocol
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {event.registrationFee > 0
              ? `This event requires a registration fee of ${formatCurrency(
                  event.registrationFee
                )}. On clicking submit, you will be redirected to the Paytm QR payment page to scan the official festival UPI QR and submit your 12-digit transaction UTR number.`
              : "This is a free event sponsored by the cultural committee. Submitting will confirm your registration and immediately generate your digital QR entry ticket."}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Processing Registration...</span>
          ) : (
            <>
              <span>
                {event.registrationFee > 0
                  ? `Proceed to Paytm QR Payment (${formatCurrency(event.registrationFee)})`
                  : "Confirm Free Registration"}
              </span>
              <ArrowRight className="w-4 h-4 text-heritage-gold" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
