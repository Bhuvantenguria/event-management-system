"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  ShieldAlert,
  Ticket,
  Calendar,
  Trophy,
  Flame,
  Sparkles,
  ArrowRight,
  LogOut,
  ChevronDown,
  Layers,
  Music,
  Users2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { name: "Competitions", href: "/events" },
  { name: "College Clubs", href: "/#clubs-showcase" },
  { name: "Fest Schedule", href: "/schedule" },
  { name: "Sports Arena", href: "/sports" },
  { name: "Cultural Arts", href: "/heritage" },
  { name: "Past Editions", href: "/previous-editions" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const user = session?.user;
  const role = (user as { role?: string })?.role;
  const isAdmin = role && ["admin", "super_admin"].includes(role);

  return (
    <header className="sticky top-0 z-50 w-full max-w-full transition-all duration-300 px-2 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      {/* Modern Floating Island Glassmorphism Nav Container */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-card/90 dark:bg-fest-charcoal/90 backdrop-blur-xl border border-fest-gold/30 shadow-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Modern College Fest Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-fest-sunset via-orange-500 to-fest-burgundy flex items-center justify-center text-white shadow-md shadow-fest-sunset/30 group-hover:scale-105 transition-all duration-300 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-fest-champagne animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fest-gold border-2 border-background" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-lg sm:text-2xl font-black tracking-tight text-foreground group-hover:text-fest-sunset transition-colors truncate">
                  Affinity<span className="text-fest-sunset">AIIMS</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans font-black px-1.5 sm:px-2 py-0.5 rounded-md bg-fest-sunset/15 text-fest-sunset border border-fest-sunset/30 uppercase tracking-wider shrink-0">
                  &apos;26 Fest
                </span>
              </div>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-muted-foreground font-sans font-bold truncate max-w-[150px] sm:max-w-none">
                AIIMS Raebareli Cultural Fest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 shrink min-w-0">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative whitespace-nowrap ${
                    isActive
                      ? "text-fest-sunset bg-fest-sunset/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-fest-champagne/40 dark:hover:bg-fest-charcoal-light/50"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-fest-sunset rounded-full shadow-[0_0_8px_#E87545]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Icons, Theme & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <ThemeToggle />

            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-fest-gold/40 bg-card hover:bg-fest-champagne/30 text-foreground transition-all shadow-sm cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-fest-sunset to-fest-burgundy text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="text-xs font-bold max-w-[110px] truncate">
                    {user?.name || "Student"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl bg-card border border-fest-gold/40 py-2.5 z-50 text-foreground animate-fade-in divide-y divide-border/60"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-black truncate text-foreground">{user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-md bg-fest-sunset/15 text-fest-sunset border border-fest-sunset/30">
                        {role || "Student Delegate"}
                      </span>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold hover:bg-fest-sunset/10 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-fest-sunset" />
                        Participant Dashboard
                      </Link>

                      <Link
                        href="/dashboard/tickets"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold hover:bg-fest-sunset/10 transition-colors"
                      >
                        <Ticket className="w-4 h-4 mr-2.5 text-fest-gold" />
                        My Fest Entry Passes & QR
                      </Link>

                      <Link
                        href="/dashboard/registrations"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold hover:bg-fest-sunset/10 transition-colors"
                      >
                        <Layers className="w-4 h-4 mr-2.5 text-emerald-500" />
                        Registered Club Events
                      </Link>
                    </div>

                    {isAdmin && (
                      <div className="py-1.5 bg-fest-burgundy/10 dark:bg-fest-plum/30">
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs text-fest-sunset font-bold hover:bg-fest-sunset/15 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 mr-2.5" />
                          Fest Admin Desk
                        </Link>
                      </div>
                    )}

                    <div className="pt-1.5">
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await signOut({ redirect: false });
                          window.location.href = "/";
                        }}
                        className="flex items-center w-full px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 shrink-0">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-border hover:border-fest-sunset text-foreground transition-all hover:bg-fest-sunset/5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-fest-sunset via-orange-500 to-fest-burgundy text-white shadow-md hover:shadow-fest-sunset/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5 glow-sunset"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Fest Pass</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Action Bar (Always displays Login & Theme) */}
          <div className="flex lg:hidden items-center space-x-1.5 sm:space-x-2 shrink-0">
            <ThemeToggle />

            {session?.user ? (
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fest-sunset to-fest-burgundy text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm border border-fest-gold/40 shrink-0"
                title="Participant Dashboard"
                aria-label="Participant Dashboard"
              >
                {user?.name ? user.name.charAt(0) : "U"}
              </Link>
            ) : (
              <div className="flex items-center space-x-1.5 shrink-0">
                <Link
                  href="/login"
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-fest-sunset/40 text-fest-sunset bg-fest-sunset/10 hover:bg-fest-sunset hover:text-white transition-all shrink-0"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-sm hover:brightness-110 transition-all shrink-0"
                >
                  Pass
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-fest-gold/30 bg-card text-foreground focus:outline-none shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-fest-sunset" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-card border border-fest-gold/40 px-5 pt-4 pb-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white"
                      : "text-foreground hover:bg-fest-champagne/30"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col space-y-2">
            {session?.user ? (
              <>
                <div className="px-3 py-1 text-xs text-muted-foreground">
                  Logged in as <strong className="text-foreground">{user?.name}</strong>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 text-xs font-bold rounded-xl bg-fest-sunset/10 text-fest-sunset"
                >
                  <User className="w-4 h-4 mr-2" />
                  Participant Dashboard
                </Link>
                <Link
                  href="/dashboard/tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 text-xs font-bold rounded-xl bg-fest-sunset/10 text-fest-sunset"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  My Fest Entry Tickets
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-xs font-bold rounded-xl bg-fest-burgundy/15 text-fest-sunset"
                  >
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Fest Admin Desk
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await signOut({ redirect: false });
                    window.location.href = "/";
                  }}
                  className="flex items-center px-3 py-2 text-xs rounded-xl text-destructive hover:bg-destructive/10 text-left font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold rounded-xl border border-border text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white shadow-md"
                >
                  Get Fest Pass
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
