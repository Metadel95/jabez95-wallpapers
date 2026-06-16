import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";
import { getCatalog, saveCatalog } from "@/lib/blob-store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const catalog = await getCatalog();
  const entry = catalog.find((w) => w.id === id);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (typeof body.title === "string" && body.title.trim()) {
    entry.title = body.title.trim();
  }
  if (Array.isArray(body.categories)) {
    entry.categories = body.categories
      .map((c: unknown) => String(c).trim())
      .filter(Boolean);
  }

  await saveCatalog(catalog);
  return NextResponse.json({ wallpaper: entry });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const catalog = await getCatalog();
  const entry = catalog.find((w) => w.id === id);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await del(entry.pathname);
  await saveCatalog(catalog.filter((w) => w.id !== id));

  return NextResponse.json({ ok: true });
}
