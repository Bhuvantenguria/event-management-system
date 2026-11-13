"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Users, Calendar, Sparkles, Award } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const EDITIONS = [
  {
    year: "2025",
    theme: "अवध सुर संगम • Awadh Symphony",
    headline: "The Golden Edition of Lucknow Courtyards",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    participants: "9,800+ Attendees",
    colleges: "52 Universities",
    starNight: "Classical Fusion Star Night with Nizami Bandhu",
    overallChampion: "Lucknow University Arts Contingent",
    tag: "3rd Edition",
  },
  {
    year: "2024",
    theme: "काशी तरंग • Sacred Resonance",
    headline: "Varanasi Ghats Illumination & Sufi Awakening",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    participants: "8,200+ Attendees",
    colleges: "44 Universities",
    starNight: "Indie-Folk Sensation The Local Train Tribute",
    overallChampion: "Banaras Hindu University (BHU)",
    tag: "2nd Edition",
  },
  {
    year: "2023",
    theme: "ब्रज उत्सव • Colors of Heritage",
    headline: "The Inaugural Confluence of Folk & Varsity Sports",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    participants: "6,500+ Attendees",
    colleges: "35 Universities",
    starNight: "Agra Symphony & Classical Jugalbandi Night",
    overallChampion: "Aligarh Muslim University (AMU)",
    tag: "Inaugural Edition",
  },
];

export function PreviousEditionsPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
      <HeritageDivider
        subtitle="Legacy & Heritage Archives"
        title="Cinematic Chronicles: Past Editions"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-12 font-sans">
        Explore three years of unforgettable moments, triumphant championships, and transcendent musical evenings that laid the foundation for Rangmanch UP 2026.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {EDITIONS.map((ed) => (
          <div
            key={ed.year}
            className="group rounded-2xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div>
              {/* Cinematic Year Banner Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={ed.image}
                  alt={ed.theme}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/30 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="font-serif font-black text-xl text-white bg-fest-plum/90 px-3 py-0.5 rounded-lg border border-fest-gold/40 shadow-md">
                    {ed.year}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-fest-gold-light bg-black/60 px-2 py-1 rounded-md border border-fest-gold/30">
                    {ed.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-xs font-devanagari text-fest-gold-light block font-semibold">
                    {ed.theme}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white mt-0.5">
                    {ed.headline}
                  </h4>
                </div>
              </div>

              {/* Stats & Legacy Details */}
              <div className="p-6 space-y-3 font-sans">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-fest-champagne/30 dark:bg-fest-charcoal border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Footfall
                    </span>
                    <span className="font-bold text-foreground">{ed.participants}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-fest-champagne/30 dark:bg-fest-charcoal border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Colleges
                    </span>
                    <span className="font-bold text-foreground">{ed.colleges}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-1.5 text-xs text-muted-foreground">
                  <div>
                    <span className="font-bold text-foreground">Star Night: </span>
                    <span>{ed.starNight}</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">Championship Trophy: </span>
                    <span className="text-fest-sunset font-semibold">{ed.overallChampion}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href="/previous-editions"
                className="w-full py-2.5 rounded-xl border border-fest-gold/40 hover:border-fest-sunset hover:bg-fest-sunset/10 text-xs font-bold text-foreground transition-all flex items-center justify-center space-x-1.5 group-hover:text-fest-sunset"
              >
                <span>View {ed.year} Photo & Video Archives</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/previous-editions"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl border border-fest-gold hover:border-fest-sunset bg-card hover:bg-fest-sunset/10 text-sm font-bold text-foreground transition-all shadow-sm"
        >
          <span>Explore Complete Hall of Fame & Historical Editions</span>
          <ArrowRight className="w-4 h-4 text-fest-sunset" />
        </Link>
      </div>
    </section>
  );
}
