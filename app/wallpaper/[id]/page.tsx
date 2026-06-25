import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCatalogFromBlobStorage, formatCatalogNumber } from "@/lib/blob-store";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function WallpaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getCatalogFromBlobStorage();
  const wallpaper = catalog.find((w) => w.id === id);

  if (!wallpaper) notFound();

  const date = new Date(wallpaper.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 pt-10">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.15em] text-(--ink-soft) hover:text-(--clay) transition-colors"
          >
            &larr; All pressings
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-[320px] sm:max-w-[360px] mx-auto w-full order-1">
            <div className="lift-on-hover relative aspect-[9/19.5] rounded-md overflow-hidden bg-(--paper-deep)">
              <Image
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                fill
                priority
                sizes="(max-width: 1024px) 70vw, 360px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="order-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-(--sage) mb-5">
              {siteConfig.catalogPrefix} {formatCatalogNumber(wallpaper.catalogNumber)}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
              {wallpaper.title}
            </h1>

            {wallpaper.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {wallpaper.categories.map((c) => (
                  <span
                    key={c}
                    className="font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-(--paper-line) text-(--ink-soft)"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <dl className="mb-10 max-w-sm font-mono text-sm">
              <div>
                <dt className="text-(--ink-faint) text-xs uppercase tracking-[0.15em] mb-1">
                  Pressed
                </dt>
                <dd>{date}</dd>
              </div>
            </dl>

            
              href={`/api/download/${wallpaper.id}`}
              className="stub inline-flex items-center gap-4 bg-(--ink) text-(--paper) pl-6 pr-8 py-4 rounded-sm font-display italic text-xl border border-dashed border-(--paper) group"
              download
            >
              Download full size
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-y-1"
              >
                &darr;
              </span>
            </a>
            <p className="font-mono text-xs text-(--ink-faint) mt-4">
              Free for personal use. Wallpaper sized for phone screens.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}