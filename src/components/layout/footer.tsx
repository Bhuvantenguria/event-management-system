"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Shield,
  Heart,
  ArrowRight,
  ExternalLink,
  Flame,
  Users2,
  Trophy,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-fest-charcoal text-fest-champagne border-t-2 border-fest-gold/40 relative overflow-hidden jaali-bg">
      {/* Decorative Gradient Border Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-fest-sunset via-fest-gold to-fest-burgundy" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Student Fest Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fest-sunset to-fest-burgundy flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-fest-gold-light" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-tight text-white group-hover:text-fest-sunset transition-colors">
                  रंगमंच <span className="text-fest-sunset">&apos;26 Fest</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-fest-gold-light font-sans font-bold">
                  Annual Inter-Collegiate Cultural Fest
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-fest-champagne/80 leading-relaxed font-sans max-w-sm">
              The premier pan-India college cultural festival organized by university student clubs.
              Over 5,000 delegates competing in Kathak & street plays, band battles, poetry slams,
              hackathons, and varsity football for the Rolling College Fest Trophy.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-sans">
              <span className="px-2.5 py-1 rounded-full bg-fest-plum/80 border border-fest-gold/30 text-fest-gold-light">
                Mudra Dance Society
              </span>
              <span className="px-2.5 py-1 rounded-full bg-fest-plum/80 border border-fest-gold/30 text-fest-gold-light">
                Dhwani Music Club
              </span>
              <span className="px-2.5 py-1 rounded-full bg-fest-plum/80 border border-fest-gold/30 text-fest-gold-light">
                Natraj Theatre Troupe
              </span>
              <span className="px-2.5 py-1 rounded-full bg-fest-plum/80 border border-fest-gold/30 text-fest-gold-light">
                Kalam Lit Society
              </span>
              <span className="px-2.5 py-1 rounded-full bg-fest-plum/80 border border-fest-gold/30 text-fest-gold-light">
                Varchasva Sports
              </span>
            </div>
          </div>

          {/* Quick Festival Links */}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-fest-gold mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-fest-sunset" />
              Fest Arena
            </h3>
            <ul className="space-y-2.5 text-xs text-fest-champagne/80 font-sans">
              <li>
                <Link href="/events" className="hover:text-fest-sunset transition-colors">
                  All 40+ Competitions
                </Link>
              </li>
              <li>
                <Link href="/#clubs-showcase" className="hover:text-fest-sunset transition-colors">
                  Organizing Student Clubs
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-fest-sunset transition-colors">
                  4-Day Event Timetable
                </Link>
              </li>
              <li>
                <Link href="/sports" className="hover:text-fest-sunset transition-colors">
                  Football & Sports Arena
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-fest-sunset transition-colors">
                  Heritage Arts & Crafts
                </Link>
              </li>
              <li>
                <Link href="/previous-editions" className="hover:text-fest-sunset transition-colors">
                  Hall of Fame & Past Editions
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-fest-sunset transition-colors">
                  Photo & Video Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Portals & Verification */}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-fest-gold mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-fest-sunset" />
              Student Portals
            </h3>
            <ul className="space-y-2.5 text-xs text-fest-champagne/80 font-sans">
              <li>
                <Link href="/dashboard" className="hover:text-fest-sunset transition-colors">
                  Participant Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tickets" className="hover:text-fest-sunset transition-colors">
                  My Digital Tickets & QR
                </Link>
              </li>
              <li>
                <Link href="/dashboard/payments" className="hover:text-fest-sunset transition-colors">
                  Paytm QR Payment Status
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-fest-sunset transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-fest-sunset transition-colors">
                  New Delegate Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/scanner"
                  className="hover:text-fest-sunset transition-colors text-fest-gold-light font-semibold"
                >
                  Live Camera Gate QR Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-fest-sunset transition-colors text-fest-sunset font-semibold"
                >
                  Club Coordinator Control Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizing Committee & Contact */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-fest-gold mb-4 flex items-center">
              <Users2 className="w-4 h-4 mr-2 text-fest-sunset" />
              Fest Committee
            </h3>
            <div className="space-y-2.5 text-xs text-fest-champagne/80 font-sans">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-fest-gold flex-shrink-0 mt-0.5" />
                <span>
                  Student Activity Centre (SAC), Central Campus, Lucknow, UP 226001
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-fest-gold flex-shrink-0" />
                <a
                  href="mailto:fest@rangmanchup.in"
                  className="hover:text-fest-sunset transition-colors"
                >
                  fest@rangmanchup.in
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-fest-gold flex-shrink-0" />
                <span>+91 98765 43210 (Student General Secy)</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-fest-plum border border-fest-gold/40 text-fest-gold-light hover:text-white hover:border-fest-sunset transition-all text-xs font-semibold"
                >
                  <span>Contingent Helpdesk</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with College Fest Identity & Legal */}
        <div className="mt-14 pt-8 border-t border-fest-gold/20 flex flex-col sm:flex-row items-center justify-between text-xs text-fest-champagne/70 font-sans gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-sans text-fest-gold-light font-bold">
              Organized by University Cultural Council & Student Body Societies
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-fest-sunset transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-fest-sunset transition-colors">
              Rules & Code of Conduct
            </Link>
            <Link href="/faq" className="hover:text-fest-sunset transition-colors">
              FAQ
            </Link>
          </div>

          <div>
            <span>© 2026 Rangmanch Inter-Collegiate Cultural Fest. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
