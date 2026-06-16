import { head, list, put } from "@vercel/blob";
import type { Wallpaper } from "./types";

const CATALOG_PATHNAME = "catalog.json";
const WALLPAPERS_PREFIX = "wallpapers/";
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

/**
 * "be-holy-final.png" -> "Be Holy Final"
 */
function humanizeFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  const spaced = withoutExt.replace(/[-_]+/g, " ").trim();
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase()) || filename;
}

/**
 * Builds the catalog directly from whatever image files exist under
 * wallpapers/ in Blob storage — no separate index file to keep in sync.
 * This is what lets you upload straight through the Vercel dashboard's
 * Blob browser (or the CLI) and have it show up on the site automatically.
 *
 * Titles are derived from the filename, and the catalog number reflects
 * upload order (oldest = No. 001). There's no categories support this
 * way, since plain file uploads don't carry that metadata.
 */
export async function getCatalogFromBlobStorage(): Promise<Wallpaper[]> {
  const { blobs } = await list({ prefix: WALLPAPERS_PREFIX });

  const images = blobs.filter((b) =>
    IMAGE_EXTENSIONS.some((ext) => b.pathname.toLowerCase().endsWith(ext))
  );

  // Oldest first, so catalog numbers stay stable as new pieces are added.
  images.sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());

  return images.map((blob, index) => {
    const filename = blob.pathname.slice(WALLPAPERS_PREFIX.length);
    const id = filename.replace(/\.[^.]+$/, "");

    return {
      id,
      title: humanizeFilename(filename),
      categories: [],
      imageUrl: blob.url,
      pathname: blob.pathname,
      filename,
      width: 0,
      height: 0,
      size: blob.size,
      createdAt: blob.uploadedAt.toISOString(),
      catalogNumber: index + 1,
    } satisfies Wallpaper;
  });
}

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
