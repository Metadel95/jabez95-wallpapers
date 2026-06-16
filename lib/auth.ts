import { cookies } from "next/headers";
import { createHash } from "crypto";

export const SESSION_COOKIE = "studio_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  return createHash("sha256").update(`${password}::${secret}`).digest("hex");
}

export function isPasswordCorrect(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return input === password;
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return !!token && token === expectedToken();
}
