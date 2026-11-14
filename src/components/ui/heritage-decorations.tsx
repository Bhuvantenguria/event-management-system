import React from "react";

export function HeritageDivider({
  title,
  subtitle,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center my-8 text-center max-w-full px-2 ${className}`}>
      {subtitle && (
        <span className="inline-block text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.25em] font-semibold text-fest-sunset font-sans mb-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/10 border border-fest-sunset/20 max-w-full break-words">
          {subtitle}
        </span>
      )}
      {title && (
        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight mb-3 break-words max-w-full">
          {title}
        </h2>
      )}
      <div className="flex items-center justify-center w-full max-w-xs sm:max-w-sm space-x-2 sm:space-x-3 mt-1">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-fest-sunset/40 to-fest-gold" />
        <div className="relative p-1 rounded-full bg-fest-burgundy/10 dark:bg-fest-plum border border-fest-gold/40 flex items-center justify-center shrink-0">
          <LotusOrnament className="w-4 h-4 sm:w-5 sm:h-5 text-fest-gold" />
        </div>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-fest-sunset/40 to-fest-gold" />
      </div>
    </div>
  );
}

export function LotusOrnament({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 13.5 6 15 8C16.5 10 19 11 19 13C19 15.5 17 18 14.5 18C13.5 18 12.8 17.5 12 17C11.2 17.5 10.5 18 9.5 18C7 18 5 15.5 5 13C5 11 7.5 10 9 8C10.5 6 12 2 12 2Z"
        opacity="0.8"
      />
      <path
        d="M12 7C12 7 13 10 14 12C14.5 13 16 14 16 15.5C16 17 14.5 18.5 13 18.5C12.5 18.5 12.2 18.2 12 18C11.8 18.2 11.5 18.5 11 18.5C9.5 18.5 8 17 8 15.5C8 14 9.5 13 10 12C11 10 12 7 12 7Z"
        fill="currentColor"
      />
      <path
        d="M7 16C5 16.5 3 18 3 20C7 20 11 20 12 21C13 20 17 20 21 20C21 18 19 16.5 17 16C15 17.5 13 18 12 18C11 18 9 17.5 7 16Z"
        opacity="0.6"
      />
    </svg>
  );
}

export function RoyalArchFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative p-[2px] rounded-t-[48px] rounded-b-xl bg-gradient-to-b from-fest-gold/60 via-fest-sunset/30 to-fest-burgundy/40 shadow-lg ${className}`}
    >
      <div className="rounded-t-[46px] rounded-b-[10px] bg-card p-6 h-full border border-fest-gold/20">
        {children}
      </div>
    </div>
  );
}

export function CulturalRibbon() {
  return (
    <div className="w-full bg-gradient-to-r from-fest-plum via-fest-burgundy to-fest-plum text-fest-champagne py-2 px-4 text-xs font-sans border-b border-fest-gold/40 shadow-sm relative z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none whitespace-nowrap">
        <div className="flex items-center space-x-2.5">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-fest-sunset shadow-[0_0_8px_#E87545] animate-pulse" />
          <span className="font-bold tracking-wider text-fest-gold-light uppercase">
            AffinityAIIMS 2026 • Festival of Festivals
          </span>
          <span className="text-fest-gold/40">|</span>
          <span className="text-fest-champagne/90 font-medium">12–15 March 2026</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-fest-sunset text-white uppercase ml-1">
            Early Bird Open
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs tracking-wider opacity-90 font-devanagari">
          <span className="hover:text-fest-gold transition-colors">अवध (Awadh)</span>
          <span className="text-fest-gold/40">•</span>
          <span className="hover:text-fest-gold transition-colors">काशी (Varanasi)</span>
          <span className="text-fest-gold/40">•</span>
          <span className="hover:text-fest-gold transition-colors">ब्रज (Braj)</span>
          <span className="text-fest-gold/40">•</span>
          <span className="hover:text-fest-gold transition-colors">बुंदेलखंड (Bundelkhand)</span>
        </div>
      </div>
    </div>
  );
}
