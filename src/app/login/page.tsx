"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LotusOrnament } from "@/components/ui/heritage-decorations";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Invalid email or password. Please verify your credentials and try again.");
        } else {
          setError(res.error);
        }
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected login error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-heritage-gold/40 p-6 sm:p-8 shadow-xl space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start space-x-2 font-sans">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

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
              placeholder="admin@aiimsraebareli.edu.in"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-foreground font-sans">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-heritage-maroon dark:text-heritage-gold hover:underline font-sans"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-heritage-gold" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground font-sans border-t border-border">
        Don't have an account yet?{" "}
        <Link
          href="/register"
          className="text-heritage-maroon dark:text-heritage-gold font-bold hover:underline"
        >
          Sign up as Participant
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 jaali-bg opacity-30 pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-t-full rounded-b-md bg-heritage-maroon flex items-center justify-center border border-heritage-gold shadow-md">
            <LotusOrnament className="w-6 h-6 text-heritage-gold" />
          </div>
          <h1 className="font-serif text-3xl font-black text-foreground">
            Rangmanch<span className="gold-gradient-text">'26</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Festival Portal Login
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs">Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
