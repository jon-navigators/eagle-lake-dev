/**
 * A cairn — stacked trail stones, in the Navigators neutrals
 * (slate → coffee → gold → espresso, largest at the bottom).
 */
export function CairnMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="16" cy="34" rx="13" ry="4" fill="#392f2c" />
      <ellipse cx="16" cy="25.5" rx="10.5" ry="3.6" fill="#d19f2a" />
      <ellipse cx="16" cy="17.5" rx="8" ry="3.2" fill="#61514e" />
      <ellipse cx="16" cy="10.5" rx="5.5" ry="2.8" fill="#8e9c9c" />
      <circle cx="16" cy="4.5" r="2.6" fill="#008c95" />
    </svg>
  );
}
