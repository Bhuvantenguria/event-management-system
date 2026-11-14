"use client";

import React, { useState } from "react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Landmark, Sparkles, MapPin, Tag, Compass } from "lucide-react";

const CULTURAL_ITEMS = [
  {
    id: "rumi-darwaza",
    title: "Rumi Darwaza & Asfi Imambara",
    region: "Lucknow (Awadh)",
    category: "Monuments & Architecture",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
    summary:
      "Standing 60 feet tall, the Rumi Darwaza exemplifies refined Awadhi architecture built in 1784 under Nawab Asaf-ud-Daula, renowned for its ornate guldastas and interlocking arches without iron beams.",
    tags: ["Awadhi Heritage", "18th Century", "Bara Imambara", "Bhulbhulaiya"],
  },
  {
    id: "varanasi-ganga-ghats",
    title: "Sacred Ghats & Ganga Aarti of Kashi",
    region: "Varanasi (Kashi)",
    category: "Sacred Traditions",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop",
    summary:
      "Dashashwamedh and Assi Ghats form the eternal spiritual axis where ancient brass tiered lamps are waved in harmonic synchronized rhythm to Vedic chants at twilight.",
    tags: ["Dashashwamedh Ghat", "Vedic Chants", "Subah-e-Banaras", "Ancient Kashi"],
  },
  {
    id: "banarasi-brocade-silk",
    title: "Banarasi Zari Handloom Weaving",
    region: "Varanasi (Banaras)",
    category: "Living Crafts & Handloom",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    summary:
      "Master weavers using pit looms and jacquard setups interweave pure Mulberry silk with real gold and silver metallic threads (Zari) crafting timeless motifs like bel, butidar, and jhallar.",
    tags: ["GI Tagged", "Pure Zari", "Handloom Tradition", "Weaving Guilds"],
  },
  {
    id: "lucknow-chikankari",
    title: "Chikankari White-on-White Embroidery",
    region: "Lucknow (Awadh)",
    category: "Living Crafts & Handloom",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop",
    summary:
      "A 400-year-old delicate shadow-work needlecraft consisting of 32 distinct stitch patterns (tepchi, bakhiya, phanda, jaali) traditionally patronized by Awadhi royalty on muslin and georgette.",
    tags: ["Shadow Work", "Tepchi & Bakhiya", "32 Stitches", "Awadhi Craft"],
  },
  {
    id: "kathak-dance-gharana",
    title: "Kathak Dance – Lucknow & Banaras Gharanas",
    region: "Lucknow & Varanasi",
    category: "Music & Performing Arts",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    summary:
      "One of India's eight classical dances, evolving from ancient temple storytellers (Kathakas) into royal courtly sophistication under Nawab Wajid Ali Shah, characterized by intricate footwork (Tatkar) and spins (Chakkars).",
    tags: ["Classical Dance", "Tatkar Footwork", "Ghungroo Rhythms", "Bhav & Abhinaya"],
  },
  {
    id: "braj-mayur-nritya",
    title: "Mayur Nritya & Rasleela of Braj",
    region: "Mathura & Vrindavan",
    category: "Music & Performing Arts",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
    summary:
      "Vibrant peacock folk dances accompanied by traditional dholak, harmonium, and Braj folk poetry depicting joy, devotion, and the arrival of monsoon festivals.",
    tags: ["Folk Dance", "Braj Culture", "Rasleela", "Traditional Dholak"],
  },
];

const CATEGORIES = [
  "All",
  "Monuments & Architecture",
  "Living Crafts & Handloom",
  "Music & Performing Arts",
  "Sacred Traditions",
];

export default function HeritagePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = CULTURAL_ITEMS.filter((item) => {
    return selectedCategory === "All" || item.category === selectedCategory;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          State Cultural Legacy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          Uttar Pradesh <span className="sunset-gradient-text">Heritage Collections</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          Curated historical narratives, GI-tagged craftsmanship, classical music gharanas, and monumental architecture inspiring AffinityAIIMS 2026.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto max-w-full pb-2 scrollbar-none px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-md glow-sunset scale-105"
                : "bg-card text-foreground hover:border-fest-sunset border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Heritage Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div>
              {/* Image with Arch Badge */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-fest-plum/90 text-white text-xs px-3 py-1 rounded-full border border-fest-gold/40 font-serif font-bold shadow-md">
                  {item.region}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-fest-gold-light bg-black/60 px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white leading-snug mt-1 group-hover:text-fest-sunset transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Summary & Tags */}
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  {item.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/70">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-fest-champagne/30 dark:bg-fest-charcoal text-foreground border border-fest-gold/20 font-sans font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex items-center text-xs font-bold text-fest-sunset group-hover:translate-x-1 transition-transform">
                <span>Part of Festival Curated Themes</span>
                <Sparkles className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
