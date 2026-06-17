import { head, put } from "@vercel/blob";

const COUNTS_PATHNAME = "download-counts.json";

export async function getDownloadCounts(): Promise<Record<string, number>> {
  try {
    const blob = await head(COUNTS_PATHNAME);
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    return typeof data === "object" && data !== null ? data : {};
  } catch {
    // No counts recorded yet — that's fine, everything starts at zero.
    return {};
  }
}

/**
 * Bumps a wallpaper's download count by one. This does a read-modify-write
 * against a single small JSON file, which is simple and plenty accurate
 * for a personal site's traffic — under a flood of simultaneous downloads
 * for the exact same wallpaper, the very last update wins, but that's an
 * acceptable trade-off for a download counter.
 */
export async function incrementDownloadCount(id: string): Promise<void> {
  const counts = await getDownloadCounts();
  counts[id] = (counts[id] ?? 0) + 1;
  await put(COUNTS_PATHNAME, JSON.stringify(counts, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}
