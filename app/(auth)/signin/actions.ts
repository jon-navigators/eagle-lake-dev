"use server";

import { redirect } from "next/navigation";
import { signIn, isAllowedEmail } from "@/lib/auth";

export type SignInState = { error?: string };

const NOT_ALLOWED =
  "This email isn't on Cairn's staff list — ask an admin to add you.";

export async function signInWithEmail(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) return { error: "Enter your email address." };
  if (!isAllowedEmail(email)) return { error: NOT_ALLOWED };

  try {
    const res = await signIn("credentials", { email, redirect: false });
    if (res && typeof res === "object" && "error" in res && res.error) {
      return { error: NOT_ALLOWED };
    }
  } catch (err) {
    // Let Next's redirect signal propagate; treat anything else as a failure.
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return { error: NOT_ALLOWED };
  }

  redirect("/");
}
