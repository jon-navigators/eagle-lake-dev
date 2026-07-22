import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

/**
 * Returns the signed-in user or redirects to the sign-in page.
 * Use in every authenticated Server Component and server action so the session
 * is always re-checked on the server.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email) redirect("/signin");
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
  };
}
