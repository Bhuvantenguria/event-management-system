"use client";

import React, { useState, useEffect } from "react";
import { dataStore, StoredGalleryItem } from "@/lib/data-store";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Image as ImageIcon, Video, Calendar, MapPin, Eye, X, Maximize2 } from "lucide-react";

export default function GalleryPage() {
  const [items, setItems] = useState<StoredGalleryItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<StoredGalleryItem | null>(null);

  useEffect(() => {
    setItems([...dataStore.getAllGalleryItems()]);
  }, []);

  const years = ["All", "2026", "2025", "2024", "2023"];
  const categories = [
    "All",
    "Heritage Evenings",
    "Performing Arts",
    "Sports Arena",
    "Literary Evenings",
    "Arts & Crafts",
    "Celebrity Nights",
  ];

  const filteredItems = items.filter((item) => {
    const matchesYear = selectedYear === "All" || item.year === selectedYear;
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesYear && matchesCategory;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full max-w-full overflow-x-hidden">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          Visual Memories &amp; Chronicles
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          Festival <span className="sunset-gradient-text">Visual Gallery</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          A high-resolution visual archive celebrating stage performances, traditional rites, sports triumphs, and student camaraderie across festival editions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-fest-gold/30 rounded-2xl p-5 shadow-sm max-w-full overflow-hidden">
        {/* Year Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-sans font-bold">Edition:</span>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedYear === y
                  ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-sm"
                  : "bg-fest-champagne/30 dark:bg-fest-charcoal text-foreground hover:bg-fest-champagne/50"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c
                  ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-sm"
                  : "bg-background text-foreground hover:border-fest-sunset border border-border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group rounded-2xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 cursor-pointer"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/30 to-transparent" />
              <div className="absolute top-3.5 left-3.5 bg-fest-plum/90 text-white text-xs px-3 py-1 rounded-full border border-fest-gold/40 font-serif font-bold shadow-md">
                {item.year} Edition
              </div>
              <div className="absolute top-3.5 right-3.5 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1.5 border border-white/20">
                <ImageIcon className="w-3.5 h-3.5 text-fest-gold" />
                <span>Verified</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-fest-gold-light bg-black/50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-snug mt-1 group-hover:text-fest-sunset transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/70 font-sans">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-fest-sunset" />
                <span>{item.location || "Campus Festival Grounds"}</span>
              </div>
              <div className="flex items-center space-x-1 text-fest-sunset font-semibold group-hover:underline">
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span>View</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden border-2 border-fest-gold shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-fest-sunset transition-colors border border-fest-gold/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] w-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-card border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-fest-sunset uppercase tracking-wider">
                  {lightboxItem.category} • {lightboxItem.year}
                </span>
                {lightboxItem.location && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-fest-gold" />
                    {lightboxItem.location}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                {lightboxItem.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                {lightboxItem.caption || "Official festival moment captured live."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
