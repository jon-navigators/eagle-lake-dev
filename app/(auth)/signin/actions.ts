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

  // signIn throws a redirect to the verifyRequest page on success.
  await signIn("nodemailer", { email, redirectTo: "/" });
  // Unreachable in practice, but keeps the type happy.
  redirect("/signin?sent=1");
}
