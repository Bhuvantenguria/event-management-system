import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Uttar Pradesh Cultural Festival Enhanced Creative Palette
        fest: {
          burgundy: "#681F38",
          "burgundy-dark": "#4D1427",
          "burgundy-light": "#842A4A",
          plum: "#402044",
          "plum-dark": "#2E1532",
          sunset: "#E87545",
          "sunset-light": "#FA8C5E",
          "sunset-dark": "#C85A2E",
          gold: "#D4AD63",
          "gold-light": "#E9C788",
          "gold-dark": "#B08A42",
          champagne: "#F5E8D0",
          "champagne-light": "#FAF3E6",
          charcoal: "#191820",
          "charcoal-dark": "#121118",
          "charcoal-light": "#252430",
          rose: "#C77C83",
          "rose-light": "#DA969C",
          green: "#344E42",
          "green-dark": "#23352D",
        },
        heritage: {
          ivory: "#F5E8D0",
          "ivory-light": "#FAF3E6",
          maroon: "#681F38",
          "maroon-dark": "#402044",
          "maroon-light": "#842A4A",
          red: "#C77C83",
          gold: "#D4AD63",
          "gold-light": "#E9C788",
          "gold-dark": "#B08A42",
          sandstone: "#D4AD63",
          "sandstone-dark": "#B08A42",
          forest: "#344E42",
          charcoal: "#191820",
          "charcoal-dark": "#121118",
          "charcoal-light": "#252430",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        heading: ["var(--font-playfair)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "DM Sans", "system-ui", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
      backgroundImage: {
        "jaali-pattern": "radial-gradient(circle, #D4AD63 1px, transparent 1px)",
        "gradient-festival": "linear-gradient(135deg, #681F38 0%, #402044 50%, #191820 100%)",
        "gradient-sunset": "linear-gradient(135deg, #E87545 0%, #681F38 100%)",
        "gradient-gold-sunset": "linear-gradient(135deg, #D4AD63 0%, #E87545 50%, #681F38 100%)",
        "gradient-royal": "linear-gradient(135deg, #402044 0%, #681F38 50%, #D4AD63 100%)",
        "hero-overlay": "linear-gradient(180deg, rgba(25,24,32,0.7) 0%, rgba(64,32,68,0.8) 50%, rgba(25,24,32,0.95) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 5s ease-in-out infinite",
        "spin-slow": "spin-slow 25s linear infinite",
        marquee: "marquee 28s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
