"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
  MapPin,
  ChevronDown,
  Flame,
  Music,
  Theater,
  Zap,
} from "lucide-react";
import { CountdownTimer } from "./countdown";

export function HeroSection() {
  const [primaryFest, setPrimaryFest] = useState({
    targetDate: "2026-03-12T09:00:00",
    festName: "AffinityAIIMS",
    edition: "Annual Inter-Collegiate Cultural Fest",
    tagline: "Where Healthcare Leaders, Cultural Heritage & Youth Energy Converge",
    dateBadge: "12–15 March 2026",
    venue: "AIIMS Raebareli Main Campus",
  });

  useEffect(() => {
    fetch("/api/fests/primary")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.targetDate) {
          setPrimaryFest({
            targetDate: data.targetDate,
            festName: data.festName || "AffinityAIIMS",
            edition: data.edition || "Annual Inter-Collegiate Cultural Fest",
            tagline: data.tagline || "Where Healthcare Leaders, Cultural Heritage & Youth Energy Converge",
            dateBadge: data.dateBadge || "12–15 March 2026",
            venue: data.venue || "AIIMS Raebareli Main Campus",
          });
        }
      })
      .catch(() => {});
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById("homepage-about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden py-16 sm:py-20">
      {/* Background Cinematic Visual with Layered Fest Gradients */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2071&auto=format&fit=crop')", // High energy concert and cultural festival stage
        }}
      >
        {/* Layered Fest Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-fest-charcoal/90 via-fest-plum/80 to-background dark:to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-fest-burgundy/60 via-transparent to-fest-burgundy/60 opacity-80" />
        <div className="absolute inset-0 jaali-bg opacity-20" />
      </div>

      {/* Floating Cultural Club Badges (Desktop) */}
      <div className="hidden xl:block absolute top-28 left-8 z-10 animate-float pointer-events-none">
        <div className="glass-card px-4 py-2.5 rounded-2xl border border-fest-sunset/40 shadow-xl flex items-center space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-fest-sunset/20 border border-fest-sunset/40 flex items-center justify-center text-fest-sunset">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-fest-sunset font-bold block">
              Mudra Dance Society
            </span>
            <span className="text-xs font-serif text-white font-medium">
              Kathak Jugalbandi & Choreo
            </span>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute top-32 right-8 z-10 animate-float [animation-delay:1.5s] pointer-events-none">
        <div className="glass-card px-4 py-2.5 rounded-2xl border border-fest-gold/40 shadow-xl flex items-center space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-fest-gold/20 border border-fest-gold/40 flex items-center justify-center text-fest-gold">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-fest-gold-light font-bold block">
              Dhwani Music Club
            </span>
            <span className="text-xs font-serif text-white font-medium">
              Battle of Sufi Rock Bands
            </span>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-28 left-10 z-10 animate-float [animation-delay:3s] pointer-events-none">
        <div className="glass-card px-4 py-2.5 rounded-2xl border border-fest-gold/40 shadow-xl flex items-center space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-fest-plum/40 border border-fest-gold/40 flex items-center justify-center text-fest-gold">
            <Theater className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-fest-gold-light font-bold block">
              Natraj Dramatics Club
            </span>
            <span className="text-xs font-serif text-white font-medium">
              Awadhi Plays & Nukkad Natak
            </span>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-28 right-10 z-10 animate-float [animation-delay:2s] pointer-events-none">
        <div className="glass-card px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold block">
              Varchasva Sports Council
            </span>
            <span className="text-xs font-serif text-white font-medium">
              Chhatrapati Shivaji Trophy
            </span>
          </div>
        </div>
      </div>

      {/* Main Campaign Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full px-2 sm:px-0">
        {/* Collegiate Fest Badge */}
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full bg-fest-plum/90 border border-fest-sunset/60 text-fest-champagne backdrop-blur-md mb-5 sm:mb-6 shadow-lg group hover:border-fest-sunset transition-colors text-center">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fest-sunset animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-wide sm:tracking-wider font-extrabold text-fest-gold-light uppercase">
              {primaryFest.edition}
            </span>
          </div>
          <span className="hidden sm:inline text-fest-gold/50">•</span>
          <span className="text-[10px] sm:text-xs font-sans text-fest-sunset font-extrabold tracking-wide uppercase">
            Powered by College Clubs
          </span>
          <span className="hidden sm:inline text-fest-gold/50">|</span>
          <span className="text-[10px] sm:text-xs font-sans text-white font-bold tracking-wide">
            {primaryFest.dateBadge}
          </span>
        </div>

        {/* Festival Grand Campaign Title with Overlapping Editorial Treatment */}
        <div className="relative mb-3 max-w-full px-1 sm:px-2">
          <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-[0.25em] font-sans font-black text-fest-sunset block mb-2 drop-shadow-sm break-words max-w-full">
            {primaryFest.venue} • 60+ Collegiate Delegations • 1 Grand Trophy
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none drop-shadow-2xl break-words max-w-full">
            Affinity<span className="sunset-gradient-text">AIIMS</span>
          </h1>
        </div>

        {/* Festival Tagline */}
        <p className="font-serif text-base sm:text-xl md:text-3xl text-fest-gold-light font-normal italic max-w-3xl mx-auto mb-3 drop-shadow px-2">
          “{primaryFest.tagline}”
        </p>

        <p className="text-xs sm:text-sm md:text-base text-fest-champagne/90 font-sans max-w-2xl mx-auto mb-5 sm:mb-6 leading-relaxed px-2">
          Four extraordinary days hosted by AIIMS Raebareli student societies spanning Kathak &amp; street theatre battles,
          Sufi rock bands, parliamentary debates, 3D handicraft hackathons, and varsity football championships.
        </p>

        {/* Live Countdown Timer (Autosynced with Scheduled Primary Fest) */}
        <div className="w-full max-w-lg mx-auto overflow-hidden">
          <CountdownTimer targetDate={primaryFest.targetDate} />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-sans text-xs sm:text-sm font-bold bg-gradient-to-r from-fest-sunset via-orange-500 to-fest-burgundy text-white hover:brightness-110 shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 group border border-fest-gold/40 glow-sunset text-center"
          >
            <span>Get Fest Entry Pass</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/events"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-sans text-xs sm:text-sm font-bold bg-fest-plum/85 hover:bg-fest-plum text-fest-champagne border border-fest-gold/60 shadow-xl backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 group hover:border-fest-sunset text-center"
          >
            <Sparkles className="w-4 h-4 text-fest-gold group-hover:rotate-12 transition-transform" />
            <span>Explore 40+ Club Contests</span>
          </Link>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-6 mt-10 sm:mt-12 w-full max-w-4xl mx-auto pt-6 sm:pt-8 border-t border-fest-gold/30 text-white">
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-fest-charcoal/70 backdrop-blur-md border border-fest-gold/25 hover:border-fest-sunset transition-colors text-center">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-fest-sunset mb-1" />
            <span className="text-lg sm:text-2xl font-serif font-black text-fest-gold-light">
              ₹5,00,000+
            </span>
            <span className="text-[9px] sm:text-[10px] text-fest-champagne/70 uppercase tracking-wider font-sans font-bold">
              Prize Pool
            </span>
          </div>

          <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-fest-charcoal/70 backdrop-blur-md border border-fest-gold/25 hover:border-fest-sunset transition-colors text-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-fest-sunset mb-1" />
            <span className="text-lg sm:text-2xl font-serif font-black text-fest-gold-light">
              45+
            </span>
            <span className="text-[9px] sm:text-[10px] text-fest-champagne/70 uppercase tracking-wider font-sans font-bold">
              Club Competitions
            </span>
          </div>

          <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-fest-charcoal/70 backdrop-blur-md border border-fest-gold/25 hover:border-fest-sunset transition-colors text-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-fest-sunset mb-1" />
            <span className="text-lg sm:text-2xl font-serif font-black text-fest-gold-light">
              60+ Colleges
            </span>
            <span className="text-[9px] sm:text-[10px] text-fest-champagne/70 uppercase tracking-wider font-sans font-bold">
              Pan-India Contingents
            </span>
          </div>

          <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-fest-charcoal/70 backdrop-blur-md border border-fest-gold/25 hover:border-fest-sunset transition-colors text-center">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-fest-sunset mb-1" />
            <span className="text-lg sm:text-2xl font-serif font-black text-fest-gold-light">
              4 Days
            </span>
            <span className="text-[9px] sm:text-[10px] text-fest-champagne/70 uppercase tracking-wider font-sans font-bold">
              Mega Campus Confluence
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNext}
          className="mt-10 flex flex-col items-center text-fest-champagne/70 hover:text-fest-sunset transition-colors cursor-pointer group"
          aria-label="Scroll to about section"
        >
          <span className="text-[10px] uppercase tracking-widest font-sans font-bold mb-1 opacity-80 group-hover:opacity-100">
            Meet the Organizing Clubs
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-fest-gold/50 flex items-start justify-center p-1 group-hover:border-fest-sunset transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-fest-sunset animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
