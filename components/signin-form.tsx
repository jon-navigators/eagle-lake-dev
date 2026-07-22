"use client";

import { useActionState } from "react";
import { sendMagicLink, type SignInState } from "@/app/(auth)/signin/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    sendMagicLink,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Work email</Label>
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
        <p className="text-sm text-clay-600">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send me a sign-in link"}
      </Button>
    </form>
  );
}
