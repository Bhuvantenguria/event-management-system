"use client";

import React, { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from "lucide-react";
import { HeritageDivider } from "@/components/ui/heritage-decorations";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit helpdesk message.");
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while transmitting message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-medium text-heritage-gold font-sans">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-foreground">
          Fest <span className="maroon-gradient-text">Secretariat & Helpdesk</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans">
          Have queries regarding event registration, manual Paytm QR payment verification,
          accommodation, or student logistics? Our team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-card rounded-2xl p-6 sm:p-8 border border-heritage-gold/30 shadow-md space-y-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Contact Information
          </h2>

          <div className="space-y-4 text-xs sm:text-sm font-sans text-foreground">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-heritage-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-foreground">Campus Address</span>
                <span className="text-muted-foreground">
                  AIIMS Campus, Dalmau Road, Munshiganj, Raebareli, Uttar Pradesh - 229405
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-heritage-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-foreground">Email Support</span>
                <span className="text-muted-foreground">swar@aiimsraebareli.edu.in</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-heritage-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-foreground">Festival Helpline</span>
                <span className="text-muted-foreground">+91 98765 43210 (SWAR Desk)</span>
                <span className="text-muted-foreground block">+91 94512 88990 (WhatsApp Support)</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-heritage-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-foreground">Helpdesk Hours</span>
                <span className="text-muted-foreground">08:00 AM – 10:00 PM (IST)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-heritage-sandstone/15 border border-heritage-gold/20 text-xs text-muted-foreground">
            <p className="font-bold text-foreground mb-1">Anti-Ragging & Safety Notice</p>
            <p>
              AffinityAIIMS enforces strict zero-tolerance anti-ragging policies. 24/7 security
              and campus quick-response marshals are stationed across all festival grounds.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-card rounded-2xl p-6 sm:p-8 border border-heritage-gold/30 shadow-md">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto">
                Thank you for reaching out. A festival coordinator will reply to your registered
                email within 4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-md bg-heritage-maroon text-heritage-ivory text-xs font-semibold"
              >
                Send Another Query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Send an Inquiry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                    placeholder="e.g. Aditi Sharma"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                    placeholder="aditi@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                    placeholder="e.g. Lucknow University"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Subject / Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                    placeholder="e.g. Paytm QR Payment Inquiry"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Message / Inquiry *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-heritage-gold/50"
                  placeholder="Describe your query in detail..."
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold/40 shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-heritage-gold" />
                <span>{isLoading ? "Transmitting via SMTP..." : "Submit Message"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
