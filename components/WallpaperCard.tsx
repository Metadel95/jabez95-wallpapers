import Link from "next/link";
import Image from "next/image";
import { formatCatalogNumber } from "@/lib/blob-store";
import { siteConfig } from "@/lib/site-config";
import type { Wallpaper } from "@/lib/types";

export function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
  const date = new Date(wallpaper.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/wallpaper/${wallpaper.id}`} className="group block">
      <div className="lift-on-hover relative aspect-[9/19.5] w-full rounded-md overflow-hidden bg-(--paper-deep)">
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          fill
          sizes="(max-width: 768px) 45vw, 320px"
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-(--paper-line) pt-3">
        <span className="font-display text-lg leading-tight group-hover:text-(--clay) transition-colors">
          {wallpaper.title}
        </span>
        <span className="font-mono text-xs text-(--ink-faint) whitespace-nowrap">
          {siteConfig.catalogPrefix} {formatCatalogNumber(wallpaper.catalogNumber)}
        </span>
      </div>
      <div className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-(--ink-soft)">
        {wallpaper.categories.slice(0, 2).join(" · ")}
        {wallpaper.categories.length > 0 && " — "}
        {date}
      </div>
    </Link>
  );
}