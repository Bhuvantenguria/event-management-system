"use client";

import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { SAMPLE_FEATURED_EVENTS } from "@/components/home/featured-events";
import { formatCurrency } from "@/lib/utils";

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState<any[]>(SAMPLE_FEATURED_EVENTS);
  const [createModal, setCreateModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    slug: "",
    category: "Cultural & Performing Arts",
    description: "",
    registrationFee: 250,
    date: "13 March 2026",
    time: "10:00 AM",
    venue: "Main Block Auditorium",
    teamSize: "Individual",
    prizePool: "₹25,000",
    poster:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    status: "Registration Open",
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created = {
      ...newEvent,
      id: `ev-${Date.now()}`,
      slug,
    };
    setEventsList([created, ...eventsList]);
    setCreateModal(false);
    setNewEvent({
      title: "",
      slug: "",
      category: "Cultural & Performing Arts",
      description: "",
      registrationFee: 250,
      date: "13 March 2026",
      time: "10:00 AM",
      venue: "Main Block Auditorium",
      teamSize: "Individual",
      prizePool: "₹25,000",
      poster:
        "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
      status: "Registration Open",
    });
  };

  const handleToggleStatus = (id: string) => {
    setEventsList((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              status:
                ev.status === "Registration Open"
                  ? "Registration Closed"
                  : "Registration Open",
            }
          : ev
      )
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEventsList((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Festival Events <span className="gold-gradient-text">CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create, edit, close registration, and manage official festival competitions
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Event Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Venue</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {eventsList.map((ev) => (
                <tr key={ev.id} className="hover:bg-heritage-sandstone/10">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {ev.title}
                    <span className="block text-[10px] text-muted-foreground font-normal">
                      Prize: {ev.prizePool}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{ev.category}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-foreground">{ev.date}</p>
                    <p className="text-[10px] text-muted-foreground">{ev.venue}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-heritage-maroon dark:text-heritage-gold">
                    {ev.registrationFee === 0 ? "Free" : formatCurrency(ev.registrationFee)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.status === "Registration Open"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleStatus(ev.id)}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        {ev.status === "Registration Open" ? "Close" : "Re-open"}
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-destructive hover:opacity-80 p-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Event Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-xl w-full border border-heritage-gold p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Create New Festival Competition
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sitar Jugalbandi Battle"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Category *</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  >
                    <option value="Cultural & Performing Arts">Cultural & Performing Arts</option>
                    <option value="Heritage & Traditional Crafts">Heritage & Traditional Crafts</option>
                    <option value="Sports & Athletics Arena">Sports & Athletics Arena</option>
                    <option value="Literary, Debating & Poetry">Literary, Debating & Poetry</option>
                    <option value="Technical & Innovation">Technical & Innovation</option>
                    <option value="E-Sports & Gaming">E-Sports & Gaming</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Registration Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newEvent.registrationFee}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, registrationFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Date</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Venue</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Provide brief guidelines, rules, and rules for participants..."
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="px-4 py-1.5 rounded border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-heritage-maroon text-heritage-ivory font-bold border border-heritage-gold"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
