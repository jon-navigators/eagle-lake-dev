import { requireUser } from "@/lib/session";

export default async function HomePage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] ?? user.email.split("@")[0];

  return (
    <div>
      <h1 className="text-3xl">Welcome, {firstName}</h1>
      <p className="mt-2 text-bark-soft">
        This is your home. Your commitments will live here.
      </p>
    </div>
  );
}
