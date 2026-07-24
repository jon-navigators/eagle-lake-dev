import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignInForm } from "@/components/signin-form";
import { CairnMark } from "@/components/cairn-mark";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <CairnMark className="h-12 w-12 text-pine" />
          <h1 className="mt-4 text-3xl">Cairn</h1>
          <p className="mt-1 text-bark-soft">
            A calm place to keep your commitments.
          </p>
        </div>

        <div className="rounded-2xl border border-stone bg-cream p-6 shadow-sm sm:p-8">
          <SignInForm />
          <p className="mt-4 text-center text-xs text-bark-soft">
            For Eagle Lake staff. Sign in with your work email — no password
            needed.
          </p>
        </div>
      </div>
    </main>
  );
}
