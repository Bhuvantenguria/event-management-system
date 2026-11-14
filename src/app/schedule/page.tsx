"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  CalendarDays,
  Filter,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const SCHEDULE_DATA = [
  // Day 1
  {
    id: 1,
    day: 1,
    date: "Thursday, 12 March 2026",
    startTime: "09:30 AM",
    endTime: "10:30 AM",
    title: "Ganga Aarti, Shloka Recitation & Deep Prajjwalan",
    category: "Ceremony",
    venue: "Central Quadrangle (Open Air)",
    description: "Traditional auspicious commencement with classical conch and Ganga Aarti rituals.",
  },
  {
    id: 2,
    day: 1,
    date: "Thursday, 12 March 2026",
    startTime: "11:00 AM",
    endTime: "01:30 PM",
    title: "Football Tournament: Group Stage Fixtures (Matches 1-4)",
    category: "Sports",
    venue: "Main Sports Turf",
    description: "Opening league round for the Chhatrapati Shivaji Trophy.",
  },
  {
    id: 3,
    day: 1,
    date: "Thursday, 12 March 2026",
    startTime: "02:00 PM",
    endTime: "04:30 PM",
    title: "All-India Youth Parliamentary Debate – Preliminary Round",
    category: "Literary",
    venue: "Senate Hall",
    description: "Parliamentary bill debate simulation on Cultural Preservation in the Digital Era.",
  },
  {
    id: 4,
    day: 1,
    date: "Thursday, 12 March 2026",
    startTime: "05:30 PM",
    endTime: "08:30 PM",
    title: "Kathak Jugalbandi – Lucknow & Banaras Gharana Showcase",
    category: "Cultural",
    venue: "Nawab Wajid Ali Shah Auditorium",
    description: "Competitive classical dance showcase accompanied by live tabla and harmonium.",
  },
  {
    id: 5,
    day: 1,
    date: "Thursday, 12 March 2026",
    startTime: "08:30 PM",
    endTime: "10:30 PM",
    title: "Awadhi Dastarkhwan & Classical Qawwali Night",
    category: "Cultural",
    venue: "Royal Courtyard",
    description: "A cultural banquet and mystical Sufi Qawwali recital under lantern light.",
  },

  // Day 2
  {
    id: 6,
    day: 2,
    date: "Friday, 13 March 2026",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    title: "Chhatrapati Shivaji Football Trophy: Quarter-Finals",
    category: "Sports",
    venue: "Main Stadium Turf",
    description: "Top 8 teams clash in high-octane 70-minute knockout battles.",
  },
  {
    id: 7,
    day: 2,
    date: "Friday, 13 March 2026",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    title: "Shilpkar: Traditional Crafts & 3D Hackathon",
    category: "Technical",
    venue: "Heritage Innovation Pavilion",
    description: "Modernizing UP GI-tagged handicrafts through digital commerce and 3D modeling.",
  },
  {
    id: 8,
    day: 2,
    date: "Friday, 13 March 2026",
    startTime: "04:30 PM",
    endTime: "06:30 PM",
    title: "Braj Mayur Nritya & Peacock Folklore Recital",
    category: "Cultural",
    venue: "Amphitheatre",
    description: "Enchanting folk dance depicting the Krishna-Radha Raas Leela from Mathura.",
  },
  {
    id: 9,
    day: 2,
    date: "Friday, 13 March 2026",
    startTime: "07:30 PM",
    endTime: "11:00 PM",
    title: "Roohaniyat: Pan-India Battle of Sufi Fusion Bands",
    category: "Cultural",
    venue: "Main Festival Arena",
    description: "Electric guitars blend with harmonium and tabla in an electrifying battle of bands.",
  },

  // Day 3
  {
    id: 10,
    day: 3,
    date: "Saturday, 14 March 2026",
    startTime: "08:30 AM",
    endTime: "12:30 PM",
    title: "Football & Cricket Semi-Finals",
    category: "Sports",
    venue: "Sports Complex",
    description: "Final four squads contest for a spot in Sunday's title match.",
  },
  {
    id: 11,
    day: 3,
    date: "Saturday, 14 March 2026",
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    title: "Banarasi & Chikankari Haute Couture Runway",
    category: "Cultural",
    venue: "Auditorium Main",
    description: "Student designers showcase heritage silhouettes styled with traditional UP textiles.",
  },
  {
    id: 12,
    day: 3,
    date: "Saturday, 14 March 2026",
    startTime: "06:00 PM",
    endTime: "09:00 PM",
    title: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
    category: "Literary",
    venue: "Heritage Open-Air Amphitheatre",
    description: "Celebrated poets recite classical and contemporary Hindi/Urdu verses.",
  },
  {
    id: 13,
    day: 3,
    date: "Saturday, 14 March 2026",
    startTime: "09:30 PM",
    endTime: "11:30 PM",
    title: "Illuminated Lantern Festival & EDM Fusion",
    category: "Cultural",
    venue: "Star Arena Grounds",
    description: "Synchronized lighting and electronic folk beats celebrating youth energy.",
  },

  // Day 4
  {
    id: 14,
    day: 4,
    date: "Sunday, 15 March 2026",
    startTime: "10:30 AM",
    endTime: "01:00 PM",
    title: "Grand Football Trophy Final Clash",
    category: "Sports",
    venue: "Main Stadium Turf",
    description: "The championship finale for the Chhatrapati Shivaji Memorial Trophy.",
  },
  {
    id: 15,
    day: 4,
    date: "Sunday, 15 March 2026",
    startTime: "03:30 PM",
    endTime: "06:00 PM",
    title: "Valedictory Ceremony & ₹5 Lakh Prize Awards",
    category: "Ceremony",
    venue: "Auditorium Main",
    description: "Official award ceremony felicitating champions with trophies and citations.",
  },
  {
    id: 16,
    day: 4,
    date: "Sunday, 15 March 2026",
    startTime: "07:30 PM",
    endTime: "11:00 PM",
    title: "Bollywood & Sufi Headline Star Night",
    category: "Celebrity",
    venue: "Grand Open Stadium",
    description: "Sensational live musical concert bringing AffinityAIIMS 2026 to a magnificent finale.",
  },
];

