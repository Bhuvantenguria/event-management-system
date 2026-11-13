"use client";

import React, { useState } from "react";
import { Award, Plus, Trash2 } from "lucide-react";

export default function AdminSponsorsCMSPage() {
  const [sponsors, setSponsors] = useState<any[]>([
    { id: "sp-1", name: "Awadh Heritage Trust", tier: "Title Partner", category: "Preservation & Culture" },
    { id: "sp-2", name: "Varanasi Silks & Weaves Guild", tier: "Gold Partner", category: "Textile Arts" },
    { id: "sp-3", name: "UP State Sports Federation", tier: "Sports Partner", category: "Athletics & Cups" },
  ]);

  const [createModal, setCreateModal] = useState(false);
  const [newSponsor, setNewSponsor] = useState({ name: "", tier: "Gold Partner", category: "Corporate" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setSponsors([...sponsors, { id: `sp-${Date.now()}`, ...newSponsor }]);
    setCreateModal(false);
    setNewSponsor({ name: "", tier: "Gold Partner", category: "Corporate" });
  };

  const handleDelete = (id: string) => {
    setSponsors(sponsors.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Sponsors & Partners <span className="gold-gradient-text">CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage partner logos, sponsorship tiers, and website visibility
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      <div className="space-y-3">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-card border border-heritage-gold/30 hover:border-heritage-gold shadow-sm transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-heritage-gold-dark dark:text-heritage-gold">
                {s.tier}
              </span>
              <h3 className="font-serif text-base font-bold text-foreground">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.category}</p>
            </div>

            <button
              onClick={() => handleDelete(s.id)}
              className="text-destructive hover:opacity-80 p-1"
              title="Delete partner"
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
              Add Partner / Sponsor
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Bank of India"
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Sponsorship Tier</label>
                <select
                  value={newSponsor.tier}
                  onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-background border border-border"
                >
                  <option value="Title Partner">Title Partner</option>
                  <option value="Gold Partner">Gold Partner</option>
                  <option value="Silver Partner">Silver Partner</option>
                  <option value="Associate Partner">Associate Partner</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Category / Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Banking / Technology / Food"
                  value={newSponsor.category}
                  onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
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
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
