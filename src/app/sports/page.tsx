"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Shield,
  Activity,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
} from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

// Sports tournaments data
const TOURNAMENTS = [
  {
    id: "football",
    name: "Chhatrapati Shivaji Memorial Football Trophy",
    sport: "Football (11-a-side)",
    format: "Group Stage + Knockout",
    teamsCount: 16,
    status: "In Progress",
  },
  {
    id: "cricket",
    name: "Major Dhyan Chand Memorial T20 Cricket Cup",
    sport: "Cricket (T20)",
    format: "Knockout",
    teamsCount: 12,
    status: "Upcoming",
  },
  {
    id: "basketball",
    name: "Awadh Hoops Inter-College Basketball Championship",
    sport: "Basketball",
    format: "Knockout",
    teamsCount: 8,
    status: "Upcoming",
  },
];

// Sample Group Standings for Football
const GROUP_STANDINGS = [
  { rank: 1, team: "Lucknow University FC", p: 3, w: 2, d: 1, l: 0, gf: 7, ga: 2, gd: "+5", pts: 7 },
  { rank: 2, team: "BHU Varanasi Titans", p: 3, w: 2, d: 0, l: 1, gf: 6, ga: 4, gd: "+2", pts: 6 },
  { rank: 3, team: "AMU Aligarh Strikers", p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: "-2", pts: 3 },
  { rank: 4, team: "IIT Kanpur Engineers", p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 6, gd: "-5", pts: 1 },
];

// Sample Football Fixtures & Results
const FIXTURES = [
  {
    id: "match-101",
    round: "Quarter-Final 1",
    date: "13 March 2026",
    time: "09:00 AM",
    venue: "Main Stadium Turf, Pitch A",
    status: "Completed",
    team1: { name: "Lucknow University FC", score: 3 },
    team2: { name: "Gorakhpur Warriors", score: 1 },
    scorers: "LU: Kabir (14', 68'), Aryan (42') | GW: Vikas (55')",
    cards: "Yellow: Kabir (LU 45'), Red: Rohit (GW 78')",
  },
  {
    id: "match-102",
    round: "Quarter-Final 2",
    date: "13 March 2026",
    time: "11:30 AM",
    venue: "Main Stadium Turf, Pitch A",
    status: "Completed",
    team1: { name: "BHU Varanasi Titans", score: 2 },
    team2: { name: "Allahabad University FC", score: 0 },
    scorers: "BHU: Shreyas (29'), Devesh (81')",
    cards: "Yellow: Manas (AU 38')",
  },
  {
    id: "match-103",
    round: "Quarter-Final 3",
    date: "13 March 2026",
    time: "02:30 PM",
    venue: "Main Stadium Turf, Pitch B",
    status: "Completed",
    team1: { name: "Bareilly College Tigers", score: 1 },
    team2: { name: "Meerut Knights", score: 2 },
    scorers: "BC: Aman (72') | MK: Danish (12', 49')",
    cards: "Yellow: Danish (MK 90')",
  },
  {
    id: "match-104",
    round: "Semi-Final 1",
    date: "14 March 2026",
    time: "09:30 AM",
    venue: "Main Stadium Turf, Pitch A",
    status: "Scheduled",
    team1: { name: "Lucknow University FC", score: null },
    team2: { name: "BHU Varanasi Titans", score: null },
    scorers: "Upcoming Match",
    cards: "N/A",
  },
  {
    id: "match-105",
    round: "Championship Final",
    date: "15 March 2026",
    time: "10:30 AM",
    venue: "Main Sports Stadium (Center Turf)",
    status: "Scheduled",
    team1: { name: "Winner Semi-Final 1", score: null },
    team2: { name: "Winner Semi-Final 2", score: null },
    scorers: "Upcoming Match",
    cards: "N/A",
  },
];

