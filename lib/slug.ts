import { nanoid } from "nanoid";

/** "Be Holy" -> "be-holy" */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Builds a short, unique, URL-safe id from a title. */
export function makeId(title: string): string {
  const base = slugify(title);
  const suffix = nanoid(5).toLowerCase();
  return base ? `${base}-${suffix}` : suffix;
}
