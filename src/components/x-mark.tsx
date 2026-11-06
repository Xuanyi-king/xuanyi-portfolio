import { useId } from "react";
import { ribbonGeometry, type Point } from "@/motion/geometry";
import { silkSurface, type SilkVariant } from "@/motion/surface";

export function XMark({
  className = "",
  decorative = true,
  compact = false,
  variant = "cloud",
  pose,
}: {
  className?: string;
  decorative?: boolean;
  compact?: boolean;
  variant?: SilkVariant;
  pose?: [Point, Point];
}) {
  const id = useId().replace(/:/g, "");
  const geometry = ribbonGeometry(
    pose?.[0] ?? { x: 0, y: 0 },
    pose?.[1] ?? { x: 0, y: 0 },
  );
  const surfaces = geometry.curves.map((curve, i) =>
    silkSurface(curve, i, variant, compact),
  );
  const front = variant === "cloud" ? 1 : 0,
    back = 1 - front;
  const layer = (index: number) => {
    const name = index === 0 ? "a" : "b",
      s = surfaces[index];
    return (
      <g key={name} className={`silk-layer silk-${name}`}>
        <path
          data-surface={`${name}-outline`}
          d={s.outline}
          fill={
            compact
              ? index === 0
                ? "#6398ae"
                : "#ca916d"
              : index === 0
                ? "#77a7b9"
                : "#d99c78"
          }
        />
        {!compact && (
          <>
            <path
              data-surface={`${name}-face`}
              d={s.face}
              fill={`url(#${id}${name})`}
            />
            <path
              data-surface={`${name}-sheen`}
              d={s.sheen}
              fill={`url(#${id}sheen-${name})`}
            />
            <path
              data-surface={`${name}-edge`}
              d={s.edge}
              fill={index === 0 ? "#487b91" : "#bc805f"}
              opacity=".25"
            />
            <path
              data-surface={`${name}-highlight`}
              d={s.highlight}
              fill="none"
              stroke="#fffdf4"
              strokeWidth=".72"
              opacity=".65"
            />
          </>
        )}
      </g>
    );
  };
  return (
    <svg
      className={`x-mark silk-form ${className}`}
      data-material={variant}
      data-compact={compact ? "true" : undefined}
      viewBox="0 0 500 500"
      fill="none"
      role={decorative ? undefined : "img"}
      aria-label={
        decorative ? undefined : "XUANYI 原创 X Mark：两片交错的云绸曲面"
      }
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <linearGradient
          id={`${id}a`}
          x1="180"
          y1="100"
          x2="350"
          y2="370"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--ribbon-a-start,#e5f3f4)" />
          <stop offset=".48" stopColor="var(--ribbon-a-mid,#8bbcd0)" />
          <stop offset="1" stopColor="var(--ribbon-a-end,#dcecf0)" />
        </linearGradient>
        <linearGradient
          id={`${id}b`}
          x1="365"
          y1="110"
          x2="140"
          y2="385"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--ribbon-b-start,#fff0d7)" />
          <stop offset=".48" stopColor="var(--ribbon-b-mid,#efbf9c)" />
          <stop offset="1" stopColor="var(--ribbon-b-end,#ffe6ca)" />
        </linearGradient>
        {[
          ["a", 270, 230, 230, 270],
          ["b", 225, 225, 275, 275],
        ].map(([name, x1, y1, x2, y2]) => (
          <linearGradient
            key={name}
            id={`${id}sheen-${name}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fffdf4" stopOpacity="0" />
            <stop offset=".42" stopColor="#fffdf4" stopOpacity=".33" />
            <stop offset=".58" stopColor="#fffdf4" stopOpacity=".33" />
            <stop offset="1" stopColor="#fffdf4" stopOpacity="0" />
          </linearGradient>
        ))}
        <clipPath id={`${id}contact`}>
          <path
            data-surface={`${back === 0 ? "a" : "b"}-outline`}
            d={surfaces[back].outline}
          />
        </clipPath>
      </defs>
      {geometry.paths.map((d, i) => (
        <path
          key={i}
          className={`x-ribbon x-ribbon-${i === 0 ? "a" : "b"} x-centerline`}
          data-ribbon={i === 0 ? "a" : "b"}
          d={d}
        />
      ))}
      <g className="x-material">
        {layer(back)}
        {!compact && (
          <g clipPath={`url(#${id}contact)`}>
            <path
              data-surface={`${front === 0 ? "a" : "b"}-outline`}
              d={surfaces[front].outline}
              transform="translate(1 3)"
              fill="#335264"
              opacity=".10"
            />
          </g>
        )}
        {layer(front)}
      </g>
    </svg>
  );
}
