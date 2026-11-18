"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LotusOrnament } from "@/components/ui/heritage-decorations";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token") || searchParams.get("resetToken") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [tokenParam, emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing. Please click the reset link directly from your email.");
      return;
    }

    if (!email) {
      setError("Email address is missing. Please check your reset link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          token: token.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            AffinityAIIMS &apos;26 Festival Account Security
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-heritage-gold/40 p-6 sm:p-8 shadow-xl space-y-6">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-foreground">
                Password Reset Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Your password has been securely updated. You can now sign in with your new credentials.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4 text-heritage-gold" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {email && (
                <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-md border border-border">
                  Resetting password for: <span className="font-semibold text-foreground">{email}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heritage-gold transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heritage-gold transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <span>Reset &amp; Save Password</span>
                    <ArrowRight className="w-4 h-4 text-heritage-gold" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2 text-xs text-muted-foreground font-sans border-t border-border">
            Remember your credentials?{" "}
            <Link
              href="/login"
              className="text-heritage-gold-dark dark:text-heritage-gold hover:underline font-bold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="text-xs text-muted-foreground animate-pulse">Loading password reset form...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
