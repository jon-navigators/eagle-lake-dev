import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { isAllowedEmail, ALLOWED_DOMAIN } from "@/lib/allowlist";

// Re-export the gate so existing importers of "@/lib/auth" keep working.
export { isAllowedEmail, ALLOWED_DOMAIN };

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Credentials requires JWT sessions (not database sessions).
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    // Email-only sign-in: enter your email and, if you're on the allowlist,
    // you're in — no password, no verification link. NOTE: this does not prove
    // ownership of the address; it is an intentional, temporary trade-off for an
    // internal, allowlisted staff tool. Re-enable a verified provider for real
    // authentication.
    Credentials({
      name: "Email",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        if (!isAllowedEmail(email)) return null;

        // Find or create the staff user, then hand back the identity.
        const user = await prisma.user.upsert({
          where: { email },
          create: { email },
          update: {},
          select: { id: true, email: true, name: true },
        });
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, persist the DB user id into the token.
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
});
