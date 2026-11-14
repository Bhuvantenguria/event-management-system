"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  Ticket,
  CreditCard,
  User,
  ShieldAlert,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { LotusOrnament } from "@/components/ui/heritage-decorations";

const DASHBOARD_LINKS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Registrations", href: "/dashboard/registrations", icon: CalendarCheck },
  { name: "Digital QR Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Payments & UPI Proofs", href: "/dashboard/payments", icon: CreditCard },
  { name: "Profile & Settings", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const user = session?.user;
  const role = (user as any)?.role;
  const isAdmin = role && ["admin", "super_admin"].includes(role);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-card border-r border-heritage-gold/30 flex flex-col justify-between p-4 sm:p-6 shrink-0">
        <div className="space-y-6">
          {/* User Profile Summary */}
          <div className="p-4 rounded-xl bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/30 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-heritage-maroon text-heritage-ivory flex items-center justify-center font-serif text-lg font-bold border border-heritage-gold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif font-bold text-sm text-foreground truncate">
                {user?.name || "Participant"}
              </h3>
              <p className="text-[11px] text-muted-foreground truncate font-sans">
                {user?.email}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-heritage-gold/20 text-heritage-gold-dark dark:text-heritage-gold-light border border-heritage-gold/40">
                {role || "participant"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 mb-2 block font-sans">
              Participant Menu
            </span>
            {DASHBOARD_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-heritage-maroon text-heritage-ivory shadow-sm border border-heritage-gold/40"
                      : "text-foreground hover:bg-heritage-sandstone/20"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-heritage-gold" : "text-heritage-gold-dark dark:text-heritage-gold"
                      }`}
                    />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-heritage-gold" />}
                </Link>
              );
            })}
          </nav>

          {/* Admin Switch if authorized */}
          {isAdmin && (
            <div className="pt-4 border-t border-border">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 mb-2 block font-sans">
                Administrator
              </span>
              <Link
                href="/admin"
                className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-bold bg-heritage-maroon/20 text-heritage-maroon dark:text-heritage-gold hover:bg-heritage-maroon/30 transition-colors border border-heritage-maroon/30"
              >
                <ShieldAlert className="w-4 h-4 text-heritage-red" />
                <span>Switch to Admin Panel</span>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-border space-y-3">
          <Link
            href="/events"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold text-heritage-gold-dark dark:text-heritage-gold hover:bg-heritage-sandstone/15 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Browse More Events</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
