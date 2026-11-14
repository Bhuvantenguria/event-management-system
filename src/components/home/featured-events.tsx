"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  Music,
  Code,
  Flame,
  BookOpen,
  Gamepad2,
  Brush,
  Filter,
  Users2,
} from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { formatCurrency } from "@/lib/utils";

export const SAMPLE_CATEGORIES = [
  { id: "all", name: "All Club Events", icon: Sparkles },
  { id: "cultural", name: "Dance & Choreo", icon: Flame },
  { id: "music", name: "Music & Bands", icon: Music },
  { id: "sports", name: "Sports Cups", icon: Trophy },
  { id: "literary", name: "Lit & Debating", icon: BookOpen },
  { id: "heritage_arts", name: "Fine Arts & Design", icon: Brush },
  { id: "technical", name: "Tech & Hackathons", icon: Code },
];

export const SAMPLE_FEATURED_EVENTS = [
  {
    id: "kathak-jugalbandi",
    slug: "kathak-jugalbandi",
    title: "Kathak Jugalbandi – Classical Dance Confluence",
    categoryKey: "cultural",
    category: "Dance & Choreo",
    club: "Mudra Dance Society",
    description:
      "A celebration of the Lucknow & Banaras Gharana rhythms with live tabla accompaniment and footwork precision.",
    date: "13 March 2026",
    time: "05:00 PM",
    venue: "Nawab Wajid Ali Shah Auditorium",
    registrationFee: 300,
    teamSize: "1–2 Dancers",
    prizePool: "₹35,000",
    poster:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "royal-up-football-cup",
    slug: "royal-up-football-cup",
    title: "Chhatrapati Shivaji Memorial Football Cup",
    categoryKey: "sports",
    category: "Sports Tournaments",
    club: "Varchasva Sports Council",
    description:
      "11-a-side knockout collegiate championship with group fixtures, live stats tracking, and golden boot awards.",
    date: "12–15 March 2026",
    time: "08:00 AM",
    venue: "Main Stadium Turf",
    registrationFee: 1500,
    teamSize: "11 + 5 Substitutes",
    prizePool: "₹75,000",
    poster:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "sufi-rock-night",
    slug: "sufi-rock-night",
    title: "Roohaniyat: Pan-India Battle of Sufi Bands",
    categoryKey: "music",
    category: "Music & Bands",
    club: "Dhwani Music Society",
    description:
      "Electric guitars meet harmonium and tabla in an electrifying battle of bands between top collegiate squads.",
    date: "14 March 2026",
    time: "07:30 PM",
    venue: "Main Festival Arena",
    registrationFee: 800,
    teamSize: "3–8 Musicians",
    prizePool: "₹50,000",
    poster:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "ghazal-and-kavi-sammelan",
    slug: "ghazal-and-kavi-sammelan",
    title: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
    categoryKey: "literary",
    category: "Lit & Debating",
    club: "Kalam Literary Society",
    description:
      "Original Hindi poetry, Awadhi folklore recitals, and classical Urdu Nazm rendered under illuminated courtyard lanterns.",
    date: "14 March 2026",
    time: "07:00 PM",
    venue: "Amphitheatre (Open Air)",
    registrationFee: 200,
    teamSize: "Solo Poet",
    prizePool: "₹25,000",
    poster:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "banarasi-handicraft-hackathon",
    slug: "banarasi-handicraft-hackathon",
    title: "Shilpkar: Traditional Crafts & 3D Design Challenge",
    categoryKey: "heritage_arts",
    category: "Fine Arts & Design",
    club: "Akriti Fine Arts Club",
    description:
      "Modernizing GI-tagged Uttar Pradesh handicrafts (Banarasi silk, Moradabad brass) through digital commerce and 3D modeling.",
    date: "13 March 2026",
    time: "10:00 AM",
    venue: "Heritage Innovation Hub, Lab 3",
    registrationFee: 400,
    teamSize: "2–4 Designers",
    prizePool: "₹40,000",
    poster:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "ai-heritage-hackathon",
    slug: "ai-heritage-hackathon",
    title: "Navotsav: AI for UP Tourism & Heritage",
    categoryKey: "technical",
    category: "Tech & Hackathons",
    club: "ByteCraft Tech Society",
    description:
      "36-hour hackathon building generative AI tour guides, VR ghat experiences, and handicraft authenticity verification.",
    date: "13–14 March 2026",
    time: "09:00 AM",
    venue: "Turing Tech Pavilion",
    registrationFee: 500,
    teamSize: "2–4 Hackers",
    prizePool: "₹60,000",
    poster:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
];

export function FeaturedEvents() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredEvents =
    activeTab === "all"
      ? SAMPLE_FEATURED_EVENTS
      : SAMPLE_FEATURED_EVENTS.filter((e) => e.categoryKey === activeTab);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40 overflow-hidden">
      <HeritageDivider
        subtitle="Competitions & Showcases"
        title="Featured Inter-College Contests"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-10 font-sans">
        Competitions organized by our student cultural clubs with certified national judges, official trophies, and points toward the Overall College Fest Rolling Cup.
      </p>

      {/* Interactive Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
        {SAMPLE_CATEGORIES.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-md glow-sunset scale-105"
                  : "bg-card hover:bg-fest-champagne/40 border border-fest-gold/30 text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="group rounded-3xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div>
              {/* Event Poster with Gradient Overlay */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/30 to-transparent" />

                <div className="absolute top-3.5 left-3.5 flex items-center space-x-2">
                  <span className="bg-fest-sunset text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md font-sans">
                    {event.status}
                  </span>
                </div>

                {/* Organizing Club Badge on Poster */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="text-[10px] font-sans font-bold text-fest-gold-light bg-fest-plum/90 px-2.5 py-1 rounded-lg border border-fest-gold/30 backdrop-blur-sm">
                    {event.club}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="text-xs font-serif font-black text-fest-gold-light bg-fest-charcoal/80 px-2.5 py-1 rounded-lg border border-fest-gold/30 backdrop-blur-sm">
                    Prize: {event.prizePool}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans font-black text-fest-sunset uppercase tracking-wider block">
                    {event.category}
                  </span>
                  <span className="text-[10px] font-sans font-semibold text-muted-foreground">
                    Trophy Event
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-fest-sunset transition-colors">
                  {event.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-3 border-t border-border/70 space-y-2 text-xs text-foreground/80 font-sans">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-fest-sunset flex-shrink-0" />
                    <span>
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-fest-gold flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-2 text-fest-rose flex-shrink-0" />
                    <span>Format: {event.teamSize}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Fee & CTA */}
            <div className="p-6 pt-0 mt-2">
              <div className="flex items-center justify-between pt-4 border-t border-border/70">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans font-semibold">
                    Registration Fee
                  </span>
                  <span className="font-serif text-base font-black text-fest-burgundy dark:text-fest-gold">
                    {event.registrationFee === 0
                      ? "Free Entry"
                      : formatCurrency(event.registrationFee)}
                  </span>
                </div>

                <Link
                  href={`/events/${event.slug}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white hover:brightness-110 text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 group-hover:shadow-[0_0_12px_rgba(232,117,69,0.4)]"
                >
                  <span>Details & Register</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center px-2">
        <Link
          href="/events"
          className="inline-flex max-w-full items-center justify-center space-x-2.5 px-5 sm:px-8 py-3.5 rounded-xl bg-fest-plum hover:bg-fest-burgundy text-white text-xs sm:text-sm font-bold border border-fest-gold/40 shadow-xl transition-all transform hover:-translate-y-0.5 text-center"
        >
          <span className="break-words">View All 40+ Competitions &amp; Register</span>
          <ArrowRight className="w-4 h-4 text-fest-sunset shrink-0" />
        </Link>
      </div>
    </section>
  );
}
