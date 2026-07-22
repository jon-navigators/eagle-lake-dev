import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "@/lib/db";

export const ALLOWED_DOMAIN = (
  process.env.ALLOWED_EMAIL_DOMAIN ?? "navigators.org"
).toLowerCase();

/** True if an email address belongs to the allowed org domain. */
export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim().endsWith(`@${ALLOWED_DOMAIN}`);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?sent=1",
    error: "/signin",
  },
  providers: [
    Nodemailer({
      // A dummy transport is fine: when EMAIL_SERVER is unset we override
      // sendVerificationRequest below and never touch it.
      server: process.env.EMAIL_SERVER ?? { host: "localhost", port: 587 },
      from: process.env.EMAIL_FROM ?? "Cairn <no-reply@cairn.local>",
      async sendVerificationRequest({ identifier, url }) {
        if (!process.env.EMAIL_SERVER) {
          // Dev mode: no SMTP required — print the link to the server console.
          console.log(
            `\n──────── Cairn sign-in ────────\n${identifier}\n${url}\n───────────────────────────────\n`,
          );
          return;
        }
        const { createTransport } = await import("nodemailer");
        const transport = createTransport(process.env.EMAIL_SERVER);
        await transport.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM,
          subject: "Your Cairn sign-in link",
          text: `Sign in to Cairn:\n${url}\n\nThis link expires in 24 hours.\n`,
          html: `<p>Sign in to Cairn:</p><p><a href="${url}">${url}</a></p><p style="color:#6B7F5B">This link expires in 24 hours.</p>`,
        });
      },
    }),
  ],
  callbacks: {
    // The gate: only allowed-domain addresses may request a link or sign in.
    // For the email provider this runs before the link is sent, so a
    // non-Navigators address never even receives one.
    async signIn({ user }) {
      return isAllowedEmail(user?.email);
    },
    async session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
