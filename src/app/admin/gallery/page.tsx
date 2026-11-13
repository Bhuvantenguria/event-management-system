"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Eye } from "lucide-react";

export default function AdminGalleryCMSPage() {
  const [albums, setAlbums] = useState<any[]>([
    {
      id: "alb-1",
      title: "Varanasi Maha Aarti Ceremony",
      year: "2025",
      category: "Heritage Evenings",
      photosCount: 28,
      cover: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "alb-2",
      title: "Kathak Gharana Night & Classical Beats",
      year: "2025",
      category: "Performing Arts",
      photosCount: 34,
      cover: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    },
  ]);

  const [createModal, setCreateModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    year: "2026",
    category: "Performing Arts",
    cover: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
    photosCount: 15,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAlbums([...albums, { id: `alb-${Date.now()}`, ...newAlbum }]);
    setCreateModal(false);
    setNewAlbum({
      title: "",
      year: "2026",
      category: "Performing Arts",
      cover: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop",
      photosCount: 15,
    });
  };

  const handleDelete = (id: string) => {
    setAlbums(albums.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Cultural Media & Gallery <span className="gold-gradient-text">CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Curate photo albums, video archives, and past edition highlight collections
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Album</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {albums.map((alb) => (
          <div
            key={alb.id}
            className="p-4 rounded-xl bg-card border border-heritage-gold/30 hover:border-heritage-gold shadow-sm transition-all flex items-center space-x-4"
          >
            <img
              src={alb.cover}
              alt={alb.title}
              className="w-20 h-20 rounded-lg object-cover border border-border shrink-0"
            />
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-bold text-heritage-gold uppercase">
                {alb.year} • {alb.category}
              </span>
              <h3 className="font-serif text-sm font-bold text-foreground">{alb.title}</h3>
              <span className="text-xs text-muted-foreground block">
                {alb.photosCount} Photos
              </span>
            </div>
            <button
              onClick={() => handleDelete(alb.id)}
              className="text-destructive hover:opacity-80 p-1"
              title="Delete album"
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
              Create New Photo Album
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shaam-e-Awadh 2026 Recital"
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Edition Year</label>
                  <input
                    type="text"
                    value={newAlbum.year}
                    onChange={(e) => setNewAlbum({ ...newAlbum, year: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newAlbum.category}
                    onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-background border border-border"
                  >
                    <option value="Performing Arts">Performing Arts</option>
                    <option value="Heritage Evenings">Heritage Evenings</option>
                    <option value="Sports Arena">Sports Arena</option>
                    <option value="Literary Evenings">Literary Evenings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Cover Image Link *</label>
                <input
                  type="text"
                  required
                  value={newAlbum.cover}
                  onChange={(e) => setNewAlbum({ ...newAlbum, cover: e.target.value })}
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
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
