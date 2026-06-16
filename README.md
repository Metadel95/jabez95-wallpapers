# Field Pressing — wallpaper catalog & studio

A small site for releasing your wallpaper designs. The public side shows
each piece on a phone mockup with a download button. The private side
(`/studio`) is a password-protected dashboard where you drag a file in,
type a title, and it's live — no editing code, no local dev setup needed
after the first deploy.

## How it's built

- **Next.js** (App Router) — one project, deployed on Vercel.
- **Vercel Blob** — stores the uploaded images and a single `catalog.json`
  index file. No separate database to manage.
- **A password cookie** — `/studio` checks one password against an
  environment variable. Good enough for a single-person dashboard.

## First-time setup

### 1. Push this to GitHub

```bash
git init
git add .
git commit -m "Initial site"
gh repo create your-wallpaper-site --public --source=. --push
```

(Or create the repo on github.com and follow its push instructions.)

### 2. Import the repo on Vercel

Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo, and
deploy. The framework preset (Next.js) is detected automatically.

### 3. Add Blob storage

In the Vercel project: **Storage → Create Database → Blob**, then attach
it to the project. Vercel sets the `BLOB_READ_WRITE_TOKEN` environment
variable automatically — you don't type this in yourself.

### 4. Set your dashboard password

In **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | whatever password you want to log in with |
| `AUTH_SECRET` | any long random string (used to sign the session cookie) |

Generate a random secret with:

```bash
openssl rand -hex 32
```

### 5. Redeploy

Trigger a redeploy (Vercel does this automatically after env vars change,
or push any commit). Visit `your-site.vercel.app/studio`, log in, and
upload your first wallpaper.

## Using it day to day

- Go to `/studio`, drop in an image, give it a title and optional
  categories (comma-separated — these become the filter pills on the
  homepage), and click **Add to catalog**.
- The image is uploaded to Blob storage and immediately appears on the
  live site — no rebuild or redeploy needed.
- Edit a title/categories or delete a piece any time from the same
  dashboard.

## Customizing

Edit `lib/site-config.ts` to change the site name, tagline, and footer
links. Colors and fonts live in `app/globals.css` (CSS variables at the
top) and the font files in `app/fonts/`.

## Local development

```bash
npm install
npm run dev
```

You'll need `BLOB_READ_WRITE_TOKEN` (from `vercel env pull .env.local`),
plus `ADMIN_PASSWORD` and `AUTH_SECRET` in `.env.local` to log into the
Studio locally.
