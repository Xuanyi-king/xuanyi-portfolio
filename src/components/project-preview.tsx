// Transparent motion accents follow the original artwork; they never replace it.
export function ProjectPreview({ slug }: { slug: string }) {
  return (
    <svg
      className={`project-preview preview-${slug}`}
      viewBox="0 0 1200 900"
      fill="none"
      aria-hidden="true"
    >
      {slug === "adaptive-router" ? (
        <path
          className="route-signal"
          d="M-50 465H320Q420 465 420 365V300Q420 230 500 230H900"
        />
      ) : (
        <g className="film-glint" transform="translate(585 440) rotate(-18)">
          <path d="M-340-164H340M-340 164H340" />
        </g>
      )}
    </svg>
  );
}
