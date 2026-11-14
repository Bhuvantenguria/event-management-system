"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Landmark, Music, Sparkles, Palette, Crown, Compass } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const HERITAGE_HUBS = [
  {
    city: "Lucknow (अवध)",
    hindi: "नज़ाकत, नफ़ासत व तहज़ीब",
    theme: "Awadhi Grandeur & Chikankari",
    description:
      "Echoes of the Nawabs, architectural marvels like Rumi Darwaza and Asfi Imambara, and the delicate 400-year-old shadow-work embroidery of Chikankari.",
    image:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1000&auto=format&fit=crop",
    tags: ["Rumi Darwaza", "Chikankari Craft", "Kathak Gharana", "Awadhi Dastarkhwan"],
    accentGradient: "from-fest-burgundy to-fest-plum",
    borderGlow: "hover:border-fest-sunset",
  },
  {
    city: "Varanasi (काशी)",
    hindi: "ज्ञान, मोक्ष व संगीत नगरी",
    theme: "Sacred Ghats & Banarasi Silk",
    description:
      "The spiritual heart of India where lamps illuminate the ancient Ganga ghats at twilight, classical ragas echo at dawn, and shimmering gold Zari silk is woven on handlooms.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000&auto=format&fit=crop",
    tags: ["Ganga Aarti", "Banarasi Brocade", "Shehnai & Tabla", "Subah-e-Banaras"],
    accentGradient: "from-fest-sunset to-fest-burgundy",
    borderGlow: "hover:border-fest-gold",
  },
  {
    city: "Agra & Braj (मथुरा)",
    hindi: "शिल्प, भक्ति व रासलीला",
    theme: "Mughal Marble & Folk Rhythms",
    description:
      "From the white marble inlay and intricate jaali filigree of Agra Fort to the vibrant Mayur Nritya, Holi colours, and timeless devotional music of Mathura-Vrindavan.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop",
    tags: ["Pietra Dura Inlay", "Agra Fort", "Braj Mayur Nritya", "Raslila Tradition"],
    accentGradient: "from-fest-gold to-fest-sunset",
    borderGlow: "hover:border-fest-sunset",
  },
];

export function CulturalShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40 overflow-hidden">
      <HeritageDivider
        subtitle="Heritage & Artistic Confluence"
        title="Living Soul of Uttar Pradesh"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-12 font-sans">
        AffinityAIIMS is deeply grounded in the civilizational richness of Uttar Pradesh—bringing historic craftsmanship, classical ragas, royal architecture, and folklore onto the contemporary collegiate stage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {HERITAGE_HUBS.map((hub) => (
          <div
            key={hub.city}
            className={`group relative rounded-2xl overflow-hidden bg-card border border-fest-gold/30 ${hub.borderGlow} shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5`}
          >
            {/* Image Container with Arch Overlay */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={hub.image}
                alt={hub.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/40 to-transparent" />

              <div className="absolute top-4 left-4 bg-fest-plum/90 text-fest-champagne text-xs px-3.5 py-1 rounded-full border border-fest-gold/50 backdrop-blur-md font-serif font-bold shadow-md">
                {hub.city}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-devanagari text-fest-gold-light block font-semibold">
                  {hub.hindi}
                </span>
                <h3 className="text-xl font-serif font-black text-white tracking-wide mt-0.5">
                  {hub.theme}
                </h3>
              </div>
            </div>

            {/* Description & Tags */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                {hub.description}
              </p>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {hub.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-fest-champagne/30 dark:bg-fest-charcoal border border-fest-gold/25 text-foreground font-sans font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/heritage"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-fest-sunset group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Cultural Archives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center px-2">
        <Link
          href="/heritage"
          className="inline-flex max-w-full items-center justify-center space-x-2.5 px-5 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white hover:brightness-110 font-sans text-xs sm:text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 text-center"
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span className="break-words">Discover Complete Uttar Pradesh Cultural Collections</span>
        </Link>
      </div>
    </section>
  );
}
