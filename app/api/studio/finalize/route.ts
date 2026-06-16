import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getCatalog, saveCatalog, nextCatalogNumber } from "@/lib/blob-store";
import { makeId } from "@/lib/slug";
import type { Wallpaper } from "@/lib/types";

/**
 * Called right after the browser finishes a client upload to Blob storage.
 * The file itself never touches this server — only the small bits of
 * metadata needed to add it to the catalog, which keeps this request
 * well under any function body-size limit regardless of image size.
 */
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { id: providedId, title, categories, url, pathname, filename, width, height, size } = body as {
    id?: string;
    title?: string;
    categories?: string[];
    url?: string;
    pathname?: string;
    filename?: string;
    width?: number;
    height?: number;
    size?: number;
  };

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Give the piece a title." }, { status: 400 });
  }
  if (!url || !pathname) {
    return NextResponse.json({ error: "Missing upload details." }, { status: 400 });
  }

  const catalog = await getCatalog();
  const entry: Wallpaper = {
    id: providedId && providedId.trim() ? providedId.trim() : makeId(title.trim()),
    title: title.trim(),
    categories: Array.isArray(categories) ? categories.filter(Boolean) : [],
    imageUrl: url,
    pathname,
    filename: filename || pathname.split("/").pop() || "wallpaper",
    width: typeof width === "number" ? width : 0,
    height: typeof height === "number" ? height : 0,
    size: typeof size === "number" ? size : 0,
    createdAt: new Date().toISOString(),
    catalogNumber: nextCatalogNumber(catalog),
  };

  catalog.push(entry);
  await saveCatalog(catalog);

  return NextResponse.json({ wallpaper: entry }, { status: 201 });
}
