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
    <header className="sticky top-0 z-40 border-b border-stone bg-sand/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <CairnMark className="h-6 w-6 text-pine" />
          <span className="text-lg font-semibold text-bark">Cairn</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-sm transition-colors",
                isActive(l.href)
                  ? "bg-pine/10 font-medium text-pine"
                  : "text-bark-soft hover:bg-stone/50 hover:text-bark",
              )}
            >
              {l.label}
              {l.href === "/inbox" && inboxCount > 0 ? (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-semibold text-cream">
                  {inboxCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-bark-soft sm:inline">
            {userEmail}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg px-2 py-1 text-sm text-bark-soft hover:text-clay-600"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
