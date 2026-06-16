import { head, put } from "@vercel/blob";
import type { Wallpaper } from "./types";

const CATALOG_PATHNAME = "catalog.json";

/**
 * The catalog is a single JSON file living alongside the images in Blob
 * storage. It's small (a personal collection won't have thousands of
 * pieces), so a single file is simpler than wiring up a database.
 */
export async function getCatalog(): Promise<Wallpaper[]> {
  try {
    const blob = await head(CATALOG_PATHNAME);
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // No catalog yet — that's fine, the gallery just starts empty.
    return [];
  }
}

export async function saveCatalog(catalog: Wallpaper[]): Promise<void> {
  await put(CATALOG_PATHNAME, JSON.stringify(catalog, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Sorted newest first — used everywhere the catalog is displayed. */
export function sortByNewest(catalog: Wallpaper[]): Wallpaper[] {
  return [...catalog].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function nextCatalogNumber(catalog: Wallpaper[]): number {
  if (catalog.length === 0) return 1;
  return Math.max(...catalog.map((w) => w.catalogNumber)) + 1;
}

export function formatCatalogNumber(n: number): string {
  return n.toString().padStart(3, "0");
}
