export function ProjectPreview({ slug }: { slug: string }) {
  return (
    <div className={`project-preview preview-${slug}`} aria-hidden="true">
      <svg viewBox="0 0 600 450" fill="none">
        {slug === "adaptive-router" ? (
          <>
            <path
              className="route-track"
              d="M65 225H210Q260 225 260 170V130Q260 95 310 95H520M210 225H520M210 225Q260 225 260 290V310Q260 355 310 355H520"
            />
            <path
              className="route-signal"
              d="M65 225H210Q260 225 260 170V130Q260 95 310 95H520"
            />
            <circle cx="80" cy="225" r="31" fill="#244c40" />
            <path d="m72 213 12 12-12 12" stroke="#f8faf4" strokeWidth="2" />
            {[95, 225, 355].map((y, i) => (
              <g key={y}>
                <rect
                  x="405"
                  y={y - 29}
                  width="136"
                  height="58"
                  rx="14"
                  fill="#fafaf6"
                />
                <text x="423" y={y + 5} fill="#244c40" fontSize="14">
                  {["Understand", "Choose", "Continue"][i]}
                </text>
              </g>
            ))}
          </>
        ) : slug === "knowledge-film" ? (
          <>
            <circle
              cx="300"
              cy="225"
              r="123"
              stroke="#bd8965"
              strokeWidth="1"
            />
            <g className="film-orbits">
              <ellipse
                cx="300"
                cy="225"
                rx="170"
                ry="60"
                stroke="#e2a176"
                strokeWidth="26"
                transform="rotate(-35 300 225)"
              />
              <ellipse
                cx="300"
                cy="225"
                rx="170"
                ry="60"
                stroke="#fff0d8"
                strokeWidth="26"
                transform="rotate(35 300 225)"
              />
            </g>
            <circle cx="300" cy="225" r="23" fill="#c97c50" />
            <text
              x="45"
              y="402"
              fill="#705039"
              fontFamily="Georgia"
              fontStyle="italic"
              fontSize="28"
            >
              Give an idea a little movement.
            </text>
          </>
        ) : (
          <>
            {[0, 1, 2].map((i) => (
              <g className={`preview-door door-${i}`} key={i}>
                <path
                  d={`M${145 + i * 70} 340V160a80 80 0 0 1 160 0v180z`}
                  fill={["#c3dfef", "#e4edf0", "#f8ddbd"][i]}
                  stroke="#8eafc4"
                />
                {i === 2 && <circle cx="365" cy="190" r="38" fill="#fff8e8" />}
              </g>
            ))}
          </>
        )}
      </svg>
      <span className="preview-caption">ORIGINAL MOTION STUDY · 概念演示</span>
    </div>
  );
}
