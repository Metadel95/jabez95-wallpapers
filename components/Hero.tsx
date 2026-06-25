import Link from "next/link";
import Image from "next/image";
import { formatCatalogNumber } from "@/lib/blob-store";
import { siteConfig } from "@/lib/site-config";
import type { Wallpaper } from "@/lib/types";

export function Hero({ wallpaper }: { wallpaper: Wallpaper }) {
  const date = new Date(wallpaper.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <section className="mx-auto max-w-6xl px-6 sm:px-10 pt-12 sm:pt-20 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="reveal order-2 lg:order-1">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-(--sage) mb-5">
            Now pressing — {siteConfig.catalogPrefix} {formatCatalogNumber(wallpaper.catalogNumber)}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
            {wallpaper.title}
          </h1>
          <p className="text-(--ink-soft) text-lg max-w-md mb-8">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 font-mono text-xs uppercase tracking-[0.15em] text-(--ink-soft)">
            {wallpaper.categories.map((c) => (
              <span key={c}>{c}</span>
            ))}
            <span className="text-(--ink-faint)">{date}</span>
          </div>
          <Link
            href={`/wallpaper/${wallpaper.id}`}
            className="inline-flex items-center gap-3 font-display italic text-xl group"
          >
            View &amp; download
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </Link>
        </div>

        <div className="reveal order-1 lg:order-2 max-w-[280px] sm:max-w-[320px] mx-auto w-full">
          <div className="lift-on-hover relative aspect-[9/19.5] rounded-md overflow-hidden bg-(--paper-deep)">
            <Image
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              fill
              priority
              sizes="(max-width: 1024px) 70vw, 320px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}