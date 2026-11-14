"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Music,
  Trophy,
  Flame,
  Award,
} from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const FESTIVAL_DAYS = [
  {
    dayNumber: "Day 1",
    shortDate: "12 Mar",
    date: "Thursday, 12 March 2026",
    theme: "आगमन • Awadh Mahotsav & Inaugural Gala",
    tagline: "Sacred fire invocation, Lucknow gharana inaugurals, and royal hospitality.",
    events: [
      {
        time: "09:30 AM",
        title: "Traditional Ganga Aarti & Deep Prajjwalan",
        category: "Ceremony",
        venue: "Central Courtyard & Sacred Pool",
        description: "Inaugural lighting of 1,008 earthen lamps accompanied by Vedic conch chanting and Shehnai.",
      },
      {
        time: "11:30 AM",
        title: "Chhatrapati Shivaji Memorial Trophy: Opening Matches",
        category: "Sports Arena",
        venue: "Main Stadium Turf",
        description: "Group stage football clashes between 16 varsity squads with live scorekeeping.",
      },
      {
        time: "04:30 PM",
        title: "Kathak Jugalbandi – Lucknow Gharana Showcase",
        category: "Classical Arts",
        venue: "Nawab Wajid Ali Shah Auditorium",
        description: "Footwork precision, chakkars, and live accompaniment by maestros on Tabla and Pakhawaj.",
      },
      {
        time: "07:30 PM",
        title: "Awadhi Dastarkhwan & Classical Qawwali Night",
        category: "Culture & Cuisine",
        venue: "Royal Banquet Lawns",
        description: "Authentic Awadhi vegetarian delicacies followed by Nizami Brothers' spiritual qawwali.",
      },
    ],
  },
  {
    dayNumber: "Day 2",
    shortDate: "13 Mar",
    date: "Friday, 13 March 2026",
    theme: "सृजन • Kashi Kala, Debate & Innovation",
    tagline: "Intellectual debates, 3D handicraft hackathons, and vibrant Braj folklore.",
    events: [
      {
        time: "10:00 AM",
        title: "All-India Youth Parliamentary Debate",
        category: "Literary",
        venue: "Conference Hall A",
        description: "Passionate parliamentary debate on preserving India's heritage while driving digital economy.",
      },
      {
        time: "01:30 PM",
        title: "Shilpkar: Traditional Crafts & 3D Design Challenge",
        category: "Tech & Crafts",
        venue: "Innovation Pavilion Lab 2",
        description: "36-hour sprint creating modern AR/VR experiences and marketplace tech for UP GI-tagged crafts.",
      },
      {
        time: "04:30 PM",
        title: "Braj Mayur Nritya & Folk Troupe",
        category: "Folk Arts",
        venue: "Open Air Amphitheatre",
        description: "Enchanting peacock dance and Holi folklore from the sacred groves of Mathura-Vrindavan.",
      },
      {
        time: "08:00 PM",
        title: "Sufi & Folk Fusion Rock Band Battle",
        category: "Music Battle",
        venue: "Grand Festival Grounds",
        description: "Top collegiate fusion bands blending classical poetry with electric riffs.",
      },
    ],
  },
  {
    dayNumber: "Day 3",
    shortDate: "14 Mar",
    date: "Saturday, 14 March 2026",
    theme: "शौर्य • Sports Knockouts & Shaam-e-Awadh",
    tagline: "High-voltage football semi-finals, couture runways, and ghazal poetry.",
    events: [
      {
        time: "08:30 AM",
        title: "Football & Athletics Semi-Finals",
        category: "Sports Arena",
        venue: "Sports Complex",
        description: "Intense knockout matches deciding the top 2 contenders for Sunday's trophy.",
      },
      {
        time: "02:30 PM",
        title: "Chikankari & Banarasi Textile Couture Runway",
        category: "Fashion & Textile",
        venue: "Auditorium Main",
        description: "Student fashion designers showcase contemporary silhouettes styled with traditional UP weaves.",
      },
      {
        time: "06:30 PM",
        title: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
        category: "Poetry",
        venue: "Heritage Amphitheatre",
        description: "Celebrated poets and young laureates recite classical Nazm, Doha, and couplets under royal lanterns.",
      },
      {
        time: "09:00 PM",
        title: "Illuminated Lantern Festival & DJ Fusion",
        category: "Night Experience",
        venue: "Star Arena",
        description: "Sky lanterns over the campus lake set to melodic fusion and ambient electronic grooves.",
      },
    ],
  },
  {
    dayNumber: "Day 4",
    shortDate: "15 Mar",
    date: "Sunday, 15 March 2026",
    theme: "उत्कर्ष • Grand Finals & Celebrity Star Night",
    tagline: "Championship crowning, ₹5 Lakh award ceremonies, and headline star performance.",
    events: [
      {
        time: "10:30 AM",
        title: "Grand Football Trophy Final Clash",
        category: "Championship",
        venue: "Main Stadium Turf",
        description: "The championship finale battle for the prestigious Chhatrapati Shivaji Memorial Trophy.",
      },
      {
        time: "03:30 PM",
        title: "Valedictory Ceremony & ₹5 Lakh Prize Awards",
        category: "Ceremony",
        venue: "Main Auditorium",
        description: "Distinguished guests and state cultural dignitaries award medals, trophies, and cash prizes.",
      },
      {
        time: "07:30 PM",
        title: "Star Night 2026: Bollywood & Sufi Live Concert",
        category: "Mega Concert",
        venue: "Grand Open Stadium",
        description: "Unforgettable musical finale featuring headline artist performances and pyrotechnic spectacle.",
      },
    ],
  },
];

