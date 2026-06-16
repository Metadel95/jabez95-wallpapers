import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { loginAction } from "@/lib/actions";
import { siteConfig } from "@/lib/site-config";

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) {
    redirect("/studio");
  }

  const { error } = await searchParams;
  const hasPassword = !!process.env.ADMIN_PASSWORD;

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-(--studio-accent) mb-3">
          {siteConfig.name}
        </p>
        <h1 className="font-display text-4xl tracking-tight mb-2">Studio</h1>
        <p className="text-(--studio-text-soft) mb-8">
          Sign in to add new pressings to the catalog.
        </p>

        {!hasPassword ? (
          <p className="font-mono text-xs text-(--studio-clay) border border-(--studio-line) rounded-sm p-4 leading-relaxed">
            No ADMIN_PASSWORD environment variable is set, so no one can sign
            in yet. Add one in your Vercel project settings (or .env.local
            for local development), then redeploy.
          </p>
        ) : (
          <form action={loginAction} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-xs uppercase tracking-[0.15em] text-(--studio-text-soft) mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="w-full bg-(--studio-surface) border border-(--studio-line) rounded-sm px-4 py-3 text-(--studio-text) outline-none focus:border-(--studio-accent)"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-(--studio-clay)">
                That password didn&apos;t work — try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-(--studio-accent) text-(--studio-bg) font-display italic text-lg py-3 rounded-sm hover:opacity-90 transition-opacity"
            >
              Enter the Studio
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
