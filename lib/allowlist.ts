// Who may sign in to Cairn. Kept dependency-free (no Auth.js/Prisma imports) so
// it's cheap to unit-test and safe to import anywhere.

export const ALLOWED_DOMAIN = (
  process.env.ALLOWED_EMAIL_DOMAIN ?? "navigators.org"
).toLowerCase();

/** Parse ALLOWED_EMAILS (comma / space / newline separated) into a lowercased set. */
export function allowedEmailSet(): Set<string> {
  const raw = process.env.ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(/[,\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * True if an email may sign in.
 * - If an explicit allowlist (ALLOWED_EMAILS) is set, ONLY addresses on it pass.
 * - Otherwise fall back to the domain check (ALLOWED_EMAIL_DOMAIN) so local/dev
 *   and a domain-wide setup keep working.
 */
export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  const allow = allowedEmailSet();
  if (allow.size > 0) return allow.has(e);
  return e.endsWith(`@${ALLOWED_DOMAIN}`);
}
