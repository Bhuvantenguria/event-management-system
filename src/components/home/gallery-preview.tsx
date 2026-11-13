"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Maximize2, X } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

const GALLERY_SAMPLES = [
  {
    id: 1,
    title: "Varanasi Maha Aarti Twilight Ceremony",
    category: "Heritage Evenings",
    caption: "1,008 illuminated brass lamps reflected along Dashashwamedh Ghat at sunset.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000&auto=format&fit=crop",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: 2,
    title: "Lucknow Kathak Jugalbandi",
    category: "Classical Dance",
    caption: "Maestros performing classical footwork and chakkars under royal arches.",
    image:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    colSpan: "col-span-1",
  },
  {
    id: 3,
    title: "Football Trophy Championship Final",
    category: "Sports Arena",
    caption: "High-octane injury-time header deciding the Chhatrapati Shivaji Trophy.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    colSpan: "col-span-1",
  },
  {
    id: 4,
    title: "Shaam-e-Awadh Ghazal & Kavi Sammelan",
    category: "Literary & Music",
    caption: "Courtyard gathering under illuminated chandeliers and candle lanterns.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: 5,
    title: "Braj Mayur Nritya & Peacock Folklore",
    category: "Folk Traditions",
    caption: "Folk dancers adorned in vibrant peacock feather attire from Mathura.",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: 6,
    title: "Star Night 2025 Concert Pyrotechnics",
    category: "Celebrity Nights",
    caption: "10,000 students singing in unison under fireworks and stage lights.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    colSpan: "col-span-1",
  },
];

export function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<(typeof GALLERY_SAMPLES)[0] | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
      <HeritageDivider
        subtitle="Visual Chronicles & Moments"
        title="Glimpses of Grandeur"
      />

      <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto -mt-4 mb-12 font-sans">
        A photographic and cinematic journey capturing the electrifying energy, royal regalia, athletic triumphs, and unforgettable nights of past festival editions.
      </p>

      {/* Masonry / Layered Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {GALLERY_SAMPLES.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className={`group relative h-64 md:h-72 rounded-2xl overflow-hidden border border-fest-gold/30 hover:border-fest-sunset shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer ${item.colSpan}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-fest-charcoal/90 via-fest-charcoal/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Hover Icon Indicator */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-fest-gold/40 flex items-center justify-center text-fest-gold-light opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-fest-gold-light bg-fest-plum/85 px-2.5 py-1 rounded-full border border-fest-gold/30">
                {item.category}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-2 group-hover:text-fest-sunset transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden border-2 border-fest-gold shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-fest-sunset transition-colors border border-fest-gold/50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] w-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-card border-t border-border">
              <span className="text-xs font-sans font-bold text-fest-sunset uppercase tracking-wider">
                {selectedImage.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                {selectedImage.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 font-sans">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-14 text-center">
        <Link
          href="/gallery"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl border border-fest-gold hover:border-fest-sunset bg-card hover:bg-fest-sunset/10 text-sm font-bold text-foreground transition-all shadow-sm"
        >
          <ImageIcon className="w-4 h-4 text-fest-sunset" />
          <span>View Complete 200+ Photo & Video Fest Gallery</span>
          <ArrowRight className="w-4 h-4 text-fest-sunset" />
        </Link>
      </div>
    </section>
  );
}
