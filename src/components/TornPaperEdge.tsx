/**
 * TornPaperEdge — Realistic deckle torn paper boundary edge.
 *
 * The SVG overflows its container so the torn silhouette acts as the
 * actual visual border of a section, not as a decorative strip inside it.
 *
 * position="top"    → placed at the top of the section, hangs over the section above
 * position="bottom" → placed at the bottom of the section, hangs over the section below
 */
export function TornPaperEdge({ position = 'top' }: { position?: 'top' | 'bottom' }) {
  const filterId = `deckle-${position}`
  const gradId = `fiberGrad-${position}`

  return (
    <div
      className={`torn-paper-edge torn-paper-edge--${position}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="torn-paper-svg"
      >
        <defs>
          {/* Turbulence + displacement creates the organic hand-torn fibre look */}
          <filter id={filterId} x="-2%" y="-60%" width="104%" height="220%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.18"
              numOctaves="6"
              seed="42"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>

          {/* Paper fibre gradient for the torn edge highlight */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff9f2" stopOpacity="1" />
            <stop offset="45%" stopColor="#f2e9db" stopOpacity="1" />
            <stop offset="100%" stopColor="#ddd0bc" stopOpacity="1" />
          </linearGradient>
        </defs>

        {position === 'top' ? (
          <>
            {/* Drop shadow cast by the edge above onto this section */}
            <path
              filter={`url(#${filterId})`}
              d="M-20,0 L1220,0 L1220,28 Q1050,40 900,28 Q780,38 660,26 Q540,38 420,27 Q300,38 180,27 Q90,36 -20,26 Z"
              fill="rgba(60, 38, 28, 0.15)"
              transform="translate(0,6)"
            />
            {/* Cream inner fibre highlight */}
            <path
              filter={`url(#${filterId})`}
              d="M-20,0 L1220,0 L1220,28 Q1050,40 900,28 Q780,38 660,26 Q540,38 420,27 Q300,38 180,27 Q90,36 -20,26 Z"
              fill={`url(#${gradId})`}
              transform="translate(0,2)"
            />
            {/* Main paper body — matches section background so edge looks torn */}
            <path
              filter={`url(#${filterId})`}
              d="M-20,0 L1220,0 L1220,28 Q1050,40 900,28 Q780,38 660,26 Q540,38 420,27 Q300,38 180,27 Q90,36 -20,26 Z"
              fill="#dfd7cf"
            />
          </>
        ) : (
          <>
            {/* Drop shadow cast downward */}
            <path
              filter={`url(#${filterId})`}
              d="M-20,60 L1220,60 L1220,32 Q1050,20 900,32 Q780,22 660,34 Q540,22 420,33 Q300,22 180,33 Q90,24 -20,34 Z"
              fill="rgba(60, 38, 28, 0.15)"
              transform="translate(0,-6)"
            />
            {/* Cream inner fibre highlight */}
            <path
              filter={`url(#${filterId})`}
              d="M-20,60 L1220,60 L1220,32 Q1050,20 900,32 Q780,22 660,34 Q540,22 420,33 Q300,22 180,33 Q90,24 -20,34 Z"
              fill={`url(#${gradId})`}
              transform="translate(0,-2)"
            />
            {/* Main paper body */}
            <path
              filter={`url(#${filterId})`}
              d="M-20,60 L1220,60 L1220,32 Q1050,20 900,32 Q780,22 660,34 Q540,22 420,33 Q300,22 180,33 Q90,24 -20,34 Z"
              fill="#dfd7cf"
            />
          </>
        )}
      </svg>
    </div>
  )
}
