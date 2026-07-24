import { describe, it, expect, afterEach } from "vitest";
import { isAllowedEmail, allowedEmailSet } from "@/lib/allowlist";

afterEach(() => {
  delete process.env.ALLOWED_EMAILS;
});

describe("allowedEmailSet", () => {
  it("parses comma, space, and newline separated lists, lowercased", () => {
    process.env.ALLOWED_EMAILS =
      "Jon@Navigators.org, dana@navigators.org\n  sam@navigators.org ";
    expect(allowedEmailSet()).toEqual(
      new Set([
        "jon@navigators.org",
        "dana@navigators.org",
        "sam@navigators.org",
      ]),
    );
  });
  it("is empty when unset", () => {
    expect(allowedEmailSet().size).toBe(0);
  });
});

describe("isAllowedEmail with an allowlist", () => {
  it("allows only listed addresses (case-insensitive)", () => {
    process.env.ALLOWED_EMAILS = "jon.cothran@navigators.org, dana@navigators.org";
    expect(isAllowedEmail("Jon.Cothran@navigators.org")).toBe(true);
    expect(isAllowedEmail("dana@navigators.org")).toBe(true);
  });
  it("rejects an unlisted address even on the right domain", () => {
    process.env.ALLOWED_EMAILS = "jon.cothran@navigators.org";
    expect(isAllowedEmail("stranger@navigators.org")).toBe(false);
  });
});

describe("isAllowedEmail without an allowlist (domain fallback)", () => {
  it("falls back to the @navigators.org domain check", () => {
    expect(isAllowedEmail("anyone@navigators.org")).toBe(true);
    expect(isAllowedEmail("someone@gmail.com")).toBe(false);
  });
  it("is false for empty input", () => {
    expect(isAllowedEmail("")).toBe(false);
    expect(isAllowedEmail(null)).toBe(false);
  });
});
