"use client";

import React, { useState } from "react";
import { Clock, Plus, Trash2, MapPin, Calendar } from "lucide-react";

export default function AdminScheduleCMSPage() {
  const [scheduleList, setScheduleList] = useState<any[]>([
    {
      id: "sch-1",
      day: 1,
      title: "Ganga Aarti & Deep Prajjwalan",
      time: "09:30 AM – 10:30 AM",
      venue: "Central Quadrangle",
      category: "Ceremony",
    },
    {
      id: "sch-2",
      day: 1,
      title: "Football Knockout: Matches 1–4",
      time: "11:00 AM – 01:30 PM",
      venue: "Main Sports Turf",
      category: "Sports",
    },
    {
      id: "sch-3",
      day: 1,
      title: "Kathak Jugalbandi – Classical Dance Showcase",
      time: "05:30 PM – 08:30 PM",
      venue: "Nawab Wajid Ali Shah Auditorium",
      category: "Cultural",
    },
  ]);

  const [createModal, setCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({
    day: 1,
    title: "",
    time: "10:00 AM – 12:00 PM",
    venue: "Main Auditorium",
    category: "Cultural",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleList([...scheduleList, { id: `sch-${Date.now()}`, ...newItem }]);
    setCreateModal(false);
    setNewItem({ day: 1, title: "", time: "10:00 AM – 12:00 PM", venue: "Main Auditorium", category: "Cultural" });
  };

  const handleDelete = (id: string) => {
    setScheduleList(scheduleList.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Schedule & Itinerary <span className="gold-gradient-text">CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure festival days, time slots, venues, and synchronize with the public timeline
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Slot</span>
        </button>
      </div>

      <div className="space-y-3">
        {scheduleList.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-card border border-heritage-gold/30 hover:border-heritage-gold shadow-sm transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-heritage-maroon text-heritage-ivory uppercase">
                  Day {item.day}
                </span>
                <span className="text-xs font-mono text-heritage-gold-dark dark:text-heritage-gold font-bold">
                  {item.time}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-heritage-gold" />
                <span>{item.venue}</span>
              </p>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-destructive hover:opacity-80 p-1"
              title="Delete slot"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {createModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-md w-full border border-heritage-gold p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Add Schedule Item
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Festival Day</label>
                <select
                  value={newItem.day}
                  onChange={(e) => setNewItem({ ...newItem, day: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                >
                  <option value={1}>Day 1 (12 March 2026)</option>
                  <option value={2}>Day 2 (13 March 2026)</option>
                  <option value={3}>Day 3 (14 March 2026)</option>
                  <option value={4}>Day 4 (15 March 2026)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shaam-e-Awadh Ghazal Night"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={newItem.venue}
                    onChange={(e) => setNewItem({ ...newItem, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>
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
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
