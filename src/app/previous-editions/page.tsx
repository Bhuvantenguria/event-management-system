import React from "react";
import Link from "next/link";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Trophy, Calendar, Users, Award, PlayCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const PAST_EDITIONS = [
  {
    year: 2025,
    theme: "विरासत • The Awadh Renaissance",
    dates: "7–10 March 2025",
    delegates: "5,400+",
    colleges: "64 Institutions",
    prizeAwarded: "₹4,80,000",
    overallChampion: "Banaras Hindu University (BHU)",
    runnerUp: "Lucknow University",
    aftermovieUrl: "https://www.youtube.com",
    summary:
      "A grand revival of classical Awadhi arts, featuring a 16-team football championship, 40+ cultural competitions, and a record attendance of over 5,000 collegiate delegates from 12 Indian states.",
    coverImage:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1000&auto=format&fit=crop",
    keyHighlights: [
      "Inaugural Ganga Aarti and Shloka recital with 108 traditional brass lamps.",
      "BHU Football Titans won the Chhatrapati Shivaji Trophy with an unbeaten run.",
      "Celebrity Headline Night featuring legendary Sufi folk ensemble.",
    ],
  },
  {
    year: 2024,
    theme: "संगम • Confluence of Tradition & Innovation",
    dates: "14–17 March 2024",
    delegates: "4,600+",
    colleges: "52 Institutions",
    prizeAwarded: "₹3,75,000",
    overallChampion: "Aligarh Muslim University (AMU)",
    runnerUp: "IIT Kanpur",
    aftermovieUrl: "https://www.youtube.com",
    summary:
      "Celebrated the synthesis of ancient UP handicraft traditions with modern digital design, inaugurating the Shilpkar 3D hackathon alongside traditional Rasleela and Ghazal evenings.",
    coverImage:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop",
    keyHighlights: [
      "Introduction of live camera QR ticket check-ins.",
      "First All-India Youth Parliamentary Debate on heritage preservation.",
      "Kathak Jugalbandi showcase with over 30 collegiate classical dancers.",
    ],
  },
  {
    year: 2023,
    theme: "आरम्भ • The Awakening of Rangmanch",
    dates: "10–12 March 2023",
    delegates: "3,200+",
    colleges: "38 Institutions",
    prizeAwarded: "₹2,50,000",
    overallChampion: "Lucknow University",
    runnerUp: "Allahabad University",
    aftermovieUrl: "https://www.youtube.com",
    summary:
      "The inaugural edition that laid the foundation for Uttar Pradesh’s largest collegiate cultural and sports celebration.",
    coverImage:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000&auto=format&fit=crop",
    keyHighlights: [
      "Over 35 events across 3 days.",
      "Launch of the Chhatrapati Shivaji Memorial Football Cup.",
      "Traditional Kavi Sammelan featuring state-level student poets.",
    ],
  },
];

export default function PreviousEditionsPage() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          Festival Legacy & Hall of Fame
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          Past <span className="sunset-gradient-text">Festival Editions</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          A glorious retrospective of championship honors, records, and cultural benchmarks established over previous years of Rangmanch UP.
        </p>
      </div>

      <div className="space-y-12">
        {PAST_EDITIONS.map((ed) => (
          <div
            key={ed.year}
            className="rounded-3xl bg-card border-2 border-fest-gold/40 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 hover:border-fest-sunset transition-all"
          >
            {/* Left Cover Image */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-fest-gold/30">
              <img
                src={ed.coverImage}
                alt={ed.theme}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/90 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-fest-sunset text-white text-sm font-serif font-black px-3.5 py-1 rounded-xl shadow-md">
                {ed.year} Edition
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-devanagari text-fest-gold-light block font-semibold">
                  {ed.theme}
                </span>
                <span className="text-xs text-white/90 font-sans">{ed.dates}</span>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
                  {ed.theme}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-sans">
                  {ed.summary}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                    Delegates
                  </span>
                  <span className="font-serif font-bold text-base text-foreground">
                    {ed.delegates}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                    Colleges
                  </span>
                  <span className="font-serif font-bold text-base text-foreground">
                    {ed.colleges}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                    Prizes Given
                  </span>
                  <span className="font-serif font-bold text-base text-fest-sunset">
                    {ed.prizeAwarded}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                    Champions
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-fest-gold-dark dark:text-fest-gold line-clamp-1">
                    {ed.overallChampion}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-fest-sunset block font-sans">
                  Key Edition Milestones
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground font-sans">
                  {ed.keyHighlights.map((h, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-fest-sunset flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center space-x-4">
                <Link
                  href="/gallery"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center space-x-1.5 transition-all"
                >
                  <span>View Photos & Archives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
