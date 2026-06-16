import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/blob-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const catalog = await getCatalog();
  const wallpaper = catalog.find((w) => w.id === id);

  if (!wallpaper) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const upstream = await fetch(wallpaper.imageUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Couldn't load the file." }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${wallpaper.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
