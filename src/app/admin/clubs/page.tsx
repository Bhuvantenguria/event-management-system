"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Flame,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";

interface ClubItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  motto?: string;
  badge?: string;
  coordinator?: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  color?: string;
  eventsHosted?: string[];
  eventCount?: string;
  prizes?: string;
}

const CLUB_CATEGORIES = [
  "Dance & Performing Arts",
  "Music & Band Battles",
  "Theatre & Dramatics",
  "Literary, Poetry & Debates",
  "Fine Arts & Design",
  "Sports Tournaments",
  "Tech & Innovation",
  "Cultural Heritage & Traditional Crafts",
  "Other Student Society",
];

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClubId, setEditingClubId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Dance & Performing Arts",
    motto: "",
    badge: "Official Collegiate Society",
    coordinator: "",
    coordinatorEmail: "",
    coordinatorPhone: "",
    description: "",
    color: "from-fest-sunset to-fest-burgundy",
    eventsHosted: "",
    eventCount: "",
    prizes: "",
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadClubs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clubs");
      if (res.ok) {
        const data = await res.json();
        if (data.clubs) setClubs(data.clubs);
      }
    } catch (err) {
      console.error("Failed to load clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const openCreateModal = () => {
    setEditingClubId(null);
    setFormData({
      name: "",
      slug: "",
      category: "Dance & Performing Arts",
      motto: "",
      badge: "Official Collegiate Society",
      coordinator: "",
      coordinatorEmail: "",
      coordinatorPhone: "",
      description: "",
      color: "from-fest-sunset to-fest-burgundy",
      eventsHosted: "",
      eventCount: "",
      prizes: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (club: ClubItem) => {
    setEditingClubId(club.id);
    setFormData({
      name: club.name,
      slug: club.slug,
      category: club.category,
      motto: club.motto || "",
      badge: club.badge || "",
      coordinator: club.coordinator || "",
      coordinatorEmail: club.coordinatorEmail || "",
      coordinatorPhone: club.coordinatorPhone || "",
      description: club.description || "",
      color: club.color || "from-fest-sunset to-fest-burgundy",
      eventsHosted: Array.isArray(club.eventsHosted) ? club.eventsHosted.join(", ") : "",
      eventCount: club.eventCount || "",
      prizes: club.prizes || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Club name is required.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    const eventsHostedArray = formData.eventsHosted
      ? formData.eventsHosted
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...formData,
      eventsHosted: eventsHostedArray,
    };

    try {
      let res;
      if (editingClubId) {
        res = await fetch("/api/clubs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClubId, ...payload }),
        });
      } else {
        res = await fetch("/api/clubs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save club.");
      }

      setSuccessMsg(editingClubId ? "Club updated successfully!" : "New club created successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setIsModalOpen(false);
      loadClubs();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/clubs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to delete club.");
        return;
      }
      setSuccessMsg(`Club "${name}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      loadClubs();
    } catch (err) {
      alert("Error deleting club.");
    }
  };

  const filteredClubs = clubs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      (c.coordinator && c.coordinator.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-fest-sunset/15 border border-fest-sunset/30 flex items-center justify-center text-fest-sunset">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Collegiate Cultural Clubs (CRUD)
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Create, curate, and administer university societies that host festival events and competitions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy text-white text-xs font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Club</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clubs by name, category, or student lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
        >
          <option value="all">All Categories ({clubs.length})</option>
          {CLUB_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-fest-sunset" />
          <span className="text-xs">Loading college cultural clubs...</span>
        </div>
      ) : filteredClubs.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40 p-8 space-y-3">
          <Layers className="w-10 h-10 text-muted-foreground/60 mx-auto" />
          <h3 className="font-serif text-base font-bold text-foreground">No Cultural Clubs Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search ? "No clubs matched your search criteria." : "No clubs have been registered yet."}
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Club</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="group relative rounded-2xl bg-card border border-border/80 hover:border-fest-sunset/50 transition-all p-5 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-fest-sunset block">
                      {club.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-fest-gold transition-colors">
                      {club.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(club)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Edit Club"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(club.id, club.name)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Delete Club"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Motto */}
                {club.motto && (
                  <p className="text-xs font-serif italic text-fest-gold-light mb-2">
                    “{club.motto}”
                  </p>
                )}

                {/* Badge */}
                {club.badge && (
                  <span className="inline-block text-[10px] font-sans px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground mb-3 font-semibold">
                    {club.badge}
                  </span>
                )}

                {/* Description */}
                {club.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {club.description}
                  </p>
                )}

                {/* Events Hosted */}
                {club.eventsHosted && club.eventsHosted.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">
                      Curated Competitions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {club.eventsHosted.slice(0, 3).map((ev, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-fest-plum/30 text-fest-champagne border border-fest-gold/20"
                        >
                          {ev}
                        </span>
                      ))}
                      {club.eventsHosted.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{club.eventsHosted.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Coordinator Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-fest-sunset shrink-0" />
                  <span className="font-medium text-foreground">
                    {club.coordinator || "General Secretariat"}
                  </span>
                </div>
                {club.prizes && (
                  <span className="text-fest-gold font-bold">
                    {club.prizes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Club Modal */}
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
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-bold text-foreground">
                {editingClubId ? "Edit Cultural Club" : "Create New College Cultural Club"}
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
                <label className="block font-bold text-foreground mb-1">Club Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mudra Dance Society"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  >
                    {CLUB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Badge Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Est. 2012 • 45 Active Dancers"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  placeholder="e.g. Rhythms of Kathak & Classical Grace"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Lead / Coordinator</label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Mishra"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Lead Email</label>
                  <input
                    type="email"
                    placeholder="dance@aiims.edu"
                    value={formData.coordinatorEmail}
                    onChange={(e) => setFormData({ ...formData, coordinatorEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Lead Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.coordinatorPhone}
                    onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">
                  Curated Competitions (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kathak Jugalbandi, Braj Mayur Nritya, Choreo Night"
                  value={formData.eventsHosted}
                  onChange={(e) => setFormData({ ...formData, eventsHosted: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Total Prize Pool</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,25,000"
                    value={formData.prizes}
                    onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Contests Count Text</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Contests"
                    value={formData.eventCount}
                    onChange={(e) => setFormData({ ...formData, eventCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">About the Club</label>
                <textarea
                  rows={3}
                  placeholder="Provide a brief overview of the club's artistic vision, traditions, and collegiate activities..."
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
                  <span>{editingClubId ? "Update Club" : "Create Club"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