export default function FestivalSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Ceremony", "Cultural", "Sports", "Literary", "Technical", "Celebrity"];

  const filteredEvents = SCHEDULE_DATA.filter((item) => {
    const matchesDay = selectedDay === 0 || item.day === selectedDay;
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesDay && matchesCategory;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          Festival Itinerary & Timetable
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          4-Day <span className="sunset-gradient-text">Festival Schedule</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          Plan your four days across sacred ceremonies, competitive collegiate arenas, royal culinary feasts, and star concerts.
        </p>
      </div>

      {/* Day Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {[
          { day: 1, label: "Day 1", date: "12 Mar", theme: "Awadh Mahotsav" },
          { day: 2, label: "Day 2", date: "13 Mar", theme: "Kashi Kala & Innovation" },
          { day: 3, label: "Day 3", date: "14 Mar", theme: "Sports & Shaam-e-Awadh" },
          { day: 4, label: "Day 4", date: "15 Mar", theme: "Grand Finals & Star Night" },
        ].map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
              selectedDay === d.day
                ? "bg-gradient-to-br from-fest-sunset to-fest-burgundy text-white border-fest-gold shadow-xl glow-sunset scale-105"
                : "bg-card border-fest-gold/30 hover:border-fest-sunset text-foreground hover:bg-fest-champagne/30"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-black text-sm">{d.label}</span>
              <span
                className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                  selectedDay === d.day ? "bg-white/20 text-white" : "bg-fest-sunset/10 text-fest-sunset"
                }`}
              >
                {d.date}
              </span>
            </div>
            <p className="text-xs font-serif font-medium line-clamp-1">{d.theme}</p>
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto max-w-full pb-1 scrollbar-none px-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === c
                ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-sm"
                : "bg-background text-foreground hover:border-fest-sunset border border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Timeline Events List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-fest-gold/40 space-y-8 max-w-4xl ml-4 sm:mx-auto">
        {filteredEvents.map((item) => (
          <div key={item.id} className="relative group">
            {/* Glowing Timeline Marker */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-fest-charcoal border-2 border-fest-sunset flex items-center justify-center shadow-[0_0_10px_#E87545] group-hover:scale-125 transition-transform">
              <div className="w-2 h-2 rounded-full bg-fest-gold" />
            </div>

            {/* Event Card */}
            <div className="rounded-2xl bg-card border border-fest-gold/30 hover:border-fest-sunset p-6 shadow-sm hover:shadow-lg transition-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center text-xs font-bold font-sans text-fest-sunset bg-fest-sunset/10 px-3 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {item.startTime} – {item.endTime}
                  </span>
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-fest-plum/10 text-fest-burgundy dark:text-fest-gold border border-fest-gold/30 uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground font-sans">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-fest-gold" />
                  <span>{item.venue}</span>
                </div>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-fest-sunset transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
