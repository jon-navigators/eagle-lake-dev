"use client";

import { useActionState } from "react";
import { signInWithEmail, type SignInState } from "@/app/(auth)/signin/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Star } from "@/components/ui/flash";

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signInWithEmail,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@navigators.org"
          required
          autoFocus
        />
      </div>
      {state.error ? (
        <p className="flex items-start gap-2 text-[12px] font-bold leading-snug text-red">
          <Star size={11} className="mt-0.5 text-red" />
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
