"use server";

import { redirect } from "next/navigation";
import { signIn, isAllowedEmail, ALLOWED_DOMAIN } from "@/lib/auth";

export type SignInState = { error?: string };

export async function sendMagicLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) return { error: "Enter your email address." };
  if (!isAllowedEmail(email)) {
    return {
      error: `Cairn is for Eagle Lake staff — please use your @${ALLOWED_DOMAIN} address.`,
    };
  }

  // Send the magic link without letting Auth.js handle the redirect, then send
  // the user to our branded "check your email" page deterministically.
  await signIn("nodemailer", { email, redirect: false });
  redirect("/check-email");
}
