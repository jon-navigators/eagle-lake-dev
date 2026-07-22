import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignInForm } from "@/components/signin-form";
import { CairnMark } from "@/components/cairn-mark";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  const { sent } = await searchParams;

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
          {sent ? (
            <div className="text-center">
              <h2 className="text-xl">Check your email</h2>
              <p className="mt-2 text-bark-soft">
                We sent you a sign-in link. It expires in 24 hours. You can close
                this tab.
              </p>
            </div>
          ) : (
            <>
              <SignInForm />
              <p className="mt-4 text-center text-xs text-bark-soft">
                For Eagle Lake staff. Sign in with your{" "}
                <span className="font-medium">@navigators.org</span> email — no
                password needed.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
