import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { CatalogGrid } from "@/components/CatalogGrid";
import { getCatalogFromBlobStorage, sortByNewest } from "@/lib/blob-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = sortByNewest(await getCatalogFromBlobStorage());

  return (
    <>
      <Header />
      <main className="flex-1">
        {catalog.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Hero wallpaper={catalog[0]} />
            <CatalogGrid wallpapers={catalog} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <section className="mx-auto max-w-2xl px-6 sm:px-10 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-(--sage) mb-5">
        Press No. 001
      </p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-5">
        The catalog is empty — for now.
      </h1>
      <p className="text-(--ink-soft) text-lg mb-10">
        Upload your first wallpaper from the Studio and it will appear here,
        ready for people to view and download.
      </p>
      <Link
        href="/studio"
        className="inline-flex items-center gap-3 font-display italic text-xl group"
      >
        Go to the Studio
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
        >
          &rarr;
        </span>
      </Link>
    </section>
  );
}
