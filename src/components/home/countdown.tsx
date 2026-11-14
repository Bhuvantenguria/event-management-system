"use client";

import React, { useState, useEffect } from "react";

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 my-5 sm:my-6 max-w-full">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center w-14 sm:w-20 md:w-24 h-18 sm:h-24 md:h-28 rounded-xl bg-fest-charcoal/80 border border-fest-gold/30 p-1.5 sm:p-2"
          >
            <span className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-fest-gold">
              --
            </span>
            <span className="text-[9px] sm:text-xs uppercase tracking-wider text-fest-champagne/70 mt-0.5 sm:mt-1 font-sans">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 my-5 sm:my-6 max-w-full">
      {units.map((item, idx) => (
        <React.Fragment key={item.label}>
          <div className="group relative flex flex-col items-center justify-center w-14 sm:w-20 md:w-24 h-18 sm:h-24 md:h-28 rounded-xl bg-fest-charcoal/85 backdrop-blur-md border border-fest-gold/40 shadow-xl hover:border-fest-sunset hover:shadow-[0_0_20px_rgba(232,117,69,0.3)] transition-all duration-300 p-1.5 sm:p-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-fest-sunset/10 via-transparent to-fest-burgundy/20 opacity-40 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-fest-gold to-transparent opacity-75" />

            <span className="relative z-10 text-xl sm:text-3xl md:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-fest-champagne via-fest-gold to-fest-sunset group-hover:scale-105 transition-transform">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="relative z-10 text-[8px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-fest-champagne/80 font-sans font-semibold mt-0.5 sm:mt-1">
              {item.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-fest-gold/60 font-serif font-bold text-base sm:text-2xl -mt-2 animate-pulse">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
