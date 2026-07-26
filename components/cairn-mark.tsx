/**
 * A cairn — stacked trail stones, tattoo-flash style: heavy black strokes over
 * flat ink colors. `rays` adds the radiating burst used on the sign-in screen
 * and empty states; `dashedTop` marks an unclaimed spot.
 */
export function CairnMark({
  className,
  rays = false,
  dashedTop = false,
}: {
  className?: string;
  rays?: boolean;
  dashedTop?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 30 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {rays ? (
        <g stroke="#1c1a17" strokeWidth="1.6" strokeLinecap="round">
          <path d="M15 1.5v-1.2M6 4L5.1 2.9M24 4l.9-1.1M1.6 11.5L.3 11M28.4 11.5l1.3-.5" />
        </g>
      ) : null}
      <g stroke="#1c1a17" strokeWidth="2">
        <ellipse cx="15" cy="28" rx="12" ry="4" fill="#e0a52b" />
        <ellipse cx="15" cy="20" rx="9" ry="3.6" fill="#c1352b" />
        <ellipse cx="15" cy="13" rx="6.5" ry="3" fill="#e9d7b4" />
        <ellipse
          cx="14.6"
          cy="7.5"
          rx="3.6"
          ry="2.3"
          fill={dashedTop ? "none" : "#e0a52b"}
          strokeDasharray={dashedTop ? "3 2.5" : undefined}
        />
      </g>
    </svg>
  );
}
