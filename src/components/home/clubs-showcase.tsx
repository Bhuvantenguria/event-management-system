"use client";

import React from "react";
import Link from "next/link";
import {
  Music,
  Users2,
  Theater,
  Flame,
  BookOpen,
  Brush,
  Trophy,
  Code,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const COLLEGE_CLUBS = [
  {
    id: "mudra",
    name: "Mudra Dance Society",
    motto: "Rhythms of Kathak & Classical Grace",
    category: "Dance & Performing Arts",
    icon: Flame,
    color: "from-fest-sunset to-fest-burgundy",
    coordinator: "Ananya Mishra (Final Year B.Tech)",
    eventsHosted: ["Kathak Jugalbandi", "Braj Mayur Nritya", "Western Choreo Night"],
    eventCount: "6 Contests",
    prizes: "₹1,25,000",
    href: "/events?category=cultural",
    badge: "Est. 2012 • 45 Active Dancers",
  },
  {
    id: "dhwani",
    name: "Dhwani Music & Band Society",
    motto: "Hindustani Vocals to Electric Sufi Riffs",
    category: "Music & Band Battles",
    icon: Music,
    color: "from-fest-burgundy to-fest-plum",
    coordinator: "Kabir Sengupta (3rd Year B.Sc)",
    eventsHosted: ["Roohaniyat Sufi Rock", "Kashi Raga Solo", "Unplugged Acoustic"],
    eventCount: "8 Contests",
    prizes: "₹95,000",
    href: "/events?category=music",
    badge: "Campus Band & Choir",
  },
  {
    id: "natraj",
    name: "Natraj Dramatics Club",
    motto: "Street Nukkad Natak to Awadhi Court Plays",
    category: "Theatre & Dramatics",
    icon: Theater,
    color: "from-fest-plum to-fest-charcoal",
    coordinator: "Devendra Rathore (4th Year BA)",
    eventsHosted: ["Nukkad Natak (Street Play)", "Stage Play Competition", "Mono-Acting"],
    eventCount: "5 Contests",
    prizes: "₹80,000",
    href: "/events?category=cultural",
    badge: "State Award Winning Troupe",
  },
  {
    id: "kalam",
    name: "Kalam Literary & Debating Society",
    motto: "Shaam-e-Awadh Shayari to Parliamentary Debates",
    category: "Literary, Poetry & Debates",
    icon: BookOpen,
    color: "from-fest-rose to-fest-burgundy",
    coordinator: "Divya Pandey (Postgrad English)",
    eventsHosted: ["Shaam-e-Awadh Kavi Sammelan", "All-India Youth Parliament", "Turncoat Debate"],
    eventCount: "7 Contests",
    prizes: "₹65,000",
    href: "/events?category=literary",
    badge: "Official College MUN & Lit Wing",
  },
  {
    id: "akriti",
    name: "Akriti Fine Arts & Heritage Crafts Club",
    motto: "Preserving Banarasi Weaves & Chikankari Design",
    category: "Fine Arts & Design",
    icon: Brush,
    color: "from-fest-gold to-fest-sunset",
    coordinator: "Aditya Sharma (Design Scholar)",
    eventsHosted: ["Shilpkar 3D Design Challenge", "Live Clay Pottery", "Couture Runway"],
    eventCount: "8 Contests",
    prizes: "₹70,000",
    href: "/events?category=heritage_arts",
    badge: "Craft Guild Partners",
  },
  {
    id: "varchasva",
    name: "Varchasva Sports Council",
    motto: "Pride, Passion & Varsity Athletics",
    category: "Sports Tournaments",
    icon: Trophy,
    color: "from-fest-green to-fest-charcoal",
    coordinator: "Capt. Vikramaditya Singh",
    eventsHosted: ["Chhatrapati Shivaji Football Cup", "Major Dhyan Chand Cricket", "Awadh Basketball"],
    eventCount: "6 Tournaments",
    prizes: "₹1,20,000",
    href: "/sports",
    badge: "Varsity Sports Wing",
  },
  {
    id: "bytecraft",
    name: "ByteCraft Tech & Innovation Club",
    motto: "Building the Future of Heritage & Tourism Tech",
    category: "Tech & Hackathons",
    icon: Code,
    color: "from-orange-600 to-fest-charcoal",
    coordinator: "Rohan Gupta (3rd Year CSE)",
    eventsHosted: ["Navotsav AI Tourism Sprint", "3D Monument VR Lab", "Esports Kurukshetra"],
    eventCount: "9 Contests",
    prizes: "₹85,000",
    href: "/events?category=technical",
    badge: "Campus Developers Guild",
  },
];

export function ClubsShowcase() {
  return (
    <section id="clubs-showcase" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
      <HeritageDivider
        subtitle="The Student Societies Behind The Fest"
        title="College Cultural Clubs"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-14 font-sans">
        AffinityAIIMS is 100% ideated, organized, and managed by our student cultural clubs. Each club curates competitions, invites national judges, and allocates college championship trophy points.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COLLEGE_CLUBS.map((club) => {
          const Icon = club.icon;
          return (
            <div
              key={club.id}
              className="group rounded-3xl bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-sm hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Club Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${club.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-sans font-bold px-2.5 py-1 rounded-full bg-fest-sunset/10 text-fest-sunset border border-fest-sunset/20">
                    {club.badge}
                  </span>
                </div>

                <span className="text-[11px] font-sans font-bold text-fest-gold uppercase tracking-wider block">
                  {club.category}
                </span>

                <h3 className="font-serif text-xl font-black text-foreground group-hover:text-fest-sunset transition-colors mt-0.5 mb-1.5">
                  {club.name}
                </h3>

                <p className="text-xs text-muted-foreground italic font-serif mb-4">
                  “{club.motto}”
                </p>

                {/* Key Contests Hosted by this Club */}
                <div className="space-y-1.5 py-3 border-y border-border/70 text-xs font-sans">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Competitions Curated by Club:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {club.eventsHosted.map((event) => (
                      <span
                        key={event}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-fest-champagne/40 dark:bg-fest-charcoal text-foreground border border-border"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Student Lead Coordinator */}
                <div className="pt-3 text-[11px] text-muted-foreground font-sans">
                  <span className="font-bold text-foreground">Club Lead: </span>
                  <span>{club.coordinator}</span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Prize Pool
                  </span>
                  <span className="font-serif font-black text-sm text-fest-sunset">
                    {club.prizes}
                  </span>
                </div>

                <Link
                  href={club.href}
                  className="px-3.5 py-1.5 rounded-xl bg-fest-sunset/15 text-fest-sunset hover:bg-fest-sunset hover:text-white font-sans text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <span>View Contests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* College Trophy Banner */}
      <div className="mt-10 sm:mt-14 rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-fest-burgundy via-fest-plum to-fest-charcoal text-white border-2 border-fest-gold/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-full overflow-hidden">
        <div className="space-y-2 text-left max-w-full">
          <div className="inline-flex max-w-full items-center space-x-2 px-3 py-1 rounded-full bg-fest-sunset/20 text-fest-sunset text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">The Rolling Inter-Collegiate Fest Trophy</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-black break-words">
            Does Your College Club Have What It Takes?
          </h4>
          <p className="text-xs sm:text-sm text-fest-champagne/80 font-sans max-w-xl leading-relaxed">
            Points earned across Dance, Music, Theatre, Literary, Fine Arts, and Sports club competitions tally towards the grand <strong>Overall College Championship Rolling Trophy</strong>.
          </p>
        </div>

        <Link
          href="/events"
          className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white font-sans text-xs font-bold shadow-xl hover:brightness-110 flex items-center justify-center space-x-2 shrink-0 border border-fest-gold/40 glow-sunset"
        >
          <span>Register College Contingent</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
