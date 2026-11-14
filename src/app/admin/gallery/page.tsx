"use client";

import React, { useState, useEffect } from "react";
import { dataStore, StoredGalleryItem } from "@/lib/data-store";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  Search,
  Filter,
  X,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";

const CATEGORIES = [
  "Heritage Evenings",
  "Performing Arts",
  "Sports Arena",
  "Literary Evenings",
  "Arts & Crafts",
  "Celebrity Nights",
];

const YEARS = ["2026", "2025", "2024", "2023"];

export default function AdminGalleryCMSPage() {
  const [galleryItems, setGalleryItems] = useState<StoredGalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Performing Arts",
    year: "2026",
    location: "Main Auditorium Grounds",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    caption: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadGallery = () => {
    setGalleryItems([...dataStore.getAllGalleryItems()]);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "Performing Arts",
      year: "2026",
      location: "Main Auditorium Grounds",
      image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
      caption: "",
    });
    setUploadError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: StoredGalleryItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      year: item.year,
      location: item.location || "",
      image: item.image,
      caption: item.caption || "",
    });
    setUploadError("");
    setIsModalOpen(true);
  };

  // Image Upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image size must be less than 8MB.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      bodyFormData.append("folder", "affinity_aiims/gallery");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: bodyFormData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        // Fallback to local data URL preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setFormData((prev) => ({ ...prev, image: reader.result as string }));
          }
        };
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      setUploadError("Title and image are required.");
      return;
    }

    if (editingId) {
      // Update
      dataStore.updateGalleryItem(editingId, {
        title: formData.title,
        category: formData.category,
        year: formData.year,
        location: formData.location,
        image: formData.image,
        caption: formData.caption,
      });
    } else {
      // Create
      dataStore.createGalleryItem({
        title: formData.title,
        category: formData.category,
        year: formData.year,
        location: formData.location,
        image: formData.image,
        caption: formData.caption,
      });
    }

    setIsModalOpen(false);
    loadGallery();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the festival gallery?`)) {
      dataStore.deleteGalleryItem(id);
      loadGallery();
    }
  };

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(search.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesYear = selectedYear === "all" || item.year === selectedYear;

    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-fest-sunset/15 text-fest-sunset text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Archives &amp; Photo Albums (CRUD)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Festival Gallery <span className="gold-gradient-text">Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Add new high-res photos, edit captions &amp; metadata, upload to Cloudinary, and curate public gallery exhibits.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fest-sunset to-fest-burgundy hover:brightness-110 text-white text-xs font-bold shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Gallery item saved successfully and updated across the live public gallery!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-fest-gold/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-fest-sunset absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, caption..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs text-foreground font-semibold"
          >
            <option value="all">All Editions</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y} Edition
              </option>
            ))}
          </select>

          {/* Category selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs text-foreground font-semibold"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid (Read, Update, Delete) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-fest-gold/30">
            <ImageIcon className="w-8 h-8 mx-auto text-fest-sunset mb-2 opacity-50" />
            <p className="text-sm font-semibold">No gallery items found.</p>
            <p className="text-xs">Click "Add New Photo" above to upload photos to the gallery.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-card border border-fest-gold/30 hover:border-fest-sunset shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image View */}
                <div className="relative h-52 w-full overflow-hidden bg-background">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="bg-fest-plum/90 text-fest-champagne text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-fest-gold/40">
                      {item.year}
                    </span>
                    <span className="bg-black/60 text-fest-gold-light text-[10px] font-medium px-2 py-0.5 rounded-full border border-border">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-serif text-base font-bold text-white line-clamp-1">
                      {item.title}
                    </h3>
                    {item.location && (
                      <span className="text-[10px] text-fest-champagne/80 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-fest-gold" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption / Description */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.caption || "Official festival moment captured live."}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Update & Delete */}
              <div className="px-4 py-3 bg-muted/40 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">
                  ID: {item.id}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1 rounded-lg border border-fest-gold/40 hover:bg-fest-sunset/15 text-fest-sunset text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Edit image details"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="px-3 py-1 rounded-lg border border-destructive/30 hover:bg-destructive/15 text-destructive text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal (Create & Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl max-w-lg w-full border-2 border-fest-gold/60 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {editingId ? "Edit Gallery Item" : "Add Photo to Gallery"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload an image or paste a URL to feature in the festival galleries.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-bold block mb-1 text-foreground">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi Maha Aarti Twilight Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Festival Edition *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y} Edition
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-foreground">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Kashi Amphitheatre"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>

              {/* Image Upload & Preview */}
              <div className="space-y-2">
                <label className="font-bold block text-foreground">Photo Image *</label>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {formData.image && (
                    <div className="w-24 h-24 rounded-xl border-2 border-fest-gold/40 overflow-hidden bg-background shrink-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="url"
                      required
                      placeholder="Image URL or upload below..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                    />

                    <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-fest-plum hover:bg-fest-burgundy text-white font-bold cursor-pointer text-xs border border-fest-gold/40 shadow-sm">
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-fest-gold-light" />
                      )}
                      <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-xs text-destructive flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {uploadError}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold block mb-1 text-foreground">
                  Photo Caption &amp; Story
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1,008 illuminated brass lamps reflected along Dashashwamedh Ghat at sunset."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-fest-sunset"
                />
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
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
                  {editingId ? "Update Photo" : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
