import React from "react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Sparkles, Mail, ShieldCheck, Download, Award } from "lucide-react";

export default function SponsorsPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-medium text-heritage-gold font-sans">
          Patronage & Partnerships
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-foreground">
          Festival <span className="gold-gradient-text">Sponsors & Partners</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          We express our deepest gratitude to our visionary partners who champion youth development,
          arts patronage, and the civilizational heritage of Uttar Pradesh.
        </p>
      </div>

      {/* Title Partner Tier */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="px-4 py-1 rounded-full bg-heritage-maroon text-heritage-ivory text-xs font-bold uppercase tracking-wider border border-heritage-gold font-serif">
            Title Partner
          </span>
        </div>
        <div className="max-w-2xl mx-auto rounded-2xl bg-card border-2 border-heritage-gold p-8 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-heritage-maroon/10 border border-heritage-gold flex items-center justify-center font-serif text-3xl font-black text-heritage-maroon dark:text-heritage-gold">
            AHT
          </div>
          <h3 className="font-serif text-2xl font-black text-foreground">
            Awadh Heritage Trust
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Dedicated to the preservation, documentation, and promotion of Awadh’s historic
            monuments, Chikankari textile artisans, and classical performing gharanas.
          </p>
        </div>
      </div>

      {/* Gold & Silver Tiers */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="px-4 py-1 rounded-full bg-heritage-sandstone/20 text-foreground text-xs font-bold uppercase tracking-wider border border-heritage-gold/50 font-serif">
            Gold & Silver Category Partners
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: "Varanasi Silks & Weaves Guild",
              tier: "Gold Partner",
              focus: "Textile Crafts & Artisan Workshops",
            },
            {
              name: "UP State Sports Federation",
              tier: "Sports Championship Partner",
              focus: "Chhatrapati Shivaji Football Trophy",
            },
            {
              name: "National Youth Innovation Forum",
              tier: "Silver Partner",
              focus: "Shilpkar 3D Hackathon & Tech Arena",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-card border border-heritage-gold/30 shadow-sm text-center space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-heritage-sandstone/15 border border-heritage-gold/40 flex items-center justify-center font-serif text-lg font-bold text-foreground">
                {item.name.charAt(0)}
              </div>
              <h4 className="font-serif text-lg font-bold text-foreground">{item.name}</h4>
              <span className="text-xs font-bold text-heritage-maroon dark:text-heritage-gold block font-sans">
                {item.tier}
              </span>
              <p className="text-xs text-muted-foreground font-sans">{item.focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Become a Partner CTA */}
      <div className="rounded-2xl bg-card border border-heritage-gold/50 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-md">
        <h3 className="font-serif text-2xl font-black text-foreground">
          Partner With AffinityAIIMS 2026
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl mx-auto">
          Reach over 5,000+ top collegiate minds and delegates from 60+ universities nationwide.
          Tailored branding, physical stall spaces, and digital placement packages available.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="mailto:swar@aiimsraebareli.edu.in"
            className="px-6 py-2.5 rounded-md bg-heritage-maroon text-heritage-ivory text-xs font-bold border border-heritage-gold hover:bg-heritage-maroon-dark transition-colors inline-flex items-center justify-center space-x-2"
          >
            <Mail className="w-4 h-4 text-heritage-gold" />
            <span>Contact Sponsorship Secretariat</span>
          </a>
        </div>
      </div>
    </div>
  );
}
