What changed and why
---------------------
The original upload route sent the whole image file through a Vercel
serverless function, which caps request bodies at 4.5 MB — so anything
bigger than that failed with an empty, non-JSON response. These three
files replace that with a direct browser-to-Blob-storage upload, so file
size is no longer limited by the function.

How to apply
------------
1. Copy these files into your repo at the same paths, overwriting what's
   there:
     app/api/studio/upload-token/route.ts   (new file)
     app/api/studio/finalize/route.ts        (new file)
     components/studio/StudioDashboard.tsx   (replaces the existing one)

2. Delete the old route, it's no longer used:
     app/api/studio/upload/   (the whole folder)

3. Commit and push:
     git add -A
     git commit -m "Switch wallpaper uploads to direct client-to-Blob uploads"
     git push

Vercel will redeploy automatically. No new environment variables needed —
this uses the same Blob store you already connected.
