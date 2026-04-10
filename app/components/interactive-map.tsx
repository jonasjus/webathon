"use client";

import { useState } from "react";

type MapSpot = {
  id: string;
  name: string;
  x: number;
  y: number;
  players: string;
  nextUp: string;
};

const spots: MapSpot[] = [
  {
    id: "majorstuen",
    name: "Majorstuen",
    x: 74,
    y: 76,
    players: "12 aktive spillere",
    nextUp: "Padel mix kl. 18:30",
  },
  {
    id: "bjorvika",
    name: "Bjørvika",
    x: 148,
    y: 128,
    players: "8 aktive spillere",
    nextUp: "Morgentur kl. 07:15",
  },
  {
    id: "nydalen",
    name: "Nydalen",
    x: 118,
    y: 40,
    players: "5 aktive spillere",
    nextUp: "Intervallgruppe kl. 19:00",
  },
];

export function InteractiveMap() {
  const [selectedSpotId, setSelectedSpotId] = useState(spots[0].id);
  const selectedSpot =
    spots.find((spot) => spot.id === selectedSpotId) ?? spots[0];

  return (
    <div className="rounded-[28px] border border-white/70 bg-[rgba(244,248,243,0.92)] p-4 shadow-[0_24px_60px_rgba(43,62,54,0.10)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Kartoversikt
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
            Nære aktiviteter
          </h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--muted)]">
          Live
        </span>
      </div>

      <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top_left,_rgba(135,191,149,0.34),_transparent_48%),linear-gradient(135deg,_#fefefe_0%,_#eef5ef_100%)] p-4">
        <svg
          viewBox="0 0 220 170"
          className="h-[180px] w-full"
          role="img"
          aria-label="Interaktivt kart over aktivitetsområder"
        >
          <path
            d="M18 36C44 24 63 17 94 26C122 34 143 24 166 38C184 48 191 61 202 86"
            fill="none"
            stroke="rgba(108,150,120,0.34)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M28 120C56 98 82 88 108 97C128 104 142 120 168 118C184 116 197 109 208 94"
            fill="none"
            stroke="rgba(170,212,181,0.45)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M78 18C91 36 90 54 83 71C77 84 66 97 52 112"
            fill="none"
            stroke="rgba(222,234,223,0.95)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {spots.map((spot) => {
            const isSelected = spot.id === selectedSpot.id;

            return (
              <g key={spot.id}>
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={isSelected ? 14 : 10}
                  fill={isSelected ? "rgba(109, 149, 119, 0.22)" : "rgba(255,255,255,0.82)"}
                />
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={isSelected ? 7 : 5}
                  fill={isSelected ? "#6d9577" : "#3e5a47"}
                />
              </g>
            );
          })}
        </svg>

        <div className="mt-3 rounded-[20px] bg-white/88 p-3 shadow-[0_10px_30px_rgba(37,57,47,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {selectedSpot.name}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {selectedSpot.players}
              </p>
            </div>
            <span className="rounded-full bg-[var(--sage-soft)] px-3 py-1 text-xs font-medium text-[var(--sage-strong)]">
              {selectedSpot.nextUp}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {spots.map((spot) => {
          const isSelected = spot.id === selectedSpot.id;

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => setSelectedSpotId(spot.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "bg-[var(--sage)] text-white shadow-[0_12px_30px_rgba(60,117,83,0.30)]"
                  : "bg-white text-[var(--ink)] hover:bg-[var(--sage-soft)]"
              }`}
            >
              {spot.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
