"use client";

import React, { useState } from "react";
import { Bell, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([
    {
      id: "ann-1",
      title: "Early Bird Registration Reminder",
      content: "Early bird registration for Football Knockouts and Kathak Jugalbandi closing on 5th March! Paytm QR verification processing is live.",
      type: "urgent",
      isPublished: true,
      date: "01 Mar 2026",
    },
    {
      id: "ann-2",
      title: "Outstation Accommodation Guidelines Released",
      content: "Hostel accommodation guidelines and campus check-in procedures have been published for verified collegiate delegations.",
      type: "info",
      isPublished: true,
      date: "28 Feb 2026",
    },
  ]);

  const [createModal, setCreateModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", content: "", type: "info" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        ...newAnn,
        isPublished: true,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      },
      ...announcements,
    ]);
    setCreateModal(false);
    setNewAnn({ title: "", content: "", type: "info" });
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Festival <span className="gold-gradient-text">Announcements CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Publish broadcast bulletins, schedule updates, and urgent alerts shown on the homepage ticker
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-card border border-heritage-gold/30 hover:border-heritage-gold shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.type === "urgent"
                      ? "bg-destructive text-white"
                      : "bg-heritage-maroon text-heritage-ivory"
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{item.date}</span>
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground max-w-2xl">{item.content}</p>
            </div>

            <div className="shrink-0 flex items-center space-x-3">
              <span className="text-[10px] text-emerald-600 font-bold">● Active on Ticker</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-destructive hover:opacity-80 p-1"
                title="Delete alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {createModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-lg w-full border border-heritage-gold p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Create Broadcast Announcement
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Change: Football Finals Shifted to 10:30 AM"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Alert Priority *</label>
                <select
                  value={newAnn.type}
                  onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border text-foreground"
                >
                  <option value="info">Info / General Bulletin</option>
                  <option value="urgent">Urgent / High Priority Alert</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Announcement Details *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Full bulletin message..."
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border text-foreground"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="px-4 py-1.5 rounded border border-border text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-heritage-maroon text-heritage-ivory font-bold border border-heritage-gold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
