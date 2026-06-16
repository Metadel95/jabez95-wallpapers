import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--paper-line) mt-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-mono text-xs text-(--ink-soft)">
          © {year} {siteConfig.name}. Free for personal use.
        </p>
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.15em]">
          {siteConfig.links.instagram && (
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-(--ink-soft) hover:text-(--clay) transition-colors"
            >
              Instagram
            </a>
          )}
          {siteConfig.links.email && (
            <a
              href={`mailto:${siteConfig.links.email}`}
              className="text-(--ink-soft) hover:text-(--clay) transition-colors"
            >
              Email
            </a>
          )}
          <Link
            href="/studio"
            className="text-(--ink-faint) hover:text-(--clay) transition-colors"
          >
            Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
