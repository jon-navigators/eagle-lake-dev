"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CairnMark } from "@/components/cairn-mark";
import { signOutAction } from "@/app/(app)/auth-actions";

const links = [
  { href: "/", label: "Home" },
  { href: "/inbox", label: "Inbox" },
  { href: "/team", label: "Team" },
  { href: "/company", label: "Company" },
  { href: "/org", label: "Org" },
];

export function Nav({
  userEmail,
  inboxCount = 0,
}: {
  userEmail: string;
  inboxCount?: number;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-1 px-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 py-3.5">
          <CairnMark className="h-[34px] w-[30px]" />
          <span className="font-display text-2xl leading-none tracking-[0.01em] text-cream">
            Cairn
          </span>
        </Link>

        <nav className="flex flex-1 items-stretch gap-1 self-stretch">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-1.5 px-4 text-[12px] font-extrabold uppercase tracking-[0.14em] transition-colors",
                isActive(l.href)
                  ? "bg-gold text-ink"
                  : "text-cream/80 hover:text-gold",
              )}
            >
              {l.label}
              {l.href === "/inbox" && inboxCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-paper bg-red px-1 text-[10px] font-extrabold text-paper">
                  {inboxCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 py-3.5">
          <span className="hidden text-[12px] font-medium text-nav-email sm:inline">
            {userEmail}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="border-b-2 border-gold pb-0.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-gold hover:text-paper hover:border-paper"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
