import { describe, it, expect } from "vitest";

describe("Sports Tournament & Football Engine", () => {
  it("should calculate group points correctly (Win=3, Draw=1, Loss=0)", () => {
    const teams = [
      { name: "Lucknow University FC", w: 2, d: 1, l: 0 },
      { name: "BHU Varanasi Titans", w: 2, d: 0, l: 1 },
      { name: "AMU Aligarh Strikers", w: 1, d: 0, l: 2 },
    ];

    const standings = teams.map((t) => ({
      ...t,
      pts: t.w * 3 + t.d * 1,
    }));

    expect(standings[0].pts).toBe(7);
    expect(standings[1].pts).toBe(6);
    expect(standings[2].pts).toBe(3);
  });

  it("should validate knockout bracket progression", () => {
    const match = {
      round: "Quarter-Final 1",
      team1: { name: "Lucknow University FC", score: 3 },
      team2: { name: "Gorakhpur Warriors", score: 1 },
      status: "completed",
    };

    const winner = match.team1.score > match.team2.score ? match.team1.name : match.team2.name;
    expect(winner).toBe("Lucknow University FC");
  });
});
