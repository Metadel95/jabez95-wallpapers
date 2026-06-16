import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="border-b border-(--paper-line)">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl tracking-tight font-medium"
        >
          {siteConfig.name}
        </Link>
        <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.2em] text-(--ink-soft)">
          Wallpaper Catalog
        </span>
      </div>
    </header>
  );
}
