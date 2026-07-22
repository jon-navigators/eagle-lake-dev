import { CairnMark } from "@/components/cairn-mark";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <CairnMark className="h-12 w-12 text-pine" />
          <h1 className="mt-4 text-3xl">Cairn</h1>
        </div>
        <div className="rounded-2xl border border-stone bg-cream p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-xl">Check your email</h2>
          <p className="mt-2 text-bark-soft">
            We sent you a sign-in link. It expires in 24 hours. You can close
            this tab once you&apos;ve opened it.
          </p>
          <p className="mt-4 text-xs text-bark-soft">
            No link?{" "}
            <a href="/signin" className="text-sky underline">
              Try again
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
