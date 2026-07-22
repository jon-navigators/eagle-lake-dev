/** A cairn — stacked trail stones. Used as the Cairn wordmark glyph. */
export function CairnMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="16" cy="27" rx="11" ry="2.6" fill="currentColor" opacity="0.9" />
      <ellipse cx="16" cy="20.5" rx="8.5" ry="3.2" fill="currentColor" opacity="0.8" />
      <ellipse cx="16" cy="14" rx="6.2" ry="2.8" fill="currentColor" opacity="0.7" />
      <ellipse cx="16" cy="8.5" rx="4" ry="2.4" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="4" r="2.1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
