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
    <header className="sticky top-0 z-40 border-b border-hair bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-8 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <CairnMark className="h-[30px] w-6" />
          <span className="font-serif text-[22px] leading-none text-teal">
            Cairn
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative py-1 text-sm transition-colors",
                isActive(l.href)
                  ? "border-b-2 border-gold font-semibold text-teal"
                  : "font-medium text-coffee hover:text-espresso",
              )}
            >
              {l.label}
              {l.href === "/inbox" && inboxCount > 0 ? (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-semibold text-espresso">
                  {inboxCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-[13px] text-slate sm:inline">
            {userEmail}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-[13px] font-semibold text-teal hover:text-teal-hover"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
