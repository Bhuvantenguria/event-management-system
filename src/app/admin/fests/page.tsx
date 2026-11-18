"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  MapPin,
  Flame,
  Radio,
  ArrowRight,
} from "lucide-react";
import { CountdownTimer } from "@/components/home/countdown";

interface FestItem {
  id: string;
  name: string;
  edition?: string;
  tagline?: string;
  theme?: string;
  startDate: string;
  endDate: string;
  dateBadge?: string;
  venue: string;
  description?: string;
  isPrimary: boolean;
  status: "upcoming" | "ongoing" | "completed" | "archived";
}

export default function AdminFestsPage() {
  const [fests, setFests] = useState<FestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [primaryFest, setPrimaryFestState] = useState<FestItem | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFestId, setEditingFestId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    edition: "Annual Inter-Collegiate Cultural Fest",
    tagline: "Where Healthcare Leaders, Cultural Heritage & Youth Energy Converge",
    theme: "Parampara – Heritage of Uttar Pradesh",
    startDate: "2026-03-12T09:00",
    endDate: "2026-03-15T22:00",
    dateBadge: "12–15 March 2026",
    venue: "AIIMS Raebareli Main Campus",
    description: "",
    isPrimary: false,
    status: "upcoming" as "upcoming" | "ongoing" | "completed" | "archived",
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadFests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fests");
      if (res.ok) {
        const data = await res.json();
        if (data.fests) {
          setFests(data.fests);
          const prim = data.fests.find((f: FestItem) => f.isPrimary) || data.fests[0] || null;
          setPrimaryFestState(prim);
        }
      }
    } catch (err) {
      console.error("Failed to load fests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFests();
  }, []);

  const openCreateModal = () => {
    setEditingFestId(null);
    setFormData({
      name: "",
      edition: "Annual Inter-Collegiate Cultural Fest",
      tagline: "Where Healthcare Leaders, Cultural Heritage & Youth Energy Converge",
      theme: "Parampara – Heritage of Uttar Pradesh",
      startDate: "2026-03-12T09:00",
      endDate: "2026-03-15T22:00",
      dateBadge: "12–15 March 2026",
      venue: "AIIMS Raebareli Main Campus",
      description: "",
      isPrimary: fests.length === 0,
      status: "upcoming",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (fest: FestItem) => {
    setEditingFestId(fest.id);
    setFormData({
      name: fest.name,
      edition: fest.edition || "",
      tagline: fest.tagline || "",
      theme: fest.theme || "",
      startDate: fest.startDate.slice(0, 16),
      endDate: fest.endDate.slice(0, 16),
      dateBadge: fest.dateBadge || "",
      venue: fest.venue || "",
      description: fest.description || "",
      isPrimary: fest.isPrimary,
      status: fest.status,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.startDate || !formData.endDate || !formData.venue.trim()) {
      setErrorMsg("Please fill in fest name, start date, end date, and venue.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      let res;
      if (editingFestId) {
        res = await fetch("/api/fests", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingFestId, ...formData }),
        });
      } else {
        res = await fetch("/api/fests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save fest schedule.");
      }

      setSuccessMsg(
        editingFestId
          ? "Fest schedule updated! Homepage timeclock autosynced."
          : "New fest scheduled! Homepage timeclock autosynced."
      );
      setTimeout(() => setSuccessMsg(""), 4500);
      setIsModalOpen(false);
      loadFests();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (festId: string, festName: string) => {
    try {
      const res = await fetch("/api/fests/primary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to set primary fest.");
        return;
      }
      setSuccessMsg(`"${festName}" is now the primary active fest. Homepage timeclock autosynced!`);
      setTimeout(() => setSuccessMsg(""), 4500);
      loadFests();
    } catch {
      alert("Error setting primary fest.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the schedule for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/fests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to delete fest schedule.");
        return;
      }
      setSuccessMsg(`Fest schedule "${name}" deleted.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      loadFests();
    } catch {
      alert("Error deleting fest schedule.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-fest-sunset/15 border border-fest-sunset/30 flex items-center justify-center text-fest-sunset">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Fest Schedule & Homepage Timeclock Autosync
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Schedule festival editions, set the primary fest, and automatically synchronize the live homepage countdown timer.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white text-xs font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Fest</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Primary Fest & Homepage Timeclock Live Card */}
      {primaryFest && (
        <div className="relative rounded-2xl bg-gradient-to-br from-fest-charcoal/90 via-fest-plum/60 to-fest-burgundy/40 border-2 border-fest-gold/50 shadow-2xl p-6 sm:p-8 overflow-hidden text-white">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-fest-sunset/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-fest-sunset/30 border border-fest-sunset/60 text-fest-champagne text-[11px] font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 text-fest-gold fill-fest-gold" />
                <span>Active Primary Fest (Driving Homepage Countdown Clock)</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fest-champagne via-fest-gold to-fest-sunset">
                {primaryFest.name}
              </h2>

              {primaryFest.tagline && (
                <p className="text-xs sm:text-sm font-serif italic text-fest-gold-light/90">
                  “{primaryFest.tagline}”
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-fest-champagne/80 font-sans pt-1">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-fest-gold" />
                  <span className="font-semibold text-white">
                    {primaryFest.dateBadge || "12–15 March 2026"}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-fest-sunset" />
                  <span>{primaryFest.venue}</span>
                </div>
                <span>•</span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-fest-gold/20 text-fest-gold border border-fest-gold/30 text-[10px] font-bold">
                  {primaryFest.status}
                </span>
              </div>
            </div>

            {/* Live Countdown Component Preview */}
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-fest-charcoal/80 border border-fest-gold/30 shadow-xl backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-fest-champagne/80 font-bold mb-1 flex items-center space-x-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Live Timeclock Autosync Preview</span>
              </span>
              <CountdownTimer targetDate={primaryFest.startDate} />
              <span className="text-[10px] text-muted-foreground text-center font-sans mt-1">
                Target Start Date: {new Date(primaryFest.startDate).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Fests List */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-foreground">
          All Festival Schedules ({fests.length})
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-fest-sunset" />
            <span className="text-xs">Loading festival schedules...</span>
          </div>
        ) : fests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40 p-8 space-y-3">
            <Calendar className="w-10 h-10 text-muted-foreground/60 mx-auto" />
            <h4 className="font-serif text-base font-bold text-foreground">No Fests Scheduled Yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Schedule your first festival edition to set the dates and activate the homepage countdown clock.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Fest</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fests.map((fest) => (
              <div
                key={fest.id}
                className={`rounded-2xl bg-card border transition-all p-5 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  fest.isPrimary
                    ? "border-fest-sunset/80 bg-fest-sunset/5 ring-1 ring-fest-sunset/30"
                    : "border-border hover:border-fest-sunset/40"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      {fest.isPrimary && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-fest-sunset text-white text-[9px] font-bold uppercase tracking-wider mb-1">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>Primary Timeclock Anchor</span>
                        </span>
                      )}
                      <h4 className="font-serif text-xl font-bold text-foreground">
                        {fest.name}
                      </h4>
                      {fest.edition && (
                        <span className="text-xs text-muted-foreground block font-sans">
                          {fest.edition}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(fest)}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Edit Fest"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(fest.id, fest.name)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Delete Fest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {fest.tagline && (
                    <p className="text-xs font-serif italic text-fest-gold-light mb-3">
                      “{fest.tagline}”
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-fest-sunset shrink-0" />
                      <span className="font-medium text-foreground">
                        {fest.dateBadge || `${new Date(fest.startDate).toLocaleDateString()} – ${new Date(fest.endDate).toLocaleDateString()}`}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-fest-gold shrink-0" />
                      <span>
                        Starts: {new Date(fest.startDate).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{fest.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {fest.status}
                  </span>

                  {!fest.isPrimary ? (
                    <button
                      onClick={() => handleSetPrimary(fest.id, fest.name)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-fest-plum/20 hover:bg-fest-sunset hover:text-white text-fest-champagne text-xs font-bold border border-fest-gold/30 transition-all cursor-pointer"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set as Primary (Autosync Timer)</span>
                    </button>
                  ) : (
                    <span className="text-xs text-fest-sunset font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Countdown</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-fest-sunset/15 text-fest-sunset flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-bold text-foreground">
                {editingFestId ? "Edit Fest Schedule" : "Schedule New Festival Edition"}
              </h2>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Fest Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AffinityAIIMS '26 / रंगमंच UP 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Edition Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Cultural Fest"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Date Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. 12–15 March 2026"
                    value={formData.dateBadge}
                    onChange={(e) => setFormData({ ...formData, dateBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Where Healthcare Leaders, Cultural Heritage & Youth Energy Converge"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">
                    Start Date & Time (Countdown Anchor) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Venue Campus *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIIMS Raebareli Main Campus"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing (Live Now)</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                      className="rounded border-border text-fest-sunset focus:ring-fest-sunset"
                    />
                    <span className="font-bold text-foreground">Set as Primary Active Fest</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of this festival edition..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white font-bold shadow-md hover:brightness-110 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingFestId ? "Update & Sync Timer" : "Schedule & Sync Timer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
