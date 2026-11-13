"use client";

import React from "react";
import Link from "next/link";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Sparkles, ArrowRight, ShieldCheck, Handshake } from "lucide-react";

const SPONSORS_PRIMARY = [
  {
    name: "Awadh Heritage Trust",
    tier: "Title Patron",
    category: "Preservation & Royal Culture",
    tag: "Title Partner",
  },
  {
    name: "Varanasi Silks & Weaves Guild",
    tier: "Heritage Patron",
    category: "Handloom & Textile Arts",
    tag: "Gold Partner",
  },
  {
    name: "Paytm Business QR",
    tier: "Official Payments Partner",
    category: "Instant QR & UTR Gateway",
    tag: "Payments Partner",
  },
  {
    name: "UP State Sports Council",
    tier: "Official Arena Sponsor",
    category: "Athletics & Trophies",
    tag: "Sports Partner",
  },
  {
    name: "Lucknow Chikan Artisans Forum",
    tier: "Craftsmanship Patron",
    category: "GI-Tag Handcrafted Arts",
    tag: "Cultural Partner",
  },
  {
    name: "National Youth Innovation Hub",
    tier: "Technology Partner",
    category: "AI & Digital Hackathons",
    tag: "Tech Partner",
  },
];

const SPONSORS_SECONDARY = [
  { name: "Kashi Sanskriti Parishad", tier: "Performing Arts Partner" },
  { name: "Ganga Eco Preservation Fund", tier: "Sustainability Partner" },
  { name: "Red FM 93.5 Lucknow", tier: "Exclusive Radio Partner" },
  { name: "Hindustan Times Campus", tier: "Official Print Partner" },
  { name: "Nawab Hospitality Group", tier: "Culinary & Dastarkhwan Partner" },
  { name: "Decathlon Sports India", tier: "Official Kit & Equipment Sponsor" },
];

export function SponsorsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40 overflow-hidden">
      <HeritageDivider
        subtitle="Patrons, Benefactors & Co-Creators"
        title="Festival Partners & Sponsors"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-14 font-sans">
        We are proud to collaborate with esteemed cultural foundations, state institutions, and pioneering brands who bring the spirit of Uttar Pradesh alive.
      </p>

      {/* Infinite Scrolling Marquee Track 1 */}
      <div className="relative w-full overflow-hidden mb-6 py-2">
        <div className="flex w-max space-x-6 animate-marquee hover:[animation-play-state:paused]">
          {[...SPONSORS_PRIMARY, ...SPONSORS_PRIMARY].map((s, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-4 px-6 py-4 rounded-2xl bg-card border border-fest-gold/30 shadow-sm hover:border-fest-sunset hover:shadow-lg transition-all min-w-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fest-sunset to-fest-burgundy text-white flex items-center justify-center font-serif font-black text-lg shadow-md flex-shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-fest-sunset">
                  {s.tag}
                </span>
                <h4 className="font-serif text-sm font-bold text-foreground truncate max-w-[170px]">
                  {s.name}
                </h4>
                <span className="text-[10px] text-muted-foreground truncate max-w-[170px]">
                  {s.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Static / Reverse Marquee Track 2 */}
      <div className="relative w-full overflow-hidden py-2">
        <div className="flex w-max space-x-6 animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...SPONSORS_SECONDARY, ...SPONSORS_SECONDARY].map((s, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 px-5 py-3 rounded-xl bg-card/60 backdrop-blur-sm border border-fest-gold/20 shadow-sm hover:border-fest-gold transition-all min-w-[240px]"
            >
              <ShieldCheck className="w-5 h-5 text-fest-gold flex-shrink-0" />
              <div className="flex flex-col text-left">
                <h4 className="font-serif text-xs font-bold text-foreground truncate max-w-[170px]">
                  {s.name}
                </h4>
                <span className="text-[10px] text-muted-foreground truncate max-w-[170px]">
                  {s.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner with Us Callout */}
      <div className="mt-14 max-w-2xl mx-auto rounded-2xl bg-gradient-to-r from-fest-plum/10 via-fest-sunset/10 to-fest-burgundy/10 border border-fest-gold/30 p-6 text-center">
        <Handshake className="w-8 h-8 text-fest-sunset mx-auto mb-2" />
        <h4 className="font-serif text-lg font-bold text-foreground">
          Interested in Partnering with Rangmanch UP 2026?
        </h4>
        <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
          Connect with 12,000+ collegiate leaders and cultural patrons through title naming rights, campus activation booths, and digital branding.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-fest-sunset hover:bg-fest-sunset-dark text-white text-xs font-bold shadow-md transition-all"
        >
          <span>Download Sponsorship Deck</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
