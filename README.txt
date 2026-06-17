What this adds
---------------
A "Downloads" page inside your Studio (password-protected, same login as
before) showing how many times each wallpaper has been downloaded, sorted
most-downloaded first. Every time someone hits the download button on the
site, a small counter file in Blob storage gets bumped — it doesn't slow
down their download, since the counting happens after the file has
already started transferring.

Files
-----
  lib/download-counts.ts                    (new)
  app/api/download/[id]/route.ts            (replaces existing — now logs
                                              each download)
  app/studio/(dashboard)/downloads/page.tsx (new — the stats page)
  app/studio/(dashboard)/layout.tsx          (replaces existing — adds a
                                              "Downloads" link in the
                                              Studio header)

How to apply
------------
Copy these 4 files into your repo at the same paths, overwriting what's
there, then:

  git add -A
  git commit -m "Add download tracking and a Studio downloads page"
  git push

Vercel redeploys automatically. Once it's live, go to /studio and you'll
see a new "Downloads" link in the header.
