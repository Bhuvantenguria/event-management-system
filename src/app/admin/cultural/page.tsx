"use client";

import React, { useState } from "react";
import { Landmark, Plus, Trash2, Edit2, Sparkles, MapPin } from "lucide-react";

export default function AdminCulturalCMSPage() {
  const [collections, setCollections] = useState<any[]>([
    {
      id: "cult-1",
      title: "Rumi Darwaza & Awadhi Architecture",
      region: "Lucknow (Awadh)",
      category: "Monuments & Architecture",
      summary: "60-foot iconic gateway built in 1784 under Nawab Asaf-ud-Daula showcasing guldasta towers and interlocking arches.",
      isPublished: true,
    },
    {
      id: "cult-2",
      title: "Sacred Ghats & Ganga Aarti of Kashi",
      region: "Varanasi (Kashi)",
      category: "Sacred Traditions",
      summary: "Ancient tiered brass lamps and rhythmic Vedic chants celebrated at twilight across Dashashwamedh and Assi ghats.",
      isPublished: true,
    },
    {
      id: "cult-3",
      title: "Banarasi Zari Handloom Weaving",
      region: "Varanasi (Banaras)",
      category: "Living Crafts & Handloom",
      summary: "Pure Mulberry silk handloom weaving with real gold and silver metallic threads.",
      isPublished: true,
    },
    {
      id: "cult-4",
      title: "Chikankari White-on-White Needlecraft",
      region: "Lucknow (Awadh)",
      category: "Living Crafts & Handloom",
      summary: "400-year-old delicate shadow-work embroidery consisting of 32 distinct stitch patterns.",
      isPublished: true,
    },
  ]);

  const [createModal, setCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    region: "",
    category: "Monuments & Architecture",
    summary: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCollections([
      ...collections,
      {
        id: `cult-${Date.now()}`,
        ...newItem,
        isPublished: true,
      },
    ]);
    setCreateModal(false);
    setNewItem({ title: "", region: "", category: "Monuments & Architecture", summary: "" });
  };

  const handleDelete = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Uttar Pradesh Heritage <span className="gold-gradient-text">CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage regional monuments, folk arts, handicrafts, and cultural archives featured on the public website
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Heritage Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-card border border-heritage-gold/30 hover:border-heritage-gold shadow-sm transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-heritage-gold-dark dark:text-heritage-gold">
                  {item.category}
                </span>
                <span className="text-xs font-serif font-semibold text-muted-foreground flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-heritage-gold" />
                  {item.region}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-foreground">
                {item.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="inline-flex items-center text-[10px] text-emerald-600 font-bold">
                ● Published
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-destructive hover:opacity-80 p-1"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-lg w-full border border-heritage-gold p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Add Cultural Heritage Collection
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pietra Dura Inlay Art of Agra"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Agra (Braj/Mughal)"
                    value={newItem.region}
                    onChange={(e) => setNewItem({ ...newItem, region: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  >
                    <option value="Monuments & Architecture">Monuments & Architecture</option>
                    <option value="Living Crafts & Handloom">Living Crafts & Handloom</option>
                    <option value="Music & Performing Arts">Music & Performing Arts</option>
                    <option value="Sacred Traditions">Sacred Traditions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={newItem.summary}
                  onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
                  placeholder="Explain historical context and cultural significance..."
                  className="w-full px-3 py-2 rounded bg-background border border-border"
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
                  Save Heritage Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
