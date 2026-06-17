import Link from "next/link";
import { getCatalogFromBlobStorage, formatCatalogNumber } from "@/lib/blob-store";
import { getDownloadCounts } from "@/lib/download-counts";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const [catalog, counts] = await Promise.all([
    getCatalogFromBlobStorage(),
    getDownloadCounts(),
  ]);

  const rows = catalog
    .map((w) => ({ wallpaper: w, count: counts[w.id] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="space-y-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl tracking-tight">Downloads</h2>
        <Link
          href="/studio"
          className="font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft) hover:text-(--studio-accent) transition-colors"
        >
          &larr; Back to Studio
        </Link>
      </div>

      <p className="font-mono text-sm text-(--studio-text-soft)">
        {total.toLocaleString()} total download{total === 1 ? "" : "s"}
      </p>

      {rows.length === 0 ? (
        <p className="font-mono text-sm text-(--studio-text-soft)">
          Nothing in the catalog yet, so there's nothing to count.
        </p>
      ) : (
        <ul className="divide-y divide-(--studio-line) border-y border-(--studio-line)">
          {rows.map(({ wallpaper, count }) => (
            <li
              key={wallpaper.id}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-lg truncate">
                    {wallpaper.title}
                  </span>
                  <span className="font-mono text-xs text-(--studio-text-soft)">
                    {siteConfig.catalogPrefix} {formatCatalogNumber(wallpaper.catalogNumber)}
                  </span>
                </div>
              </div>
              <span className="font-mono text-lg text-(--studio-accent) shrink-0">
                {count.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
