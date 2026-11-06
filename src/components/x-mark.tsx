import { useId } from "react";
export function XMark({
  className = "",
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const a = "M112 110 C258 102 244 366 390 378",
    b = "M390 103 C246 112 254 367 110 382";
  return (
    <svg
      className={`x-mark ${className}`}
      viewBox="0 0 500 500"
      fill="none"
      role={decorative ? undefined : "img"}
      aria-label={
        decorative ? undefined : "XUANYI 原创 X Mark：两条交错的流动丝带"
      }
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <linearGradient
          id={`${id}a`}
          x1="112"
          y1="90"
          x2="390"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--ribbon-a-start, #b6dfee)" />
          <stop offset=".45" stopColor="var(--ribbon-a-mid, #6caac8)" />
          <stop offset="1" stopColor="var(--ribbon-a-end, #a8d0e3)" />
        </linearGradient>
        <linearGradient
          id={`${id}b`}
          x1="385"
          y1="100"
          x2="110"
          y2="385"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--ribbon-b-start, #ffe3bd)" />
          <stop offset=".45" stopColor="var(--ribbon-b-mid, #e7aa84)" />
          <stop offset="1" stopColor="var(--ribbon-b-end, #f6cfac)" />
        </linearGradient>
        <linearGradient
          id={`${id}edge`}
          x1="190"
          y1="100"
          x2="310"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffaf0" stopOpacity=".8" />
          <stop offset=".48" stopColor="#fffaf0" stopOpacity=".05" />
          <stop offset="1" stopColor="#fffaf0" stopOpacity=".55" />
        </linearGradient>
        <filter id={`${id}s`} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="4"
            floodColor="#31566b"
            floodOpacity=".12"
          />
        </filter>
      </defs>
      <g className="x-material" filter={`url(#${id}s)`} strokeLinecap="butt">
        {[
          ["a", a],
          ["b", b],
        ].map(([name, d]) => (
          <g key={name}>
            <path
              className={`x-ribbon x-ribbon-${name}`}
              data-ribbon={name}
              d={d}
              stroke={`url(#${id}${name})`}
              strokeWidth="58"
            />
            <path
              className="x-selvedge"
              data-ribbon={name}
              d={d}
              stroke={`url(#${id}edge)`}
              strokeWidth="55"
              transform="translate(-.8 -1)"
            />
            <path
              className="x-ink-edge"
              data-ribbon={name}
              d={d}
              stroke="#244a62"
              strokeOpacity=".12"
              strokeWidth=".8"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
