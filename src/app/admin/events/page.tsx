"use client";

import React, { useState, useEffect } from "react";
import { dataStore, StoredEvent } from "@/lib/data-store";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  Search,
  Filter,
  Tag,
  Trophy,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  { id: "cultural", name: "Cultural & Performing Arts" },
  { id: "music", name: "Classical Music & Sufi" },
  { id: "sports", name: "Sports & Athletics Arena" },
  { id: "literary", name: "Literary, Debating & Poetry" },
  { id: "technical", name: "Tech & Hackathons" },
  { id: "heritage_arts", name: "Heritage & Traditional Crafts" },
];

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState<StoredEvent[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Cultural & Performing Arts",
    categoryKey: "cultural",
    club: "University Cultural Council",
    description: "",
    date: "13 March 2026",
    time: "10:00 AM",
    venue: "Main Campus Block",
    registrationFee: 250,
    teamSize: "Individual or Team (1–4)",
    prizePool: "₹25,000",
    poster: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    images: [] as string[],
    status: "Registration Open" as "Registration Open" | "Registration Closed",
    rules: "Valid student ID required\nReporting time: 30 mins before schedule",
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadEvents = () => {
    setEventsList([...dataStore.getAllEvents()]);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setFormData({
      title: "",
      slug: "",
      category: "Cultural & Performing Arts",
      categoryKey: "cultural",
      club: "University Cultural Council",
      description: "",
      date: "13 March 2026",
      time: "10:00 AM",
      venue: "Main Campus Block",
      registrationFee: 250,
      teamSize: "Individual or Team (1–4)",
      prizePool: "₹25,000",
      poster: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
      ],
      status: "Registration Open",
      rules: "Valid student ID required\nReporting time: 30 mins before schedule",
    });
    setUploadError("");
    setIsModalOpen(true);
  };

  const openEditModal = (event: StoredEvent) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title,
      slug: event.slug,
      category: event.category,
      categoryKey: event.categoryKey || "cultural",
      club: event.club || "University Cultural Council",
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      registrationFee: event.registrationFee,
      teamSize: event.teamSize,
      prizePool: event.prizePool,
      poster: event.poster,
      images: event.images && event.images.length > 0 ? [...event.images] : [event.poster],
      status: event.status,
      rules: event.rules ? event.rules.join("\n") : "",
    });
    setUploadError("");
    setIsModalOpen(true);
  };

  // Upload Multiple Pictures Handler
  const handleMultiplePicsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError("");

    const newUploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 8 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 8MB limit.`);
        continue;
      }

      try {
        const bodyFormData = new FormData();
        bodyFormData.append("file", file);
        bodyFormData.append("folder", "affinity_aiims/events");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: bodyFormData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          newUploadedUrls.push(data.url);
        } else {
          // Fallback to local data URL preview if upload endpoint is offline
          const reader = new FileReader();
          reader.readAsDataURL(file);
          await new Promise<void>((resolve) => {
            reader.onload = () => {
              if (typeof reader.result === "string") {
                newUploadedUrls.push(reader.result);
              }
              resolve();
            };
          });
        }
      } catch (err: any) {
        setUploadError(err?.message || "Failed to upload one or more event pictures.");
      }
    }

    if (newUploadedUrls.length > 0) {
      setFormData((prev) => {
        const combined = [...prev.images, ...newUploadedUrls];
        return {
          ...prev,
          images: combined,
          poster: prev.poster || combined[0],
        };
      });
    }

    setIsUploading(false);
    // Reset file input value
    e.target.value = "";
  };

  const handleAddPicByUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.images, imageUrlInput.trim()];
      return {
        ...prev,
        images: updated,
        poster: prev.poster || updated[0],
      };
    });
    setImageUrlInput("");
  };

  const handleRemovePic = (indexToRemove: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        poster: updated.length > 0 ? updated[0] : "",
      };
    });
  };

  const handleSetPrimaryPoster = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      poster: url,
    }));
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const rulesList = formData.rules
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const imagesToSave = formData.images.length > 0 ? formData.images : [formData.poster];
    const posterToSave = formData.poster || imagesToSave[0];

    if (editingEventId) {
      // Update
      dataStore.updateEvent(editingEventId, {
        title: formData.title,
        slug,
        category: formData.category,
        categoryKey: formData.categoryKey,
        club: formData.club,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        registrationFee: Number(formData.registrationFee) || 0,
        teamSize: formData.teamSize,
        prizePool: formData.prizePool,
        poster: posterToSave,
        images: imagesToSave,
        status: formData.status,
        rules: rulesList,
      });
    } else {
      // Create
      dataStore.createEvent({
        title: formData.title,
        slug,
        category: formData.category,
        categoryKey: formData.categoryKey,
        club: formData.club,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        registrationFee: Number(formData.registrationFee) || 0,
        teamSize: formData.teamSize,
        prizePool: formData.prizePool,
        poster: posterToSave,
        images: imagesToSave,
        status: formData.status,
        rules: rulesList,
      });
    }

    setIsModalOpen(false);
    loadEvents();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleStatus = (id: string) => {
    const ev = dataStore.getEventById(id);
    if (!ev) return;
    const newStatus =
      ev.status === "Registration Open" ? "Registration Closed" : "Registration Open";
    dataStore.updateEvent(id, { status: newStatus });
    loadEvents();
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete event "${title}"? This cannot be undone.`)) {
      dataStore.deleteEvent(id);
      loadEvents();
    }
  };

  const filteredEvents = eventsList.filter((ev) => {
    const matchesSearch =
      !search ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue.toLowerCase().includes(search.toLowerCase()) ||
      (ev.club && ev.club.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" ||
      ev.categoryKey === categoryFilter ||
      ev.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/15 text-fest-sunset text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Management & Multi-Picture Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Create &amp; Manage <span className="gold-gradient-text">Festival Events</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Add new competitions, upload multiple event pictures to Cloudinary, configure fees, and control live registration status.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white text-xs font-bold shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Event saved successfully and published to festival website &amp; catalog!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-fest-sunset absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, venue, club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === "all"
                ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-sm"
                : "bg-background text-foreground hover:bg-fest-champagne/30 border border-border"
            }`}
          >
            All Events ({eventsList.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === c.id
                  ? "bg-fest-plum text-fest-gold border border-fest-gold shadow-sm"
                  : "bg-background text-foreground hover:bg-fest-champagne/30 border border-border"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Grid */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Event &amp; Pictures</th>
                <th className="py-3 px-4">Category &amp; Host Club</th>
                <th className="py-3 px-4">Date &amp; Venue</th>
                <th className="py-3 px-4">Fee &amp; Prizes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    No events found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-fest-champagne/20 transition-colors">
                    {/* Event & Pictures preview */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-fest-gold/40 shrink-0 bg-background">
                          <img
                            src={ev.poster || ev.images?.[0] || "/placeholder.jpg"}
                            alt={ev.title}
                            className="w-full h-full object-cover"
                          />
                          {ev.images && ev.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-black/80 text-[9px] text-white px-1 font-mono rounded-tl">
                              +{ev.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-serif text-sm font-bold text-foreground hover:text-fest-sunset transition-colors">
                            {ev.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-normal block">
                            Format: {ev.teamSize || "Individual"}
                          </span>
                          <span className="inline-flex items-center text-[10px] text-fest-gold font-medium mt-0.5">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            {ev.images?.length || 1} {ev.images?.length === 1 ? "picture" : "pictures"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Club */}
                    <td className="py-3.5 px-4 text-muted-foreground">
                      <span className="font-semibold text-foreground block">{ev.category}</span>
                      <span className="text-[10px] text-fest-sunset font-medium">
                        {ev.club || "Cultural Council"}
                      </span>
                    </td>

                    {/* Date & Venue */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-foreground">{ev.date}</p>
                      <p className="text-[10px] text-muted-foreground">{ev.venue}</p>
                      <p className="text-[10px] text-fest-gold">{ev.time}</p>
                    </td>

                    {/* Fee & Prize */}
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-fest-burgundy dark:text-fest-gold block text-sm">
                        {ev.registrationFee === 0 ? "Free Entry" : formatCurrency(ev.registrationFee)}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        Pool: {ev.prizePool || "Trophy"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ev.status === "Registration Open"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-destructive/20 text-destructive border border-destructive/30"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(ev.id)}
                          className="px-2 py-1 rounded text-[11px] font-semibold border border-border hover:bg-fest-champagne/30 text-foreground"
                          title="Toggle registration open/close"
                        >
                          {ev.status === "Registration Open" ? "Close" : "Open"}
                        </button>
                        <button
                          onClick={() => openEditModal(ev)}
                          className="p-1.5 rounded-lg border border-fest-gold/40 hover:bg-fest-sunset/15 text-fest-sunset transition-colors"
                          title="Edit event & pictures"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="p-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/15 text-destructive transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Event Modal with Multiple Pictures Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl max-w-2xl w-full border-2 border-fest-gold/60 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {editingEventId ? "Edit Festival Event" : "Create New Festival Event"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure event details and attach multiple pictures to showcase on the contest page.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-5 text-xs font-sans">
              {/* Event Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kathak Jugalbandi Night"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. kathak-jugalbandi-night"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              {/* Category & Club */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">Category *</label>
                  <select
                    value={formData.categoryKey}
                    onChange={(e) => {
                      const selected = CATEGORIES.find((c) => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        categoryKey: e.target.value,
                        category: selected?.name || e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Host College Club</label>
                  <input
                    type="text"
                    placeholder="e.g. Mudra Dance Society"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              {/* Fee, Team Size, Prize Pool */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">
                    Registration Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.registrationFee}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                  <span className="text-[10px] text-muted-foreground">0 for free entry</span>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Team Size / Format</label>
                  <input
                    type="text"
                    placeholder="e.g. 1–2 Dancers or 11 Players"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Prize Pool</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹35,000 + Trophy"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              {/* Date, Time & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">Event Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 13 March 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 05:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Auditorium"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  />
                </div>
              </div>

              {/* MULTIPLE PICTURES UPLOAD SECTION */}
              <div className="p-4 rounded-2xl bg-card border-2 border-dashed border-fest-gold/40 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-foreground text-sm flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2 text-fest-sunset" />
                      Event Pictures Gallery ({formData.images.length} Attached)
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Upload multiple pictures for this event. First picture serves as primary banner.
                    </p>
                  </div>

                  <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-fest-plum hover:bg-fest-burgundy text-white font-bold cursor-pointer text-xs border border-fest-gold/40 shadow-sm shrink-0">
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-fest-gold-light" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload Multiple Pics"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultiplePicsUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadError && (
                  <p className="text-xs text-destructive flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {uploadError}
                  </p>
                )}

                {/* Add by URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste external image URL and click add..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPicByUrl}
                    className="px-3 py-1.5 rounded-lg border border-fest-gold/50 text-foreground hover:bg-fest-champagne/30 text-xs font-semibold"
                  >
                    Add Pic
                  </button>
                </div>

                {/* Thumbnail Strip */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.images.map((picUrl, idx) => {
                      const isPrimary = formData.poster === picUrl;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 group aspect-video bg-background ${
                            isPrimary ? "border-fest-sunset shadow-md" : "border-border"
                          }`}
                        >
                          <img
                            src={picUrl}
                            alt={`Event pic ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Primary Badge */}
                          {isPrimary && (
                            <span className="absolute top-1 left-1 bg-fest-sunset text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                              Primary Poster
                            </span>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryPoster(picUrl)}
                                className="px-1.5 py-1 rounded bg-fest-gold text-fest-charcoal text-[9px] font-bold"
                                title="Set as primary poster"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePic(idx)}
                              className="w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
                              title="Remove picture"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-xs">
                    No pictures attached yet. Upload files or paste URLs above.
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-bold block mb-1 text-foreground">
                  Event Description &amp; Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide an overview of the competition, eligibility, round format..."
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>

              {/* Rules & Guidelines */}
              <div>
                <label className="font-bold block mb-1 text-foreground">
                  Contest Rules &amp; Guidelines (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="e.g. Reporting time 30 mins prior&#10;College ID card mandatory"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>

              {/* Registration Status */}
              <div>
                <label className="font-bold block mb-1 text-foreground">Registration Status</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Registration Open"
                      checked={formData.status === "Registration Open"}
                      onChange={() => setFormData({ ...formData, status: "Registration Open" })}
                      className="text-fest-sunset"
                    />
                    <span className="text-foreground">Registration Open</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Registration Closed"
                      checked={formData.status === "Registration Closed"}
                      onChange={() => setFormData({ ...formData, status: "Registration Closed" })}
                      className="text-fest-sunset"
                    />
                    <span className="text-foreground">Registration Closed</span>
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white font-bold shadow-md transition-all"
                >
                  {editingEventId ? "Save Changes" : "Create Event & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
