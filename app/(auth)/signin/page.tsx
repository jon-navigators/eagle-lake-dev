import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignInForm } from "@/components/signin-form";
import { CairnMark } from "@/components/cairn-mark";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[520px] rounded-none border-[3px] border-ink bg-paper p-8 shadow-[10px_10px_0_#1c1a17] sm:p-12">
        <div className="flex flex-col items-center text-center">
          <CairnMark className="h-[58px] w-[52px]" rays />
          <h1 className="mt-5 font-display text-[40px] leading-none tracking-[0.02em] text-ink">
            Cairn
          </h1>
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-red">
            Eagle Lake · est. 1957
          </p>
        </div>

        <div className="mt-9">
          <SignInForm />
        </div>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-body">
          For Eagle Lake staff. Sign in with your work email — no password
          needed.
        </p>
      </div>
    </main>
  );
}
