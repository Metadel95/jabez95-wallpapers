import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { siteConfig } from "@/lib/site-config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/studio/login");
  }

  return (
    <>
      <header className="border-b border-(--studio-line)">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 py-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-(--studio-accent) mb-1">
              {siteConfig.name}
            </p>
            <h1 className="font-display text-2xl tracking-tight">Studio</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft) hover:text-(--studio-accent) transition-colors"
            >
              View site &#8599;
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft) hover:text-(--studio-clay) transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-5xl w-full px-6 sm:px-10 py-10">
        {children}
      </main>
    </>
  );
}
