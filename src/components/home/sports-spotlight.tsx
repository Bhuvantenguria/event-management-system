"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Shield, ArrowRight, Activity, Calendar, Flame, Users } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

export function SportsSpotlight() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40 overflow-hidden">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-fest-charcoal via-fest-plum to-fest-burgundy text-fest-champagne p-5 sm:p-10 lg:p-14 border-2 border-fest-gold/40 shadow-2xl max-w-full">
        <div className="absolute inset-0 jaali-bg opacity-15 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-fest-sunset/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Tournament Narrative & Highlights */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex max-w-full items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-fest-sunset/20 border border-fest-sunset/50 text-fest-sunset text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Chhatrapati Shivaji Memorial Trophy 2026</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white break-words">
              The Grand <span className="sunset-gradient-text">Football & Sports</span> Arena
            </h2>

            <p className="text-sm sm:text-base text-fest-champagne/85 leading-relaxed font-sans max-w-xl">
              Witness the ultimate collegiate athletic showdown. Full tournament management with
              live knockout brackets, group standings, yellow/red card tracking, golden boot races,
              and real-time turf commentary across 16 university squads.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-fest-gold/30">
                <Activity className="w-4 h-4 text-fest-sunset" />
                <span className="text-xs font-semibold">Live Match Scoring</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-fest-gold/30">
                <Trophy className="w-4 h-4 text-fest-gold" />
                <span className="text-xs font-semibold">Knockout Trees</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-fest-gold/30">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold">Verified Rosters</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/sports"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-fest-sunset via-fest-sunset-light to-fest-burgundy text-white font-sans text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2 border border-fest-gold/40 glow-sunset"
              >
                <span>Enter Sports Arena</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/events?category=sports"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-fest-gold/40 font-sans text-sm font-semibold transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <span>Register Varsity Team</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Match Card Visual Preview */}
          <div className="lg:col-span-5 bg-card text-foreground rounded-2xl p-6 border-2 border-fest-gold/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-fest-sunset">
                  Live Match Showcase
                </span>
              </div>
              <span className="text-[11px] font-sans text-muted-foreground font-semibold">
                Quarter Finals • Turf 1
              </span>
            </div>

            {/* Matchup */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-fest-gold/25">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-fest-burgundy text-white font-serif font-black flex items-center justify-center text-xs shadow-sm">
                    LU
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-sm">Lucknow Varsity FC</h5>
                    <span className="text-[10px] text-muted-foreground font-sans">Group A Winner</span>
                  </div>
                </div>
                <span className="font-serif text-xl font-black text-fest-sunset">2</span>
              </div>

              <div className="flex items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-3 py-0.5 rounded-full bg-fest-champagne/40 dark:bg-fest-charcoal border border-border">
                  VS • 78th Minute
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-fest-champagne/30 dark:bg-fest-charcoal border border-fest-gold/25">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-fest-plum text-white font-serif font-black flex items-center justify-center text-xs shadow-sm">
                    BHU
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-sm">BHU Varanasi XI</h5>
                    <span className="text-[10px] text-muted-foreground font-sans">Group B Runner-Up</span>
                  </div>
                </div>
                <span className="font-serif text-xl font-black text-fest-sunset">1</span>
              </div>
            </div>

            {/* Quick Match Footer */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span>Goal Scorers: Kabir (24&apos;), Aarav (58&apos;)</span>
              <Link
                href="/sports"
                className="text-fest-sunset font-bold hover:underline flex items-center space-x-1"
              >
                <span>Live Center</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
