import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "₹0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export const PRODUCTION_URL = "https://event-management-system-kappa-gold.vercel.app";

/**
 * Sanitizes URLs by removing all whitespaces, tabs, newlines, null characters, and trailing slashes.
 * Crucial for preventing HTTP Header splitting errors (TypeError: Headers.set: ... is an invalid header value).
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(/[\r\n\t\0\s]+/g, "").replace(/\/+$/, "");
}

/**
 * Dynamically resolves the base application URL.
 * Automatically uses window.location.origin in the browser,
 * or production domain on Vercel, avoiding unwanted localhost:3000 redirects.
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return sanitizeUrl(window.location.origin);
  }

  const nextAuthUrl = sanitizeUrl(process.env.NEXTAUTH_URL);
  if (nextAuthUrl && !nextAuthUrl.includes("localhost")) {
    return nextAuthUrl;
  }

  if (process.env.VERCEL_URL) {
    const cleanVercel = sanitizeUrl(process.env.VERCEL_URL);
    return cleanVercel.startsWith("http") ? cleanVercel : `https://${cleanVercel}`;
  }

  if (nextAuthUrl) {
    return nextAuthUrl;
  }

  return PRODUCTION_URL;
}

export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "";
  // Check if string is HH:MM or HH:MM:SS
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return timeStr;
}
