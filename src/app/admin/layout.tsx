"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  CreditCard,
  QrCode,
  ScanLine,
  Trophy,
  Landmark,
  Image as ImageIcon,
  Clock,
  Award,
  Bell,
  Mail,
  Settings,
  FileSpreadsheet,
  Shield,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { LotusOrnament } from "@/components/ui/heritage-decorations";
import { ThemeToggle } from "@/components/theme-toggle";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Create & Manage Events", href: "/admin/events", icon: Calendar },
  { name: "Registrations List", href: "/admin/registrations", icon: Users },
  { name: "Payment Approvals", href: "/admin/payments", icon: CreditCard },
  { name: "Gallery Media (CRUD)", href: "/admin/gallery", icon: ImageIcon },
  { name: "Organizer Paytm QR", href: "/admin/settings", icon: QrCode },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const role = (user as any)?.role;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-heritage-gold/30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-heritage-maroon flex items-center justify-center border border-heritage-gold">
            <LotusOrnament className="w-4 h-4 text-heritage-gold" />
          </div>
          <span className="font-serif font-bold text-sm text-foreground">
            AffinityAIIMS Admin
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-md border border-heritage-gold/30 bg-background"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } lg:block w-full lg:w-64 xl:w-72 bg-card border-r border-heritage-gold/30 flex flex-col justify-between shrink-0 p-4 sm:p-6 z-40`}
      >
        <div className="space-y-6">
          {/* Brand & Staff Role Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-t-full rounded-b-md bg-heritage-maroon flex items-center justify-center border border-heritage-gold shrink-0">
              <LotusOrnament className="w-5 h-5 text-heritage-gold" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-serif text-base font-bold text-foreground truncate">
                Admin Control
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-heritage-gold-dark dark:text-heritage-gold font-sans font-bold">
                Administrator
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-3 mb-2 block font-sans">
              Administration Modules
            </span>
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-heritage-maroon text-heritage-ivory shadow-sm border border-heritage-gold/40"
                      : "text-foreground hover:bg-heritage-sandstone/15"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-heritage-gold" : "text-heritage-gold-dark dark:text-heritage-gold"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-heritage-gold" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Public Website</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground font-sans"
          >
            <Users className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Participant View</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-2 w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded font-sans"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Container */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
