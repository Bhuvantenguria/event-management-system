"use client";

import React, { useState } from "react";
import { ArrowRight, X, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export function AnnouncementsBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-gradient-to-r from-fest-charcoal via-fest-burgundy to-fest-plum text-fest-champagne py-2 px-3 sm:px-4 border-b border-fest-gold/30 shadow-sm z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-sans gap-3">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white font-black text-[10px] uppercase tracking-wider flex items-center shadow-sm">
            <Flame className="w-3 h-3 mr-1 animate-pulse" />
            Campus Dispatch
          </span>
          <span className="truncate text-fest-champagne/95 font-medium">
            🔥 Mudra Dance Society releases Kathak shortlist • Chhatrapati Shivaji Football fixtures published • Student Paytm QR passes verified 24/7!
          </span>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center space-x-1 text-fest-gold-light hover:text-fest-sunset font-bold transition-colors group"
          >
            <span>Register Contingent</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md text-fest-champagne/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss bulletin"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
