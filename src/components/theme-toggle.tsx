"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-md border border-heritage-gold/30 bg-card ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md border border-heritage-gold/40 bg-card hover:bg-heritage-sandstone/20 text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-heritage-gold/50 ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "Light" : "Dark"} Heritage Theme`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-heritage-gold transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 text-heritage-maroon transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}
