"use client";

import React, { useState } from "react";
import {
  Trophy,
  Plus,
  Calendar,
  Activity,
  Shield,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function AdminSportsManagementPage() {
  const [matches, setMatches] = useState<any[]>([
    {
      id: "match-101",
      tournament: "Chhatrapati Shivaji Football Trophy",
      round: "Quarter-Final 1",
      team1: "Lucknow University FC",
      team2: "Gorakhpur Warriors",
      score1: 3,
      score2: 1,
      status: "completed",
      scorers: "LU: Kabir (14', 68'), Aryan (42') | GW: Vikas (55')",
      cards: "Yellow: Kabir (45'), Red: Rohit (78')",
    },
    {
      id: "match-102",
      tournament: "Chhatrapati Shivaji Football Trophy",
      round: "Quarter-Final 2",
      team1: "BHU Varanasi Titans",
      team2: "Allahabad University FC",
      score1: 2,
      score2: 0,
      status: "completed",
      scorers: "BHU: Shreyas (29'), Devesh (81')",
      cards: "Yellow: Manas (38')",
    },
    {
      id: "match-103",
      tournament: "Chhatrapati Shivaji Football Trophy",
      round: "Semi-Final 1",
      team1: "Lucknow University FC",
      team2: "BHU Varanasi Titans",
      score1: 0,
      score2: 0,
      status: "scheduled",
      scorers: "",
      cards: "",
    },
  ]);

  const [editingMatch, setEditingMatch] = useState<any | null>(null);

  const handleUpdateScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    setMatches((prev) =>
      prev.map((m) => (m.id === editingMatch.id ? editingMatch : m))
    );
    setEditingMatch(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Sports & Tournaments <span className="gold-gradient-text">Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create fixtures, update live football scores, record goalscorers, cards, and advance winners
          </p>
        </div>

        <button
          onClick={() =>
            setEditingMatch({
              id: `match-${Date.now()}`,
              tournament: "Chhatrapati Shivaji Football Trophy",
              round: "Semi-Final 2",
              team1: "Bareilly Tigers",
              team2: "Meerut Knights",
              score1: 0,
              score2: 0,
              status: "scheduled",
              scorers: "",
              cards: "",
            })
          }
          className="px-4 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fixture</span>
        </button>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {matches.map((m) => (
          <div
            key={m.id}
            className="p-5 sm:p-6 rounded-2xl bg-card border border-heritage-gold/30 hover:border-heritage-gold shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-heritage-maroon text-heritage-ivory">
                  {m.tournament}
                </span>
                <span className="text-xs font-bold text-heritage-gold-dark dark:text-heritage-gold">
                  {m.round}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    m.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* Teams & Score */}
              <div className="flex items-center space-x-4 py-1">
                <span className="font-serif text-base font-bold text-foreground">
                  {m.team1}
                </span>
                <span className="px-3 py-1 rounded bg-heritage-sandstone/20 font-serif font-black text-lg text-heritage-maroon dark:text-heritage-gold">
                  {m.status === "completed" ? `${m.score1} - ${m.score2}` : "VS"}
                </span>
                <span className="font-serif text-base font-bold text-foreground">
                  {m.team2}
                </span>
              </div>

              {m.scorers && (
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Goals:</strong> {m.scorers}
                </p>
              )}
              {m.cards && (
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Cards:</strong> {m.cards}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <button
                onClick={() => setEditingMatch(m)}
                className="px-3.5 py-1.5 rounded-md border border-heritage-gold/40 hover:bg-heritage-sandstone/15 text-xs font-semibold text-foreground flex items-center space-x-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-heritage-gold" />
                <span>Update Score / Cards</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl max-w-lg w-full border border-heritage-gold p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Update Match Score & Statistics
            </h3>

            <form onSubmit={handleUpdateScore} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Team 1: {editingMatch.team1}
                  </label>
                  <input
                    type="number"
                    value={editingMatch.score1}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        score1: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded bg-background border border-border"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Team 2: {editingMatch.team2}
                  </label>
                  <input
                    type="number"
                    value={editingMatch.score2}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        score2: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded bg-background border border-border"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Match Status
                </label>
                <select
                  value={editingMatch.status}
                  onChange={(e) =>
                    setEditingMatch({ ...editingMatch, status: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded bg-background border border-border"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Goal Scorers & Minute Notation
                </label>
                <input
                  type="text"
                  placeholder="LU: Kabir (14', 68') | GW: Vikas (55')"
                  value={editingMatch.scorers || ""}
                  onChange={(e) =>
                    setEditingMatch({ ...editingMatch, scorers: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded bg-background border border-border"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Disciplinary Cards (Yellow / Red)
                </label>
                <input
                  type="text"
                  placeholder="Yellow: Kabir (45'), Red: Rohit (78')"
                  value={editingMatch.cards || ""}
                  onChange={(e) =>
                    setEditingMatch({ ...editingMatch, cards: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded bg-background border border-border"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="px-3.5 py-1.5 rounded text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-heritage-maroon text-heritage-ivory text-xs font-bold border border-heritage-gold"
                >
                  Save Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
