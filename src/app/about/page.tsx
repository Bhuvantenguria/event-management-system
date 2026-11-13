import React from "react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Landmark, Award, ShieldCheck, Heart, Sparkles, MapPin, Compass, ArrowRight, Users2, Trophy, Flame } from "lucide-react";
import Link from "next/link";

export function generateMetadata() {
  return {
    title: "About the College Fest | Rangmanch '26",
    description: "Learn about the student cultural clubs, council, and creative vision behind Rangmanch '26 Inter-Collegiate Fest.",
  };
}

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          The Student Societies Behind The Movement
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          The Story of <span className="sunset-gradient-text">रंगमंच &apos;26</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">
          A flagship inter-collegiate cultural fest organized by our university&apos;s student cultural clubs to celebrate India&apos;s classical heritage, contemporary collegiate arts, and fierce tournament rivalries.
        </p>
      </div>

      {/* Triad of Culture & Student Life */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-md space-y-4 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-fest-sunset/15 text-fest-sunset flex items-center justify-center font-bold">
            <Users2 className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Student-Run Societies
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Seven university clubs—from Mudra Dance and Dhwani Music to Natraj Theatre and Varchasva Sports—curate every single competition, rulebook, and stage setup.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-md space-y-4 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-fest-burgundy/15 text-fest-burgundy dark:text-fest-gold flex items-center justify-center font-bold">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Rolling College Trophy
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Over 60 universities send their official club delegations to compete for overall fest championship glory, ₹5 Lakhs in cash prizes, and national collegiate bragging rights.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-md space-y-4 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Living Cultural Pride
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            We bridge authentic Awadhi etiquette, sacred Banaras rhythms, and Mughal architectural wonder with electric college rock, youth debates, and cutting-edge hackathons.
          </p>
        </div>
      </div>

      {/* College Grounds & Venues */}
      <div className="rounded-3xl overflow-hidden bg-card border-2 border-fest-gold/50 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-fest-sunset uppercase tracking-wider font-sans">
            University Campus Venues
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground">
            The Grand Campus Venues
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Hosted across our sprawling campus featuring the 1,500-seat Nawab Wajid Ali Shah Auditorium, the open-air Heritage Amphitheatre, Turing Tech Pavilion, and the floodlit Main Stadium Turf.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Student volunteers, stage managers, and club coordinators ensure seamless live Paytm QR pass check-ins, green room facilities, and on-campus hostel accommodation for visiting collegiate contingents.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center space-x-1.5"
            >
              <span>Explore Club Competitions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/#clubs-showcase"
              className="px-6 py-3.5 rounded-xl border border-fest-gold/50 hover:bg-fest-champagne/30 text-foreground text-xs font-bold flex items-center space-x-1.5"
            >
              <Users2 className="w-3.5 h-3.5 text-fest-sunset" />
              <span>Meet the Organizing Clubs</span>
            </Link>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border-2 border-fest-gold/30 h-72 sm:h-96 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=900&auto=format&fit=crop"
            alt="University Campus Fest Grounds"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] uppercase font-bold text-fest-gold-light bg-black/60 px-2.5 py-0.5 rounded border border-fest-gold/30 font-sans">
              Central Campus
            </span>
            <p className="font-serif text-sm font-semibold mt-1">
              Colonnades, lawns, and auditoriums buzzing with student energy across 4 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
