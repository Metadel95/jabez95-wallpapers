import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { imageSize } from "image-size";
import { isAuthenticated } from "@/lib/auth";
import { getCatalog, saveCatalog, nextCatalogNumber } from "@/lib/blob-store";
import { makeId } from "@/lib/slug";
import type { Wallpaper } from "@/lib/types";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "").trim();
  const categoriesRaw = String(formData.get("categories") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Give the piece a title." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "That file isn't an image." }, { status: 400 });
  }

  const categories = categoriesRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const hasBlobCredentials =
    !!process.env.BLOB_READ_WRITE_TOKEN ||
    (!!process.env.BLOB_STORE_ID && !!process.env.VERCEL_OIDC_TOKEN);

  if (!hasBlobCredentials) {
    return NextResponse.json(
      {
        error:
          "Blob storage isn't connected yet. In your Vercel project, go to Storage → Create Database → Blob, then redeploy.",
      },
      { status: 500 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let width = 0;
  let height = 0;
  try {
    const dimensions = imageSize(buffer);
    width = dimensions.width ?? 0;
    height = dimensions.height ?? 0;
  } catch {
    // If dimensions can't be read, the image still uploads fine.
  }

  const id = makeId(title);
  const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
  const pathname = `wallpapers/${id}.${ext}`;

  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  const catalog = await getCatalog();
  const entry: Wallpaper = {
    id,
    title,
    categories,
    imageUrl: blob.url,
    pathname: blob.pathname,
    filename: file.name || `${id}.${ext}`,
    width,
    height,
    size: buffer.length,
    createdAt: new Date().toISOString(),
    catalogNumber: nextCatalogNumber(catalog),
  };

  catalog.push(entry);
  await saveCatalog(catalog);

  return NextResponse.json({ wallpaper: entry }, { status: 201 });
}
