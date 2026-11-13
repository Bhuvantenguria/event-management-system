import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  FileText,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Helper event catalog for dynamic slug resolution
const EVENT_DIRECTORY: Record<string, any> = {
  "kathak-jugalbandi": {
    title: "Kathak Jugalbandi – Classical Dance Confluence",
    slug: "kathak-jugalbandi",
    category: "Cultural & Performing Arts",
    club: "Mudra Dance Society",
    description:
      "A premier classical dance competition celebrating the rhythmic brilliance, bhav (expression), and chakkar spins of the historic Lucknow and Banaras Gharanas. Accompanied by live tabla, harmonium, and padhant.",
    poster:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop",
    date: "13 March 2026",
    time: "05:00 PM – 08:30 PM",
    venue: "Nawab Wajid Ali Shah Auditorium, Main Block",
    registrationFee: 300,
    participationType: "both",
    minTeamSize: 1,
    maxTeamSize: 2,
    prizePool: "₹35,000",
    prizes: [
      { rank: "1st Prize", amount: "₹20,000 + Golden Nataraja Trophy" },
      { rank: "2nd Prize", amount: "₹10,000 + Silver Plaque" },
      { rank: "3rd Prize", amount: "₹5,000 + Certificate of Merit" },
      { rank: "Best Footwork (Tatkar)", amount: "Special Citation" },
    ],
    rules: [
      "Maximum performance time limit: 10 minutes including stage setup and padhant.",
      "Live accompaniment or high-quality pen-drive audio tracks are permitted.",
      "Traditional classical attire with ghungroos is mandatory.",
      "Judging criteria: Taal & Laya accuracy (30%), Bhava & Abhinaya (30%), Choreography (20%), Costume & Stage Presence (20%).",
    ],
    eligibility: [
      "Open to bonafide undergraduate and postgraduate college students.",
      "Valid College ID card must be presented at the registration verification desk.",
      "Cross-college duos are permitted.",
    ],
    coordinators: [
      { name: "Ananya Mishra (Club Lead)", phone: "+91 98765 43210", email: "kathak@rangmanchup.in" },
      { name: "Rohit Verma (Joint Secy)", phone: "+91 98765 43211", email: "dance@rangmanchup.in" },
    ],
  },
  "royal-up-football-cup": {
    title: "Chhatrapati Shivaji Memorial Football Cup",
    slug: "royal-up-football-cup",
    category: "Sports & Athletics Arena",
    club: "Varchasva Sports Council",
    description:
      "The premier 11-a-side inter-collegiate football tournament in Uttar Pradesh. Features group stage league matches followed by knockout quarter-finals, semi-finals, and floodlit championship finale.",
    poster:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop",
    date: "12–15 March 2026",
    time: "08:00 AM – 06:00 PM",
    venue: "Main Stadium Turf, Ground A & B",
    registrationFee: 1500,
    participationType: "team",
    minTeamSize: 11,
    maxTeamSize: 16,
    prizePool: "₹75,000",
    prizes: [
      { rank: "Champions", amount: "₹45,000 + Rolling Championship Trophy + Gold Medals" },
      { rank: "Runners-Up", amount: "₹25,000 + Silver Medals" },
      { rank: "3rd Place", amount: "₹5,000 + Bronze Medals" },
      { rank: "Golden Boot & Best Goalkeeper", amount: "Individual Trophies" },
    ],
    rules: [
      "Matches will be conducted as per official FIFA guidelines adapted for college tourneys.",
      "Match duration: 35 minutes per half with 10-minute halftime break.",
      "All team members must wear matching jerseys with unique printed jersey numbers and shin guards.",
      "Rolling substitution allowed up to 5 substitutions per match.",
    ],
    eligibility: [
      "All squad players must be enrolled in the same university or collegiate institution.",
      "Team roster signed by the Director of Physical Education or Dean of Student Affairs.",
      "Minimum 11 players required for match kick-off.",
    ],
    coordinators: [
      { name: "Capt. Vikramaditya Singh (Sports Secy)", phone: "+91 94512 88990", email: "football@rangmanchup.in" },
      { name: "Tariq Khan (Varsity Coordinator)", phone: "+91 94512 88991", email: "sports@rangmanchup.in" },
    ],
  },
  "ghazal-and-kavi-sammelan": {
    title: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
    slug: "ghazal-and-kavi-sammelan",
    category: "Literary, Debating & Poetry",
    club: "Kalam Literary Society",
    description:
      "An enchanting evening honoring Hindi, Urdu, and Awadhi lyrical traditions under traditional Awadhi shamianas. Poets recite original ghazals, geet, and muktak.",
    poster:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    date: "14 March 2026",
    time: "07:00 PM – 10:30 PM",
    venue: "Heritage Open-Air Amphitheatre",
    registrationFee: 200,
    participationType: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
    prizePool: "₹25,000",
    prizes: [
      { rank: "1st Prize", amount: "₹15,000 + Kavi Ratna Trophy" },
      { rank: "2nd Prize", amount: "₹7,000 + Silver Plaque" },
      { rank: "3rd Prize", amount: "₹3,000 + Certificate" },
    ],
    rules: [
      "Original compositions only. Plagiarism leads to immediate disqualification.",
      "Time limit: 6 minutes per participant.",
      "Vulgarity, hate speech, or partisan political slander is strictly prohibited.",
    ],
    eligibility: [
      "Open to all enrolled undergraduate, postgraduate, and PhD scholars.",
      "College ID is mandatory.",
    ],
    coordinators: [
      { name: "Divya Pandey (Lit Society Head)", phone: "+91 98390 11223", email: "poetry@rangmanchup.in" },
    ],
  },
  "banarasi-handicraft-hackathon": {
    title: "Shilpkar: Traditional Crafts & 3D Design Challenge",
    slug: "banarasi-handicraft-hackathon",
    category: "Traditional Crafts & Design",
    club: "Akriti Fine Arts Club",
    description:
      "Modernizing GI-tagged Uttar Pradesh handicrafts (Banarasi silk, Moradabad brass, Firozabad glass) through digital commerce, AR previews, and 3D modeling.",
    poster:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop",
    date: "13 March 2026",
    time: "10:00 AM – 06:00 PM",
    venue: "Heritage Innovation Hub, Lab 3",
    registrationFee: 400,
    participationType: "team",
    minTeamSize: 2,
    maxTeamSize: 4,
    prizePool: "₹40,000",
    prizes: [
      { rank: "1st Prize", amount: "₹25,000 + Innovation Trophy" },
      { rank: "2nd Prize", amount: "₹15,000 + Certificate" },
    ],
    rules: [
      "Teams must build a digital prototype addressing preservation or market access for UP artisans.",
      "Presentations to a jury of National Institute of Design faculty and craft council heads.",
    ],
    eligibility: ["Open to all engineering, design, and business collegiate students."],
    coordinators: [
      { name: "Aditya Sharma (Arts Club Lead)", phone: "+91 97210 55443", email: "crafts@rangmanchup.in" },
    ],
  },
};

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = EVENT_DIRECTORY[params.slug] || {
    title: params.slug.replace(/-/g, " ").toUpperCase(),
    slug: params.slug,
    category: "Featured Festival Event",
    description: "Detailed description, rules and registration guidelines for this featured contest.",
    poster:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop",
    date: "13 March 2026",
    time: "10:00 AM",
    venue: "Main Campus Grounds, Lucknow",
    registrationFee: 200,
    participationType: "both",
    minTeamSize: 1,
    maxTeamSize: 4,
    prizePool: "₹25,000",
    prizes: [
      { rank: "1st Prize", amount: "₹15,000 + Trophy" },
      { rank: "2nd Prize", amount: "₹10,000 + Medal" },
    ],
    rules: [
      "Standard inter-collegiate festival rules apply.",
      "Reporting time: 30 minutes prior to scheduled start.",
      "Judges' decision will be final and binding.",
    ],
    eligibility: [
      "Valid College Student ID Card required.",
      "Students enrolled in recognized diploma/degree courses.",
    ],
    coordinators: [
      { name: "Fest Secretariat", phone: "+91 522 234 5678", email: "events@rangmanchup.in" },
    ],
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center text-xs font-bold text-fest-sunset hover:underline transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Events Catalog
        </Link>
      </div>

      {/* Main Grid: Details & Registration Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Full Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Banner with Layered Vignette */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-fest-gold/40 shadow-2xl h-80 sm:h-[420px]">
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/40 to-transparent" />
            <div className="absolute bottom-8 left-6 right-6 sm:left-8 sm:right-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest font-bold text-white bg-fest-sunset px-3 py-1 rounded-full font-sans shadow-md">
                  {event.category}
                </span>
                {event.club && (
                  <span className="text-xs uppercase tracking-wider font-bold text-fest-gold-light bg-fest-plum/90 px-3 py-1 rounded-full font-sans border border-fest-gold/40 backdrop-blur-sm">
                    Hosted by {event.club}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-fest-gold/30 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
              <FileText className="w-5 h-5 mr-2 text-fest-sunset" />
              Event Overview & Narrative
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
              {event.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-fest-gold/30 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-fest-sunset" />
              Rules & Guidelines
            </h2>
            <ul className="space-y-3">
              {event.rules.map((rule: string, i: number) => (
                <li key={i} className="flex items-start text-xs sm:text-sm text-foreground/90 font-sans">
                  <span className="inline-block w-5 h-5 rounded-full bg-fest-sunset/15 text-fest-sunset font-bold text-xs flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-fest-gold/30 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-fest-gold" />
              Eligibility
            </h2>
            <ul className="space-y-2">
              {event.eligibility.map((item: string, i: number) => (
                <li key={i} className="flex items-center text-xs sm:text-sm text-foreground/90 font-sans">
                  <span className="w-2 h-2 rounded-full bg-fest-sunset mr-3" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prizes Breakdown */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 border-2 border-fest-gold/40 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-fest-sunset" />
              Prizes & Citations ({event.prizePool})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {event.prizes.map((p: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-fest-gold/30 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-fest-sunset">{p.rank}</span>
                  <span className="text-xs font-medium text-foreground">{p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Registration Card */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="rounded-3xl bg-card border-2 border-fest-gold/60 p-6 sm:p-7 shadow-2xl space-y-6 glow-sunset">
            <div className="border-b border-border pb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-sans">
                Registration Fee
              </span>
              <div className="font-serif text-3xl font-black text-fest-burgundy dark:text-fest-gold mt-1">
                {event.registrationFee === 0 ? "Free Entry" : formatCurrency(event.registrationFee)}
              </div>
              <span className="text-[11px] text-fest-sunset font-semibold block mt-1 font-sans">
                Paytm QR & UPI verification processed 24/7
              </span>
            </div>

            {/* Quick Metadata */}
            <div className="space-y-3.5 text-xs text-foreground font-sans">
              <div className="flex items-start">
                <Calendar className="w-4 h-4 mr-3 text-fest-sunset flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Date</span>
                  <span className="text-muted-foreground">{event.date}</span>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-3 text-fest-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Time</span>
                  <span className="text-muted-foreground">{event.time}</span>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-fest-rose flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Venue</span>
                  <span className="text-muted-foreground">{event.venue}</span>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-4 h-4 mr-3 text-fest-sunset flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Format & Team Size</span>
                  <span className="text-muted-foreground">
                    {event.minTeamSize === event.maxTeamSize
                      ? `${event.minTeamSize} Participant`
                      : `${event.minTeamSize} – ${event.maxTeamSize} Participants`}
                  </span>
                </div>
              </div>
            </div>

            {/* Register CTA Button */}
            <Link
              href={`/events/${event.slug}/register`}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-fest-sunset via-fest-sunset-light to-fest-burgundy hover:brightness-110 text-white font-sans text-sm font-bold shadow-xl transition-all border border-fest-gold/50 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 glow-sunset"
            >
              <span>Register for this Event</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-center text-muted-foreground font-sans">
              Instant digital QR ticket generated upon approval.
            </p>

            {/* Coordinators */}
            <div className="pt-4 border-t border-border space-y-2">
              <span className="text-xs font-bold text-foreground block font-serif">
                Student Club Leads ({event.club || "Cultural Council"})
              </span>
              {event.coordinators.map((c: any, i: number) => (
                <div key={i} className="text-[11px] text-muted-foreground space-y-0.5 font-sans">
                  <p className="font-bold text-foreground">{c.name}</p>
                  <p>
                    {c.phone} • {c.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
