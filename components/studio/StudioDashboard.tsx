"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { siteConfig } from "@/lib/site-config";
import type { Wallpaper } from "@/lib/types";

function formatCatalogNumber(n: number) {
  return n.toString().padStart(3, "0");
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StudioDashboard({ initial }: { initial: Wallpaper[] }) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(
    [...initial].sort((a, b) => b.catalogNumber - a.catalogNumber)
  );

  return (
    <div className="space-y-14">
      <UploadPanel
        onUploaded={(w) => setWallpapers((prev) => [w, ...prev])}
      />
      <CatalogList wallpapers={wallpapers} setWallpapers={setWallpapers} />
    </div>
  );
}

function UploadPanel({ onUploaded }: { onUploaded: (w: Wallpaper) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function pickFile(f: File | null) {
    setFile(f);
    setError(null);
    if (f && !title) {
      // Suggest a title from the filename, e.g. "be-holy-final.png" -> "Be Holy Final"
      const base = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      setTitle(base.replace(/\b\w/g, (c) => c.toUpperCase()));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Give the piece a title.");
      return;
    }

    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("categories", categories);

    try {
      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      onUploaded(data.wallpaper);
      setFile(null);
      setTitle("");
      setCategories("");
      if (inputRef.current) inputRef.current.value = "";
      setStatus("done");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setStatus("idle");
    }
  }

  return (
    <section>
      <h2 className="font-display text-2xl tracking-tight mb-5">
        Add a pressing
      </h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) pickFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={`flex flex-col items-center justify-center gap-4 rounded-sm border border-dashed px-6 py-12 text-center cursor-pointer transition-colors min-h-56 ${
            isDragging
              ? "border-(--studio-accent) bg-(--studio-surface-raised)"
              : "border-(--studio-line) bg-(--studio-surface)"
          }`}
        >
          {file ? (
            <div className="w-20">
              <PhoneFrame
                src={URL.createObjectURL(file)}
                alt="Selected wallpaper preview"
                dark
              />
            </div>
          ) : (
            <>
              <p className="font-display italic text-xl">
                Drop a wallpaper here
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft)">
                or click to browse — PNG or JPG
              </p>
            </>
          )}
          {file && (
            <p className="font-mono text-xs text-(--studio-text-soft) break-all">
              {file.name}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="title"
              className="block font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft) mb-2"
            >
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Be Holy"
              className="w-full bg-(--studio-surface) border border-(--studio-line) rounded-sm px-4 py-3 outline-none focus:border-(--studio-accent)"
            />
          </div>

          <div>
            <label
              htmlFor="categories"
              className="block font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft) mb-2"
            >
              Categories
            </label>
            <input
              id="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Scripture, Typography"
              className="w-full bg-(--studio-surface) border border-(--studio-line) rounded-sm px-4 py-3 outline-none focus:border-(--studio-accent)"
            />
            <p className="font-mono text-xs text-(--studio-text-soft) mt-2">
              Separate with commas. These become the filter tags on the site.
            </p>
          </div>

          {error && (
            <p className="font-mono text-xs text-(--studio-clay)">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "uploading"}
            className="mt-auto bg-(--studio-accent) text-(--studio-bg) font-display italic text-lg py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "uploading"
              ? "Pressing…"
              : status === "done"
                ? "Added to the catalog"
                : "Add to catalog"}
          </button>
        </div>
      </form>
    </section>
  );
}

function CatalogList({
  wallpapers,
  setWallpapers,
}: {
  wallpapers: Wallpaper[];
  setWallpapers: React.Dispatch<React.SetStateAction<Wallpaper[]>>;
}) {
  const router = useRouter();

  if (wallpapers.length === 0) {
    return (
      <section>
        <h2 className="font-display text-2xl tracking-tight mb-5">
          The catalog
        </h2>
        <p className="font-mono text-sm text-(--studio-text-soft)">
          Nothing pressed yet. Add your first wallpaper above and it&apos;ll
          show up here — and on the site.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-display text-2xl tracking-tight mb-5">
        The catalog
        <span className="font-mono text-sm text-(--studio-text-soft) ml-3">
          {wallpapers.length} {wallpapers.length === 1 ? "piece" : "pieces"}
        </span>
      </h2>
      <ul className="divide-y divide-(--studio-line) border-y border-(--studio-line)">
        {wallpapers.map((w) => (
          <CatalogRow
            key={w.id}
            wallpaper={w}
            onChange={(updated) =>
              setWallpapers((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              )
            }
            onDeleted={() => {
              setWallpapers((prev) => prev.filter((p) => p.id !== w.id));
              router.refresh();
            }}
          />
        ))}
      </ul>
    </section>
  );
}

function CatalogRow({
  wallpaper,
  onChange,
  onDeleted,
}: {
  wallpaper: Wallpaper;
  onChange: (w: Wallpaper) => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(wallpaper.title);
  const [categories, setCategories] = useState(wallpaper.categories.join(", "));
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const date = new Date(wallpaper.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/studio/wallpapers/${wallpaper.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save.");
      onChange(data.wallpaper);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/studio/wallpapers/${wallpaper.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Couldn't delete.");
      }
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <li className="py-5 flex flex-col sm:flex-row gap-5 sm:items-center">
      <div className="w-14 shrink-0">
        <PhoneFrame src={wallpaper.imageUrl} alt={wallpaper.title} dark />
      </div>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex flex-col gap-2 max-w-md">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-(--studio-surface) border border-(--studio-line) rounded-sm px-3 py-2 text-sm outline-none focus:border-(--studio-accent)"
            />
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Categories, comma separated"
              className="bg-(--studio-surface) border border-(--studio-line) rounded-sm px-3 py-2 text-sm font-mono outline-none focus:border-(--studio-accent)"
            />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-lg truncate">{wallpaper.title}</span>
              <span className="font-mono text-xs text-(--studio-text-soft)">
                {siteConfig.catalogPrefix} {formatCatalogNumber(wallpaper.catalogNumber)}
              </span>
            </div>
            <p className="font-mono text-xs text-(--studio-text-soft) mt-1">
              {wallpaper.categories.length > 0
                ? wallpaper.categories.join(" · ") + " — "
                : ""}
              {date} · {wallpaper.width}&times;{wallpaper.height} · {formatSize(wallpaper.size)}
            </p>
          </>
        )}
        {error && <p className="font-mono text-xs text-(--studio-clay) mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.15em] shrink-0">
        {editing ? (
          <>
            <button
              onClick={save}
              disabled={saving}
              className="text-(--studio-accent) hover:opacity-80 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setTitle(wallpaper.title);
                setCategories(wallpaper.categories.join(", "));
              }}
              className="text-(--studio-text-soft) hover:text-(--studio-text)"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="text-(--studio-text-soft) hover:text-(--studio-text)"
            >
              Edit
            </button>
            <button
              onClick={() => (confirmingDelete ? remove() : setConfirmingDelete(true))}
              onBlur={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="text-(--studio-clay) hover:opacity-80 disabled:opacity-50"
            >
              {deleting ? "Removing…" : confirmingDelete ? "Confirm?" : "Delete"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
