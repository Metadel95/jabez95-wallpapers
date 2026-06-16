What changed
------------
The site no longer reads from catalog.json (the file the Studio dashboard
used to write). Instead, the homepage and wallpaper pages now list
whatever image files actually exist in your Blob store under the
"wallpapers/" folder, using the Blob list() API directly. Titles are
generated from the filename, and the catalog number reflects upload
order. There's no category/tag support this way, since plain file
uploads don't carry extra metadata — only the file itself.

How to apply
------------
Copy these 4 files into your repo at the same paths, overwriting what's
there:

  lib/blob-store.ts
  app/page.tsx
  app/wallpaper/[id]/page.tsx
  app/api/download/[id]/route.ts

Then commit and push:

  git add -A
  git commit -m "Read the catalog directly from Blob storage"
  git push

Vercel redeploys automatically.

How to upload a wallpaper from now on
--------------------------------------
1. In your Vercel dashboard, open your project, go to Storage → click
   into your Blob store.
2. Use the "Upload" button (or drag a file in) and set the path/filename
   to start with "wallpapers/", e.g.:

     wallpapers/be-holy.jpg
     wallpapers/god-will-work-it-out.png

   The part after "wallpapers/" and before the file extension becomes
   both the page title (turned into "Be Holy") and the URL
   (/wallpaper/be-holy). Use dashes or underscores between words —
   they get converted to spaces in the title automatically.
3. Set the file's access to "Public" if asked (your store may already
   default to this).

That's it — no redeploy needed. Refresh the site and it'll show up.

Note on the Studio dashboard
-----------------------------
/studio is left in place and untouched, but it now writes to a separate
catalog.json file that the public site no longer reads. If you want it
fully working again later, that's a separate, smaller fix — just let me
know.
