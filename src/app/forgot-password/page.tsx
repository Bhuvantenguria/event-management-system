"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LotusOrnament } from "@/components/ui/heritage-decorations";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to process password reset request.");
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 jaali-bg opacity-30 pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-t-full rounded-b-md bg-heritage-maroon flex items-center justify-center border border-heritage-gold shadow-md">
            <LotusOrnament className="w-6 h-6 text-heritage-gold" />
          </div>
          <h1 className="font-serif text-3xl font-black text-foreground">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Enter your registered festival email address
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-heritage-gold/40 p-6 sm:p-8 shadow-xl space-y-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-foreground">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>,
                we have transmitted a secure password reset link via Gmail SMTP.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-semibold text-heritage-maroon dark:text-heritage-gold hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <span>{isLoading ? "Dispatching via SMTP..." : "Send Reset Link"}</span>
                <ArrowRight className="w-4 h-4 text-heritage-gold" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-sans"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