export function SchedulePreview() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const currentDay = FESTIVAL_DAYS[activeDayIndex];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
      <HeritageDivider
        subtitle="Four Days of Living Culture"
        title="Interactive Festival Itinerary"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-10 font-sans">
        Explore day-by-day highlights spanning sacred inaugurals, collegiate showdowns, royal feasts, and star-studded concerts.
      </p>

      {/* Interactive Day Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
        {FESTIVAL_DAYS.map((day, idx) => {
          const isSelected = activeDayIndex === idx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`p-3.5 rounded-2xl transition-all duration-300 text-left border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-br from-fest-sunset to-fest-burgundy text-white border-fest-gold shadow-xl glow-sunset scale-105"
                  : "bg-card border-fest-gold/30 hover:border-fest-sunset text-foreground hover:bg-fest-champagne/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-black text-sm">{day.dayNumber}</span>
                <span
                  className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-fest-sunset/10 text-fest-sunset"
                  }`}
                >
                  {day.shortDate}
                </span>
              </div>
              <p
                className={`text-xs font-serif font-medium line-clamp-1 ${
                  isSelected ? "text-fest-gold-light" : "text-muted-foreground"
                }`}
              >
                {day.theme.split("•")[0]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Day Theme Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-fest-burgundy via-fest-plum to-fest-charcoal text-fest-champagne border border-fest-gold/40 shadow-xl mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-fest-gold tracking-widest font-sans">
              {currentDay.date}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white mt-1">
              {currentDay.theme}
            </h3>
            <p className="text-xs sm:text-sm text-fest-champagne/80 font-sans mt-1">
              {currentDay.tagline}
            </p>
          </div>

          <Link
            href="/schedule"
            className="self-start md:self-center px-4 py-2 rounded-xl bg-fest-sunset text-white text-xs font-bold hover:brightness-110 shadow-md flex items-center space-x-1.5 flex-shrink-0"
          >
            <span>Full Schedule PDF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Timeline Node Flow */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-fest-gold/40 space-y-8 max-w-4xl mx-auto ml-4 sm:mx-auto">
        {currentDay.events.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Glowing Timeline Marker Node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-fest-charcoal border-2 border-fest-sunset flex items-center justify-center shadow-[0_0_10px_#E87545] group-hover:scale-125 transition-transform">
              <div className="w-2 h-2 rounded-full bg-fest-gold" />
            </div>

            {/* Event Content Card */}
            <div className="rounded-xl bg-card border border-fest-gold/30 hover:border-fest-sunset p-5 shadow-sm hover:shadow-lg transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center text-xs font-bold font-sans text-fest-sunset bg-fest-sunset/10 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {evt.time}
                  </span>
                  <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded bg-fest-plum/10 text-fest-burgundy dark:text-fest-gold border border-fest-gold/30">
                    {evt.category}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground font-sans">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-fest-gold" />
                  <span>{evt.venue}</span>
                </div>
              </div>

              <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-fest-sunset transition-colors">
                {evt.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-sans">
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/schedule"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl border border-fest-gold hover:bg-fest-sunset hover:text-white hover:border-fest-sunset font-sans text-sm font-bold text-foreground transition-all shadow-sm"
        >
          <span>Explore Complete 4-Day Calendar & Timetable</span>
          <ArrowRight className="w-4 h-4 text-fest-sunset hover:text-white" />
        </Link>
      </div>
    </section>
  );
}
