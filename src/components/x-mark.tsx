import { useId } from "react";
export function XMark({
  className = "",
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const a = "M112 110 C258 102 244 366 390 378";
  const b = "M390 103 C246 112 254 367 110 382";
  return (
    <svg
      className={className}
      viewBox="0 0 500 500"
      fill="none"
      role={decorative ? undefined : "img"}
      aria-label={
        decorative ? undefined : "XUANYI 原创 X Mark：两条交错的流动曲带"
      }
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <linearGradient
          id={`${id}a`}
          x1="110"
          y1="80"
          x2="365"
          y2="405"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b9e3ff" />
          <stop offset=".31" stopColor="#91c7f5" />
          <stop offset=".58" stopColor="#468bd4" />
          <stop offset=".82" stopColor="#85bdf1" />
          <stop offset="1" stopColor="#b4d8fc" />
        </linearGradient>
        <linearGradient
          id={`${id}b`}
          x1="384"
          y1="100"
          x2="103"
          y2="386"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c2e5ff" />
          <stop offset=".36" stopColor="#8ac3f2" />
          <stop offset=".61" stopColor="#a7d5fb" />
          <stop offset="1" stopColor="#6da9e6" />
        </linearGradient>
        <linearGradient
          id={`${id}light`}
          x1="200"
          y1="60"
          x2="310"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity=".65" />
          <stop offset=".55" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity=".2" />
        </linearGradient>
        <filter id={`${id}s`} x="-50%" y="-50%" width="200%" height="220%">
          <feDropShadow
            dx="0"
            dy="17"
            stdDeviation="13"
            floodColor="#4079a7"
            floodOpacity=".13"
          />
        </filter>
      </defs>
      <g filter={`url(#${id}s)`} strokeLinecap="round">
        <path
          className="x-ribbon x-ribbon-a"
          data-ribbon="a"
          d={a}
          stroke={`url(#${id}a)`}
          strokeWidth="83"
        />
        <path
          data-ribbon="a"
          d={a}
          stroke={`url(#${id}light)`}
          strokeWidth="66"
          transform="translate(0 -5)"
        />
        <path
          className="x-ribbon x-ribbon-b"
          data-ribbon="b"
          d={b}
          stroke={`url(#${id}b)`}
          strokeWidth="83"
        />
        <path
          data-ribbon="b"
          d={b}
          stroke={`url(#${id}light)`}
          strokeWidth="66"
          transform="translate(0 -5)"
        />
      </g>
    </svg>
  );
}
