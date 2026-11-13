"use client";

import React from "react";
import Link from "next/link";
import {
  Music,
  Brush,
  Trophy,
  BookOpen,
  Code,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Flame,
  Crown,
} from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const FEST_CATEGORIES = [
  {
    id: "cultural",
    name: "Cultural & Performing Arts",
    hindi: "नृत्य, नाटक व अभिनय",
    description: "Kathak jugalbandi, folk theatre (Nautanki), classical solo recitals, and street plays.",
    icon: Music,
    count: "12 Events",
    prizes: "₹1,20,000",
    gradient: "from-fest-sunset to-fest-burgundy",
    accentColor: "border-fest-sunset",
    href: "/events?category=cultural",
  },
  {
    id: "music",
    name: "Classical Music & Sufi",
    hindi: "राग, गज़ल व सूफ़ी संगम",
    description: "Banaras Gharana vocal recitals, Sufi fusion rock bands, and acoustic unplugged.",
    icon: Flame,
    count: "8 Events",
    prizes: "₹90,000",
    gradient: "from-fest-burgundy to-fest-plum",
    accentColor: "border-fest-gold",
    href: "/events?category=music",
  },
  {
    id: "literary",
    name: "Literary, Poetry & Debates",
    hindi: "काव्य, गज़ल व वाद-विवाद",
    description: "Shaam-e-Awadh Kavi Sammelan, Youth Parliamentary debate, and Urdu poetry.",
    icon: BookOpen,
    count: "7 Events",
    prizes: "₹65,000",
    gradient: "from-fest-plum to-fest-charcoal",
    accentColor: "border-fest-plum",
    href: "/events?category=literary",
  },
  {
    id: "heritage_arts",
    name: "Heritage Crafts & Fine Arts",
    hindi: "शिल्प, चिकनकारी व ललित कला",
    description: "Chikankari design, live clay pottery, Banarasi textile design, and Rangoli.",
    icon: Brush,
    count: "8 Events",
    prizes: "₹75,000",
    gradient: "from-fest-gold to-fest-sunset",
    accentColor: "border-fest-gold",
    href: "/events?category=heritage_arts",
  },
  {
    id: "sports",
    name: "Sports & Athletics Arena",
    hindi: "फुटबॉल, क्रिकेट व शौर्य",
    description: "Chhatrapati Shivaji Memorial Trophy football knockouts, cricket, and athletics.",
    icon: Trophy,
    count: "6 Tournaments",
    prizes: "₹1,10,000",
    gradient: "from-fest-green to-fest-charcoal",
    accentColor: "border-emerald-500",
    href: "/sports",
  },
  {
    id: "technical",
    name: "Tech & Heritage Innovation",
    hindi: "डिजिटल शिल्पकार व नवाचार",
    description: "AI Tourism hackathons, 3D Monument modelling, and Smart UP tech challenges.",
    icon: Code,
    count: "9 Events",
    prizes: "₹85,000",
    gradient: "from-fest-rose to-fest-burgundy",
    accentColor: "border-fest-rose",
    href: "/events?category=technical",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
      <HeritageDivider
        subtitle="Explore By Realm"
        title="Festival Arenas & Disciplines"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-12 font-sans">
        Dive into 6 distinct arenas celebrating everything from 16th-century Awadhi poetry and Banarasi weaves to cutthroat varsity football and AI innovations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEST_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative rounded-2xl bg-card border border-fest-gold/30 hover:border-fest-sunset transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5"
            >
              {/* Subtle Ambient Gradient Corner */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.gradient} opacity-10 group-hover:opacity-25 rounded-bl-full transition-opacity duration-300 pointer-events-none`}
              />

              <div>
                {/* Header with Icon and Count Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-sans font-bold px-2.5 py-1 rounded-full bg-fest-champagne/40 dark:bg-fest-charcoal text-foreground border border-fest-gold/30">
                    {cat.count}
                  </span>
                </div>

                <span className="text-xs font-devanagari text-fest-sunset font-bold block mb-1">
                  {cat.hindi}
                </span>

                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-fest-sunset transition-colors mb-2">
                  {cat.name}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed font-sans mb-4">
                  {cat.description}
                </p>
              </div>

              {/* Bottom Footer: Prize Pool & CTA Arrow */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Prize Pool
                  </span>
                  <span className="text-sm font-serif font-black text-fest-gold-dark dark:text-fest-gold">
                    {cat.prizes}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs font-bold text-fest-sunset group-hover:translate-x-1 transition-transform">
                  <span>Explore Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
