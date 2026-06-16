import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthenticated } from "@/lib/auth";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB — generous for a wallpaper PNG/JPG

export async function POST(request: NextRequest) {
  // Client uploads skip the request-body route, so this is the one place
  // we still need to gate on the studio session before anyone can write
  // to Blob storage.
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
      onUploadCompleted: async () => {
        // No-op: the catalog entry is written by the client right after
        // the upload() promise resolves (see /api/studio/finalize), so we
        // don't depend on this webhook firing. It also can't reach
        // localhost during local development.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
