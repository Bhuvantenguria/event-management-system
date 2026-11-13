"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SAMPLE_FEATURED_EVENTS, SAMPLE_CATEGORIES } from "@/components/home/featured-events";
import { formatCurrency } from "@/lib/utils";

// Comprehensive events list spanning all categories
const ALL_EVENTS = [
  ...SAMPLE_FEATURED_EVENTS,
  {
    id: "nawabi-dastarkhwan-cookoff",
    slug: "nawabi-dastarkhwan-cookoff",
    title: "Zaika-e-Awadh: Culinary Arts Showcase",
    categoryKey: "heritage_arts",
    category: "Fine Arts & Design",
    club: "Akriti Crafts & Culinary Club",
    description:
      "A live Masterchef style cook-off celebrating authentic Awadhi spices, Dum cooking techniques, and Shahi desserts.",
    date: "14 March 2026",
    time: "11:00 AM",
    venue: "Heritage Food Court Arena",
    registrationFee: 500,
    teamSize: "2 Participants",
    prizePool: "₹30,000",
    poster:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "national-youth-parliament",
    slug: "national-youth-parliament",
    title: "Lok Sabha: All-India Collegiate Parliamentary Debate",
    categoryKey: "literary",
    category: "Lit & Debating",
    club: "Kalam Literary Society",
    description:
      "A high-octane 3-day simulated parliamentary debate addressing federal cultural policy, heritage preservation, and economic modernization.",
    date: "13–14 March 2026",
    time: "09:30 AM",
    venue: "Senate Hall",
    registrationFee: 250,
    teamSize: "Individual or Duo",
    prizePool: "₹45,000",
    poster:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "inter-college-cricket-trophy",
    slug: "inter-college-cricket-trophy",
    title: "Major Dhyan Chand Memorial T20 Cricket Cup",
    categoryKey: "sports",
    category: "Sports Tournaments",
    club: "Varchasva Sports Council",
    description:
      "T20 leather-ball collegiate championship with official umpires, live ball-by-ball score tracking, and trophy presentation.",
    date: "12–15 March 2026",
    time: "09:00 AM",
    venue: "Cricket Ground Oval",
    registrationFee: 2000,
    teamSize: "11 + 4 Substitutes",
    prizePool: "₹80,000",
    poster:
      "https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "folk-fusion-band-war",
    slug: "folk-fusion-band-war",
    title: "Dhun: Eastern Classical & Rock Fusion Battle of the Bands",
    categoryKey: "cultural",
    category: "Music & Bands",
    club: "Dhwani Music Society",
    description:
      "Bands blend traditional Indian instruments (Sitar, Sarod, Tabla, Flute) with modern electric guitar and drums.",
    date: "14 March 2026",
    time: "06:00 PM",
    venue: "Main Concert Grounds",
    registrationFee: 600,
    teamSize: "4–8 Members",
    prizePool: "₹60,000",
    poster:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
  {
    id: "esports-valorant-championship",
    slug: "esports-valorant-championship",
    title: "Kurukshetra: Inter-Collegiate Valorant LAN Championship",
    categoryKey: "technical",
    category: "Tech & Hackathons",
    club: "ByteCraft Tech Club",
    description:
      "5v5 tactical shooter tournament hosted on dedicated low-latency fiber network in the e-sports amphitheatre.",
    date: "13 March 2026",
    time: "11:00 AM",
    venue: "Gaming Arena Lab 1",
    registrationFee: 500,
    teamSize: "5 Players",
    prizePool: "₹35,000",
    poster:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  },
];

export default function EventsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all"); // 'all' | 'free' | 'paid'

  const filteredEvents = ALL_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      event.categoryKey === selectedCategory ||
      event.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesFee =
      feeFilter === "all" ||
      (feeFilter === "free" && event.registrationFee === 0) ||
      (feeFilter === "paid" && event.registrationFee > 0);

    return matchesSearch && matchesCategory && matchesFee;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          Fest Competitions & Contests
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          Explore All <span className="sunset-gradient-text">Festival Events</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          Discover over 40+ competitive events spanning classical arts, debate, sports, hackathons, and folklore. Individual and team registrations available.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-fest-gold/30 rounded-2xl p-5 sm:p-7 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-fest-sunset absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event title, venue, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
            />
          </div>

          {/* Fee Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-muted-foreground font-sans font-semibold">Fee:</span>
            {["all", "paid", "free"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFeeFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                  feeFilter === filter
                    ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-sm"
                    : "bg-fest-champagne/30 dark:bg-fest-charcoal text-foreground hover:bg-fest-champagne/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {SAMPLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-md glow-gold"
                    : "bg-background border border-border text-foreground hover:border-fest-sunset"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-sans px-2">
        <span>
          Showing <strong className="text-foreground">{filteredEvents.length}</strong> events
        </span>
        {(searchQuery || selectedCategory !== "all" || feeFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setFeeFilter("all");
            }}
            className="text-fest-sunset hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-fest-gold/40 p-8 space-y-3">
          <p className="font-serif text-lg font-bold text-foreground">
            No events found matching your criteria.
          </p>
          <p className="text-xs text-muted-foreground font-sans">
            Try adjusting your search keywords or clearing your category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Event Poster with Gradient */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/90 via-fest-charcoal/20 to-transparent" />

                  <span className="absolute top-3.5 left-3.5 bg-fest-sunset text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                    {event.status}
                  </span>

                  {event.club && (
                    <span className="absolute top-3.5 right-3.5 text-[10px] font-sans font-bold text-fest-gold-light bg-fest-plum/90 px-2.5 py-1 rounded-lg border border-fest-gold/30 backdrop-blur-sm">
                      {event.club}
                    </span>
                  )}

                  <span className="absolute bottom-3 right-3 text-xs font-bold font-serif text-fest-gold-light bg-fest-charcoal/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-fest-gold/30">
                    Prize: {event.prizePool}
                  </span>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-3">
                  <span className="text-[11px] font-sans font-bold text-fest-sunset uppercase tracking-wider block">
                    {event.category}
                  </span>

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
                      <span>Team: {event.teamSize}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Fee & CTA */}
              <div className="p-6 pt-0 mt-2">
                <div className="flex items-center justify-between pt-4 border-t border-border/70">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-semibold">
                      Fee
                    </span>
                    <span className="font-serif text-base font-black text-fest-burgundy dark:text-fest-gold">
                      {event.registrationFee === 0
                        ? "Free Entry"
                        : formatCurrency(event.registrationFee)}
                    </span>
                  </div>

                  <Link
                    href={`/events/${event.slug}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <span>Details & Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
