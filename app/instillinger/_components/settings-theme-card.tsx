"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyTheme,
  getPreferredTheme,
  isAppTheme,
  THEME_STORAGE_KEY,
  type AppTheme,
} from "@/lib/theme";

export function SettingsThemeCard() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    const datasetTheme = document.documentElement.dataset.theme;
    return isAppTheme(datasetTheme) ? datasetTheme : "light";
  });

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEY) {
        setTheme(getPreferredTheme());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isDark = theme === "dark";

  function toggleTheme() {
    const nextTheme: AppTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-5">
        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--sage-50)] text-[var(--sage-700)]">
          {isDark ? (
            <MoonStar className="h-3.5 w-3.5" />
          ) : (
            <SunMedium className="h-3.5 w-3.5" />
          )}
        </span>
        <h2 className="card-title text-[1.45rem] text-[var(--ink)]">
          Utseende
        </h2>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--ink)]">Mørk modus</p>
          <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
            Bytt mellom lyst og mørkt uttrykk for hele appen.
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
            Aktivt tema: {isDark ? "Mørkt" : "Lyst"}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
            isDark
              ? "border-[var(--sage-500)] bg-[var(--sage-500)]"
              : "border-[var(--border)] bg-[var(--surface-muted)]"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 rounded-full bg-[var(--surface)] shadow-[var(--shadow-card)] transition-transform ${
              isDark ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
