"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LotusOrnament } from "@/components/ui/heritage-decorations";
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          studentId: formData.studentId,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Auto sign in on successful registration
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during signup.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 jaali-bg opacity-30 pointer-events-none" />

      <div className="max-w-xl w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-t-full rounded-b-md bg-heritage-maroon flex items-center justify-center border border-heritage-gold shadow-md">
            <LotusOrnament className="w-6 h-6 text-heritage-gold" />
          </div>
          <h1 className="font-serif text-3xl font-black text-foreground">
            Affinity<span className="gold-gradient-text">AIIMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Participant Registration • Join 5,000+ Collegiate Delegates
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-heritage-gold/40 p-6 sm:p-8 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start space-x-2 font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Aditi Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aditi@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  College / Institution *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. Lucknow University"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Student ID / Roll No. *
                </label>
                <div className="relative">
                  <FileCheck className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="LU-2024-8891"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                WhatsApp / Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94512 34567"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground font-sans">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-heritage-gold-dark dark:text-heritage-gold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-heritage-gold-dark dark:text-heritage-gold hover:underline">
                Privacy Policy
              </Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Complete Participant Registration</span>
                  <ArrowRight className="w-4 h-4 text-heritage-gold" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-muted-foreground font-sans">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-heritage-maroon dark:text-heritage-gold font-bold hover:underline"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
