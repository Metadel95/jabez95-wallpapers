"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, isPasswordCorrect } from "./auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!isPasswordCorrect(password)) {
    redirect("/studio/login?error=1");
  }

  await createSession();
  redirect("/studio");
}

export async function logoutAction() {
  await destroySession();
  redirect("/studio/login");
}
