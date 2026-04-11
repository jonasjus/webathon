'use client';

import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { DashboardStat } from "./dashboard-stat";

interface PlannerStat {
  label: string;
  value: number;
}

interface PlannerStatsToggleProps {
  stats: PlannerStat[];
}

export function PlannerStatsToggle({ stats }: PlannerStatsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const label = isOpen ? "Skjul planoversikt" : "Vis planoversikt";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-controls="home-planner-stats"
        aria-expanded={isOpen}
        aria-label={label}
        title={label}
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center justify-self-end text-[var(--ink-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
          isOpen
            ? "text-[var(--sage-700)]"
            : "hover:text-[var(--ink)]"
        }`}
      >
        <ArrowDown
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          id="home-planner-stats"
          className="col-span-full grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <DashboardStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      ) : null}
    </>
  );
}