export default function SportsArenaPage() {
  const [activeTab, setActiveTab] = useState<"fixtures" | "standings" | "bracket">("fixtures");

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          Inter-Collegiate Athletics & Tournaments
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          The Grand <span className="sunset-gradient-text">Sports Arena</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          Follow live fixtures, knockout brackets, goal statistics, cards, and team standings for Uttar Pradesh collegiate championship cups.
        </p>
      </div>

      {/* Featured Tournament Banner */}
      <div className="rounded-3xl bg-card border-2 border-fest-gold/60 p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 glow-sunset">
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fest-sunset/15 text-fest-sunset font-bold text-xs uppercase">
            <Trophy className="w-3.5 h-3.5" />
            <span>Featured Championship</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
            Chhatrapati Shivaji Memorial Football Trophy
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl leading-relaxed">
            16 collegiate teams • 4 groups • Knockout Quarter, Semi & Grand Final on FIFA standard turf. Live score cards and referee reports updated in real time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/events/royal-up-football-cup"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white font-sans text-xs font-bold shadow-lg hover:brightness-110 text-center"
          >
            Register Varsity Squad
          </Link>
          <button
            onClick={() => setActiveTab("fixtures")}
            className="px-6 py-3 rounded-xl border border-fest-gold/50 text-foreground font-sans text-xs font-semibold hover:bg-fest-champagne/30 text-center"
          >
            View Match Schedule
          </button>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
        <button
          onClick={() => setActiveTab("fixtures")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "fixtures"
              ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-md glow-sunset scale-105"
              : "bg-card text-foreground hover:bg-fest-champagne/30 border border-border"
          }`}
        >
          Match Fixtures & Results
        </button>
        <button
          onClick={() => setActiveTab("standings")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "standings"
              ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-md glow-sunset scale-105"
              : "bg-card text-foreground hover:bg-fest-champagne/30 border border-border"
          }`}
        >
          Group Stage Standings
        </button>
        <button
          onClick={() => setActiveTab("bracket")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bracket"
              ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-md glow-sunset scale-105"
              : "bg-card text-foreground hover:bg-fest-champagne/30 border border-border"
          }`}
        >
          Knockout Bracket
        </button>
      </div>

      {/* Tab Content: Fixtures */}
      {activeTab === "fixtures" && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {FIXTURES.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl bg-card border border-fest-gold/30 p-5 sm:p-6 shadow-sm hover:border-fest-sunset transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3 gap-2">
                <span className="font-bold text-fest-sunset uppercase tracking-wider">
                  {match.round}
                </span>
                <span>
                  {match.date} • {match.time} • {match.venue}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    match.status === "Completed"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {match.status}
                </span>
              </div>

              {/* Match Score Display */}
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center text-center">
                <div className="sm:col-span-3 flex items-center justify-center sm:justify-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-fest-burgundy text-white border border-fest-gold/40 flex items-center justify-center font-serif font-black text-xs shadow-sm">
                    {match.team1.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-serif text-base font-bold text-foreground">
                    {match.team1.name}
                  </span>
                </div>

                <div className="sm:col-span-1 py-1 px-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal font-serif text-xl font-black text-fest-sunset">
                  {match.team1.score !== null ? `${match.team1.score} - ${match.team2.score}` : "VS"}
                </div>

                <div className="sm:col-span-3 flex items-center justify-center sm:justify-end space-x-3">
                  <span className="font-serif text-base font-bold text-foreground">
                    {match.team2.name}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-fest-plum text-white border border-fest-gold/40 flex items-center justify-center font-serif font-black text-xs shadow-sm">
                    {match.team2.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Scorers & Cards Details */}
              {match.status === "Completed" && (
                <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1 font-sans">
                  <p>
                    <span className="font-bold text-foreground">Goals:</span> {match.scorers}
                  </p>
                  <p>
                    <span className="font-bold text-foreground">Discipline:</span> {match.cards}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Standings */}
      {activeTab === "standings" && (
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-fest-gold/30 overflow-hidden shadow-sm">
          <div className="p-4 bg-fest-plum text-white flex items-center justify-between">
            <h3 className="font-serif font-bold text-base">Group A Standings (Championship Pool)</h3>
            <span className="text-xs text-fest-gold-light font-sans font-medium">Top 2 Qualify for Semi-Finals</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-fest-champagne/20 dark:bg-fest-charcoal text-muted-foreground font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Pos</th>
                  <th className="p-3">Team</th>
                  <th className="p-3 text-center">P</th>
                  <th className="p-3 text-center">W</th>
                  <th className="p-3 text-center">D</th>
                  <th className="p-3 text-center">L</th>
                  <th className="p-3 text-center">GF</th>
                  <th className="p-3 text-center">GA</th>
                  <th className="p-3 text-center">GD</th>
                  <th className="p-3 text-center font-bold text-foreground">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {GROUP_STANDINGS.map((row) => (
                  <tr key={row.rank} className="hover:bg-fest-champagne/20 transition-colors">
                    <td className="p-3 font-bold text-fest-sunset">{row.rank}</td>
                    <td className="p-3 font-semibold text-foreground flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-fest-burgundy text-white flex items-center justify-center text-[10px] font-bold">
                        {row.team.slice(0, 1)}
                      </div>
                      <span>{row.team}</span>
                    </td>
                    <td className="p-3 text-center">{row.p}</td>
                    <td className="p-3 text-center">{row.w}</td>
                    <td className="p-3 text-center">{row.d}</td>
                    <td className="p-3 text-center">{row.l}</td>
                    <td className="p-3 text-center">{row.gf}</td>
                    <td className="p-3 text-center">{row.ga}</td>
                    <td className="p-3 text-center font-medium">{row.gd}</td>
                    <td className="p-3 text-center font-black text-fest-sunset">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Bracket */}
      {activeTab === "bracket" && (
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-fest-gold/30 p-8 shadow-sm">
          <h3 className="font-serif font-bold text-xl text-foreground text-center mb-6">
            Championship Knockout Tree
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Quarter Finals */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-fest-sunset block text-center">
                Quarter-Finals
              </span>
              <div className="p-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-border text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Lucknow Univ</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Gorakhpur Warriors</span>
                  <span>1</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-border text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>BHU Varanasi</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Allahabad Univ</span>
                  <span>0</span>
                </div>
              </div>
            </div>

            {/* Semi Finals */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-fest-gold block text-center">
                Semi-Finals
              </span>
              <div className="p-4 rounded-xl bg-fest-sunset/10 border border-fest-sunset text-xs space-y-2">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Lucknow University</span>
                  <span>--</span>
                </div>
                <div className="flex justify-between font-bold text-foreground">
                  <span>BHU Varanasi</span>
                  <span>--</span>
                </div>
                <span className="text-[10px] text-muted-foreground block text-center">14 March • 09:30 AM</span>
              </div>
            </div>

            {/* Grand Finale */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-fest-burgundy dark:text-fest-gold block text-center">
                Grand Final
              </span>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-fest-sunset to-fest-burgundy text-white shadow-xl text-center space-y-2">
                <Trophy className="w-7 h-7 mx-auto text-fest-gold" />
                <h4 className="font-serif font-black text-sm">Championship Trophy</h4>
                <p className="text-[11px] text-fest-champagne/90">Winner SF1 vs Winner SF2</p>
                <span className="text-[10px] uppercase tracking-wider font-bold block pt-1">
                  15 March • 10:30 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
