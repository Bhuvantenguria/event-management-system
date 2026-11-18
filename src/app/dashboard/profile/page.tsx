"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { dataStore } from "@/lib/data-store";
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ParticipantProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userEmail = user?.email || "student@example.com";
  const storedUser = dataStore.getUserByEmail(userEmail);

  const [name, setName] = useState(storedUser?.name || user?.name || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");
  const [college, setCollege] = useState(storedUser?.college || (user as any)?.college || "");
  const [studentId, setStudentId] = useState(storedUser?.studentId || (user as any)?.studentId || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          if (data.user.name) setName(data.user.name);
          if (data.user.phone) setPhone(data.user.phone);
          if (data.user.college) setCollege(data.user.college);
          if (data.user.studentId) setStudentId(data.user.studentId);
        }
      })
      .catch(() => {});
  }, [userEmail]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          college,
          studentId,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      } else {
        setMessage({ type: "success", text: "Profile details updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
          Profile & <span className="gold-gradient-text">Credentials</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-sans">
          Manage your personal details, institutional verification, and account password
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-start space-x-2 font-sans ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-card rounded-2xl border border-heritage-gold/30 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Student Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Email Address (Read Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={userEmail}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-muted border border-border text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Lucknow University"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Student ID / Roll Number
              </label>
              <div className="relative">
                <FileCheck className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="LU-2024-8891"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground font-sans block mb-1">
              WhatsApp / Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94512 34567"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-card rounded-2xl border border-heritage-gold/30 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Security & Password Update
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            Leave blank if you do not wish to change your password.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heritage-gold transition-colors focus:outline-none"
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heritage-gold transition-colors focus:outline-none"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heritage-gold transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-heritage-gold" />
          <span>{loading ? "Saving Changes..." : "Save Profile Details"}</span>
        </button>
      </form>
    </div>
  );
}
