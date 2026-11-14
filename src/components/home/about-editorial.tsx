"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Trophy, Users2, Heart, CheckCircle2, Shield, Flame } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

export function AboutEditorial() {
  return (
    <section id="homepage-about" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-fest-sunset/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-fest-burgundy/10 rounded-full blur-3xl pointer-events-none" />

      <HeritageDivider
        subtitle="Organized by University Cultural Clubs"
        title="Student Energy Meets Cultural Legacy"
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Layered Editorial Imagery */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Main Primary Image */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-fest-gold/40 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop"
                alt="College Fest Stage and Cultural Clubs"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white bg-fest-sunset px-2.5 py-1 rounded-full shadow-md font-sans">
                  The Campus Stage
                </span>
                <p className="text-white font-serif text-base font-bold mt-1.5">
                  Over 5,000 students from 60+ universities gathering on our campus
                </p>
              </div>
            </div>

            {/* Overlapping Secondary Image */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-44 sm:w-56 rounded-2xl overflow-hidden border-2 border-fest-sunset shadow-2xl bg-card hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop"
                alt="Kathak Dance Society Showcase"
                className="w-full h-40 sm:h-48 object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="p-2.5 bg-fest-charcoal text-center">
                <span className="text-[11px] font-serif font-bold text-fest-gold-light block">
                  Mudra Dance Society
                </span>
                <span className="text-[9px] text-fest-champagne/80 font-sans">
                  Inter-Collegiate Classical Finals
                </span>
              </div>
            </div>

            {/* Decorative Floating Emblem */}
            <div className="absolute -top-6 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-fest-sunset to-fest-burgundy flex items-center justify-center text-white shadow-xl border border-fest-gold/50 rotate-6 hover:rotate-0 transition-transform">
              <Flame className="w-7 h-7 text-fest-gold-light" />
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Magazine Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-black text-fest-sunset font-sans">
              The Collegiate Fest Philosophy
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-snug">
              “Not an official bureaucracy—a mega college festival built by students, for students.”
            </h3>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
            <strong className="text-foreground">AffinityAIIMS</strong> is the annual flagship inter-collegiate cultural fest organized by <strong className="text-foreground">SWAR (Student Welfare Association of AIIMS Raebareli)</strong> and our student societies. Instead of dry templates, we created a platform that captures the real thrill of college festivals: high-stakes club rivalries, midnight jam sessions, auditorium standing ovations, and fierce varsity sports showdowns.
          </p>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
            Colleges across India send their official delegations to compete across performing arts, literature, fine arts, tech sprints, and athletics—all vying to lift the prestigious <strong>Rolling Inter-Collegiate Fest Championship Trophy</strong>.
          </p>

          {/* Three Key Tenets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 hover:border-fest-sunset transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-fest-sunset/15 text-fest-sunset flex items-center justify-center mb-2 font-bold text-xs">
                01
              </div>
              <h4 className="font-serif font-bold text-sm text-foreground mb-1">
                7 Student Societies
              </h4>
              <p className="text-xs text-muted-foreground leading-normal font-sans">
                Curated rules, professional juries, and fair scoring by college club leads.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 hover:border-fest-sunset transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-fest-burgundy/15 text-fest-sunset flex items-center justify-center mb-2 font-bold text-xs">
                02
              </div>
              <h4 className="font-serif font-bold text-sm text-foreground mb-1">
                Fast-Track Paytm QR
              </h4>
              <p className="text-xs text-muted-foreground leading-normal font-sans">
                Student finance committee verifies UTR payments 24/7 with zero gateway cuts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-fest-gold/30 hover:border-fest-sunset transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-2 font-bold text-xs">
                03
              </div>
              <h4 className="font-serif font-bold text-sm text-foreground mb-1">
                Rolling College Trophy
              </h4>
              <p className="text-xs text-muted-foreground leading-normal font-sans">
                Points scored in each club event aggregate toward the overall college prize.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-bold bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white hover:brightness-110 shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore All Club Competitions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#clubs-showcase"
              className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-bold border border-fest-gold/50 hover:bg-fest-champagne/30 text-foreground transition-all flex items-center space-x-2"
            >
              <Users2 className="w-4 h-4 text-fest-sunset" />
              <span>Meet The 7 Organizing Clubs</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
