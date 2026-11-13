"use client";

import React, { useState } from "react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";
import { Image as ImageIcon, Video, Calendar, MapPin, Eye, X, Maximize2 } from "lucide-react";

const ALBUMS = [
  {
    id: "aarti-kashi-2025",
    title: "Varanasi Maha Aarti Ceremony",
    year: "2025",
    category: "Heritage Evenings",
    location: "Kashi Amphitheatre",
    cover: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop",
    photosCount: 28,
  },
  {
    id: "kathak-jugalbandi-2025",
    title: "Kathak Gharana Night & Classical Beats",
    year: "2025",
    category: "Performing Arts",
    location: "Nawab Wajid Ali Shah Auditorium",
    cover: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    photosCount: 34,
  },
  {
    id: "football-cup-2025",
    title: "Chhatrapati Shivaji Football Championship",
    year: "2025",
    category: "Sports Arena",
    location: "Main Stadium",
    cover: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    photosCount: 42,
  },
  {
    id: "shaam-e-awadh-2025",
    title: "Shaam-e-Awadh: Ghazal & Kavi Sammelan",
    year: "2025",
    category: "Literary Evenings",
    location: "Heritage Lawns",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    photosCount: 22,
  },
  {
    id: "handloom-crafts-2024",
    title: "Shilpkar: Living Crafts Exhibition",
    year: "2024",
    category: "Arts & Crafts",
    location: "Heritage Quadrangle",
    cover: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop",
    photosCount: 30,
  },
  {
    id: "celebrity-star-night-2024",
    title: "Sufi Rock Headline Concert",
    year: "2024",
    category: "Celebrity Nights",
    location: "Grand Star Arena",
    cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    photosCount: 65,
  },
  {
    id: "braj-mayur-nritya-2023",
    title: "Braj Mayur Nritya & Raslila Troupe",
    year: "2023",
    category: "Performing Arts",
    location: "Amphitheatre",
    cover: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
    photosCount: 36,
  },
  {
    id: "pyrotechnics-star-night-2025",
    title: "Valedictory Fireworks & Sky Lanterns",
    year: "2025",
    category: "Celebrity Nights",
    location: "Campus Lake Pavilion",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    photosCount: 50,
  },
  {
    id: "hackathon-demo-day-2025",
    title: "Heritage Tech & AI Hackathon Showcase",
    year: "2025",
    category: "Arts & Crafts",
    location: "Innovation Hub",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    photosCount: 26,
  },
];

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxAlbum, setLightboxAlbum] = useState<(typeof ALBUMS)[0] | null>(null);

  const years = ["All", "2025", "2024", "2023"];
  const categories = [
    "All",
    "Heritage Evenings",
    "Performing Arts",
    "Sports Arena",
    "Literary Evenings",
    "Arts & Crafts",
    "Celebrity Nights",
  ];

  const filteredAlbums = ALBUMS.filter((album) => {
    const matchesYear = selectedYear === "All" || album.year === selectedYear;
    const matchesCategory =
      selectedCategory === "All" || album.category === selectedCategory;
    return matchesYear && matchesCategory;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-fest-sunset font-sans px-3 py-1 rounded-full bg-fest-sunset/10 border border-fest-sunset/20">
          Visual Memories & Chronicles
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
          Festival <span className="sunset-gradient-text">Visual Gallery</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          A high-resolution visual archive celebrating stage performances, traditional rites, sports triumphs, and student camaraderie across past editions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-fest-gold/30 rounded-2xl p-5 shadow-sm">
        {/* Year Filter */}
        <div className="flex items-center space-x-2">
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
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
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

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            onClick={() => setLightboxAlbum(album)}
            className="group rounded-2xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 cursor-pointer"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/95 via-fest-charcoal/30 to-transparent" />
              <div className="absolute top-3.5 left-3.5 bg-fest-plum/90 text-white text-xs px-3 py-1 rounded-full border border-fest-gold/40 font-serif font-bold shadow-md">
                {album.year} Edition
              </div>
              <div className="absolute top-3.5 right-3.5 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1.5 border border-white/20">
                <ImageIcon className="w-3.5 h-3.5 text-fest-gold" />
                <span>{album.photosCount} Photos</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-fest-gold-light bg-black/50 px-2 py-0.5 rounded">
                  {album.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-snug mt-1 group-hover:text-fest-sunset transition-colors">
                  {album.title}
                </h3>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/70 font-sans">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-fest-sunset" />
                <span>{album.location}</span>
              </div>
              <div className="text-fest-sunset font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <Eye className="w-3.5 h-3.5" />
                <span>Open Preview</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxAlbum && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxAlbum(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden border-2 border-fest-gold shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxAlbum(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-fest-sunset transition-colors border border-fest-gold/50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] w-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxAlbum.cover}
                alt={lightboxAlbum.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-card border-t border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-sans font-bold text-fest-sunset uppercase tracking-wider">
                  {lightboxAlbum.category} • {lightboxAlbum.year} Edition
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                  {lightboxAlbum.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                  Location: {lightboxAlbum.location} • Collection of {lightboxAlbum.photosCount} high-res captures
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-fest-sunset/15 text-fest-sunset border border-fest-sunset/30">
                Official Festival Archive
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
