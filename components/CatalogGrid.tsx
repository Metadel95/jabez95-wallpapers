"use client";

import { useMemo, useState } from "react";
import { WallpaperCard } from "./WallpaperCard";
import type { Wallpaper } from "@/lib/types";

export function CatalogGrid({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    wallpapers.forEach((w) => w.categories.forEach((c) => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [wallpapers]);

  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? wallpapers.filter((w) => w.categories.includes(active))
    : wallpapers;

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-6 sm:px-10 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10 border-b border-(--paper-line) pb-6">
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight">The Catalog</h2>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActive(null)}
              className={`font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-colors ${
                active === null
                  ? "bg-(--ink) text-(--paper) border-(--ink)"
                  : "border-(--paper-line) text-(--ink-soft) hover:border-(--ink)"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-colors ${
                  active === c
                    ? "bg-(--sage) text-(--paper) border-(--sage)"
                    : "border-(--paper-line) text-(--ink-soft) hover:border-(--sage) hover:text-(--sage-deep)"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-(--ink-soft) py-12 text-center">
          No pressings in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
          {filtered.map((w) => (
            <WallpaperCard key={w.id} wallpaper={w} />
          ))}
        </div>
      )}
    </section>
  );
}
