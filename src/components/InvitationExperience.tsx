import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import embroideryImg from '../assets/embroidery.jpg'
import sealImage from '../assets/seal.png'
import { InvitationPage } from './InvitationPage'

type OpeningPhase = 'sealed' | 'cracking' | 'opening' | 'open'

const motes = [
  { x: '8%', y: '15%', delay: '-2s', duration: '10s' },
  { x: '16%', y: '76%', delay: '-7s', duration: '12s' },
  { x: '27%', y: '35%', delay: '-4s', duration: '9s' },
  { x: '36%', y: '88%', delay: '-9s', duration: '13s' },
  { x: '53%', y: '18%', delay: '-1s', duration: '11s' },
  { x: '63%', y: '72%', delay: '-6s', duration: '10s' },
  { x: '74%', y: '30%', delay: '-3s', duration: '12s' },
  { x: '84%', y: '83%', delay: '-8s', duration: '9s' },
  { x: '92%', y: '48%', delay: '-5s', duration: '13s' },
]

export function InvitationExperience() {
  const [phase, setPhase] = useState<OpeningPhase>('sealed')
  const [introVisible, setIntroVisible] = useState(true)
  const crackTimer = useRef<number | null>(null)
  const completionTimer = useRef<number | null>(null)
  const dismissTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (crackTimer.current !== null) {
        window.clearTimeout(crackTimer.current)
      }
      if (completionTimer.current !== null) {
        window.clearTimeout(completionTimer.current)
      }
      if (dismissTimer.current !== null) {
        window.clearTimeout(dismissTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('intro-locked', introVisible)
    return () => document.body.classList.remove('intro-locked')
  }, [introVisible])

  const openInvitation = () => {
    if (phase !== 'sealed') return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    setPhase('cracking')
    
    // Smooth timing progression: crack -> open flaps -> reveal site
    crackTimer.current = window.setTimeout(
      () => {
        setPhase('opening')
        completionTimer.current = window.setTimeout(
          () => {
            setPhase('open')
            dismissTimer.current = window.setTimeout(
              () => setIntroVisible(false),
              prefersReducedMotion ? 180 : 700,
            )
          },
          prefersReducedMotion ? 400 : 1600,
        )
      },
      prefersReducedMotion ? 100 : 900,
    )
  }

  const replayOpening = () => {
    setIntroVisible(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (crackTimer.current !== null) {
      window.clearTimeout(crackTimer.current)
      crackTimer.current = null
    }
    if (completionTimer.current !== null) {
      window.clearTimeout(completionTimer.current)
      completionTimer.current = null
    }
    if (dismissTimer.current !== null) {
      window.clearTimeout(dismissTimer.current)
      dismissTimer.current = null
    }
    setPhase('sealed')
  }

  return (
    <div className="wedding-site">
      <InvitationPage
        onReplay={replayOpening}
        celebrationActive={!introVisible}
      />

      {introVisible && (
        <div className={`invitation-opening is-${phase}`}>
          <div className="ambient-glow ambient-glow--gold" aria-hidden="true" />
          <div className="ambient-glow ambient-glow--pink" aria-hidden="true" />

          <div className="motes" aria-hidden="true">
            {motes.map((mote, index) => (
              <span
                key={index}
                style={
                  {
                    '--mote-x': mote.x,
                    '--mote-y': mote.y,
                    '--mote-delay': mote.delay,
                    '--mote-duration': mote.duration,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <p className="opening-kicker">Nwaamaka&nbsp; · &nbsp;Nnaemeka</p>

          <section className="opening-stage" aria-label="Wedding invitation opening">
            <div className="envelope-shell">
              <article className="invitation-preview" aria-hidden={phase === 'sealed'}>
                <div className="invitation-frame">
                  <span className="corner corner--top-left" aria-hidden="true" />
                  <span className="corner corner--top-right" aria-hidden="true" />
                  <span className="corner corner--bottom-left" aria-hidden="true" />
                  <span className="corner corner--bottom-right" aria-hidden="true" />

                  <div className="preview-monogram" aria-hidden="true">
                    N<span>&amp;</span>N
                  </div>
                  <p className="preview-overline">Together with their families</p>
                  <p className="preview-story">Vanilla Love Story</p>
                  <h1>
                    Nwaamaka
                    <span>&amp;</span>
                    Nnaemeka
                  </h1>
                  <div className="ornament" aria-hidden="true">
                    <i />
                    <b>✦</b>
                    <i />
                  </div>
                  <time dateTime="2026-12-19">19 · 12 · 2026</time>
                  <p className="preview-subtitle">The Countdown to “I Do”</p>
                </div>
              </article>

              <svg
                className="envelope-svg"
                viewBox="0 0 780 1000"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id="paperTexture"
                    x="-12%"
                    y="-12%"
                    width="124%"
                    height="124%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.72"
                      numOctaves="4"
                      seed="19"
                      result="paperNoise"
                    />
                    <feComponentTransfer in="paperNoise" result="softGrain">
                      <feFuncR type="linear" slope="0.16" intercept="0.84" />
                      <feFuncG type="linear" slope="0.15" intercept="0.85" />
                      <feFuncB type="linear" slope="0.13" intercept="0.87" />
                      <feFuncA type="linear" slope="0.13" />
                    </feComponentTransfer>
                    <feBlend
                      in="SourceGraphic"
                      in2="softGrain"
                      mode="multiply"
                    />
                  </filter>

                  {/* Embroidery photo texture — tiles the real embroidery JPG over flap surfaces */}
                  <pattern
                    id="embroideryTexture"
                    width="320"
                    height="320"
                    patternUnits="userSpaceOnUse"
                  >
                    <image
                      href={embroideryImg}
                      x="0"
                      y="0"
                      width="320"
                      height="320"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </pattern>

                  <pattern
                    id="embossedDamask"
                    width="56"
                    height="56"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M28 0 C28 10 21 17 11 19 C21 21 27 29 28 39 C29 29 35 21 45 19 C35 17 28 10 28 0 Z"
                      fill="none"
                      stroke="#a99980"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M0 28 C10 28 17 35 19 45 C21 35 29 29 39 28 C29 27 21 21 19 11 C17 21 10 28 0 28 Z"
                      fill="none"
                      stroke="#b3a58e"
                      strokeWidth="0.65"
                    />
                    <path
                      d="M56 28 C46 28 39 21 37 11 C35 21 27 27 17 28 C27 29 35 35 37 45 C39 35 46 28 56 28 Z"
                      fill="none"
                      stroke="#b3a58e"
                      strokeWidth="0.65"
                    />
                    <circle cx="28" cy="28" r="2.2" fill="none" stroke="#aa9a81" strokeWidth="0.65" />
                  </pattern>

                  <filter
                    id="embossPatternDepth"
                    x="-12%"
                    y="-12%"
                    width="124%"
                    height="124%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="0.55" result="patternBlur" />
                    <feSpecularLighting
                      in="patternBlur"
                      surfaceScale="1.4"
                      specularConstant="0.48"
                      specularExponent="16"
                      lightingColor="#fffdf7"
                      result="patternHighlight"
                    >
                      <feDistantLight azimuth="315" elevation="48" />
                    </feSpecularLighting>
                    <feComposite
                      in="patternHighlight"
                      in2="SourceAlpha"
                      operator="in"
                      result="clippedPatternHighlight"
                    />
                    <feDropShadow
                      dx="0.55"
                      dy="0.7"
                      stdDeviation="0.4"
                      floodColor="#675b48"
                      floodOpacity="0.3"
                      result="patternShadow"
                    />
                    <feBlend
                      in="patternShadow"
                      in2="clippedPatternHighlight"
                      mode="screen"
                    />
                  </filter>

                  <linearGradient id="paperBacking" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fffdf7" />
                    <stop offset="0.52" stopColor="#f5efe4" />
                    <stop offset="1" stopColor="#e9dfcf" />
                  </linearGradient>
                  <linearGradient id="paperLeft" x1="0" y1="0" x2="1" y2="0.8">
                    <stop offset="0" stopColor="#fbf8f0" />
                    <stop offset="0.62" stopColor="#eee6d8" />
                    <stop offset="1" stopColor="#ded2c0" />
                  </linearGradient>
                  <linearGradient id="paperRight" x1="1" y1="0" x2="0" y2="0.8">
                    <stop offset="0" stopColor="#fffdf8" />
                    <stop offset="0.6" stopColor="#f0e8dc" />
                    <stop offset="1" stopColor="#ddd0bd" />
                  </linearGradient>
                  <linearGradient id="paperBottom" x1="0.5" y1="1" x2="0.5" y2="0">
                    <stop offset="0" stopColor="#e7ddce" />
                    <stop offset="0.48" stopColor="#f4ede2" />
                    <stop offset="1" stopColor="#fffdf8" />
                  </linearGradient>
                  <linearGradient id="paperTop" x1="0.2" y1="0" x2="0.72" y2="0.9">
                    <stop offset="0" stopColor="#fffefa" />
                    <stop offset="0.48" stopColor="#f8f2e8" />
                    <stop offset="1" stopColor="#dfd3c1" />
                  </linearGradient>
                  <radialGradient id="foldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0" stopColor="#f4dda0" stopOpacity="0.9" />
                    <stop offset="0.45" stopColor="#e7c873" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#e7c873" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="topFlapLight" cx="50%" cy="18%" r="74%">
                    <stop offset="0" stopColor="#fff9de" stopOpacity="0.96" />
                    <stop offset="0.46" stopColor="#f7df9d" stopOpacity="0.32" />
                    <stop offset="1" stopColor="#f7df9d" stopOpacity="0" />
                  </radialGradient>
                  {/* Gold embroidery thread gradient */}
                  <linearGradient id="goldThreadGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f5e07a" />
                    <stop offset="35%" stopColor="#c9973a" />
                    <stop offset="65%" stopColor="#e8c655" />
                    <stop offset="100%" stopColor="#a87528" />
                  </linearGradient>
                  {/* Clip paths for each flap embroidery border */}
                  <clipPath id="clipTop">
                    <path d="M0 0 L390 548 L780 0 Z" />
                  </clipPath>
                  <clipPath id="clipLeft">
                    <path d="M0 0 L423 510 L0 1000 Z" />
                  </clipPath>
                  <clipPath id="clipRight">
                    <path d="M780 0 L357 510 L780 1000 Z" />
                  </clipPath>
                  <clipPath id="clipBottom">
                    <path d="M0 1000 L390 438 L780 1000 Z" />
                  </clipPath>
                </defs>

                {/* Layer 1: backing — no embroidery here so it doesn't ghost behind opening flaps */}
                <g className="flap flap--backing">
                  <path
                    className="flap-surface"
                    d="M0 0 H780 V1000 H0 Z"
                    fill="url(#paperBacking)"
                    filter="url(#paperTexture)"
                  />
                  <path
                    className="flap-pattern"
                    d="M0 0 H780 V1000 H0 Z"
                    fill="url(#embossedDamask)"
                    filter="url(#embossPatternDepth)"
                  />
                </g>

                {/* Layer 2: overlapping left and right flaps */}
                <g className="flap-side-layer">
                  <g className="flap flap--left">
                    <path
                      className="flap-surface"
                      d="M0 0 L423 510 L0 1000 Z"
                      fill="url(#paperLeft)"
                      filter="url(#paperTexture)"
                    />
                    {/* Real embroidery texture on left flap */}
                    <path
                      d="M0 0 L423 510 L0 1000 Z"
                      fill="url(#embroideryTexture)"
                      opacity="0.2"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                    <path
                      className="flap-pattern"
                      d="M0 0 L423 510 L0 1000 Z"
                      fill="url(#embossedDamask)"
                      filter="url(#embossPatternDepth)"
                    />
                    {/* Gold embroidery lace border — left flap inner hypotenuse */}
                    <g clipPath="url(#clipLeft)" opacity="0.78">
                      <path
                        d="M18 18 L406 500 L18 982"
                        fill="none"
                        stroke="url(#goldThreadGrad)"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M30 35 L395 500 L30 965"
                        fill="none"
                        stroke="url(#goldThreadGrad)"
                        strokeWidth="1.3"
                        strokeDasharray="4 6"
                        strokeLinecap="round"
                        opacity="0.65"
                      />
                      <circle cx="406" cy="500" r="4.5" fill="none" stroke="url(#goldThreadGrad)" strokeWidth="1.5" opacity="0.8" />
                    </g>
                  </g>
                  <g className="flap flap--right">
                    <path
                      className="flap-surface"
                      d="M780 0 L357 510 L780 1000 Z"
                      fill="url(#paperRight)"
                      filter="url(#paperTexture)"
                    />
                    {/* Real embroidery texture on right flap */}
                    <path
                      d="M780 0 L357 510 L780 1000 Z"
                      fill="url(#embroideryTexture)"
                      opacity="0.2"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                    <path
                      className="flap-pattern"
                      d="M780 0 L357 510 L780 1000 Z"
                      fill="url(#embossedDamask)"
                      filter="url(#embossPatternDepth)"
                    />
                    {/* Gold embroidery lace border — right flap inner hypotenuse */}
                    <g clipPath="url(#clipRight)" opacity="0.78">
                      <path
                        d="M762 18 L374 500 L762 982"
                        fill="none"
                        stroke="url(#goldThreadGrad)"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M750 35 L385 500 L750 965"
                        fill="none"
                        stroke="url(#goldThreadGrad)"
                        strokeWidth="1.3"
                        strokeDasharray="4 6"
                        strokeLinecap="round"
                        opacity="0.65"
                      />
                      <circle cx="374" cy="500" r="4.5" fill="none" stroke="url(#goldThreadGrad)" strokeWidth="1.5" opacity="0.8" />
                    </g>
                  </g>
                </g>

                {/* Layer 3: bottom flap */}
                <g className="flap flap--bottom">
                  <path
                    className="flap-surface"
                    d="M0 1000 L390 438 L780 1000 Z"
                    fill="url(#paperBottom)"
                    filter="url(#paperTexture)"
                  />
                  {/* Real embroidery texture on bottom flap */}
                  <path
                    d="M0 1000 L390 438 L780 1000 Z"
                    fill="url(#embroideryTexture)"
                    opacity="0.2"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <path
                    className="flap-pattern"
                    d="M0 1000 L390 438 L780 1000 Z"
                    fill="url(#embossedDamask)"
                    filter="url(#embossPatternDepth)"
                  />
                  {/* Gold embroidery lace border — bottom flap inner edge */}
                  <g clipPath="url(#clipBottom)" opacity="0.78">
                    <path
                      d="M18 982 L390 458 L762 982"
                      fill="none"
                      stroke="url(#goldThreadGrad)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M30 972 L390 474 L750 972"
                      fill="none"
                      stroke="url(#goldThreadGrad)"
                      strokeWidth="1.3"
                      strokeDasharray="4 6"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                    <circle cx="390" cy="450" r="4.5" fill="none" stroke="url(#goldThreadGrad)" strokeWidth="1.5" opacity="0.8" />
                  </g>
                </g>

                {/* Layer 4: top flap */}
                <g className="flap flap--top">
                  <path
                    className="flap-surface"
                    d="M0 0 L390 548 L780 0 Z"
                    fill="url(#paperTop)"
                    filter="url(#paperTexture)"
                  />
                  {/* Real embroidery texture on top flap */}
                  <path
                    d="M0 0 L390 548 L780 0 Z"
                    fill="url(#embroideryTexture)"
                    opacity="0.22"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <path
                    className="flap-pattern"
                    d="M0 0 L390 548 L780 0 Z"
                    fill="url(#embossedDamask)"
                    filter="url(#embossPatternDepth)"
                  />
                  <path
                    className="top-flap-light"
                    d="M0 0 L390 548 L780 0 Z"
                    fill="url(#topFlapLight)"
                  />
                  {/* Gold embroidery lace border — top flap inner edge */}
                  <g clipPath="url(#clipTop)" opacity="0.82">
                    {/* Outer gold stitch line */}
                    <path
                      d="M18 18 L390 528 L762 18"
                      fill="none"
                      stroke="url(#goldThreadGrad)"
                      strokeWidth="2.2"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                    {/* Inner gold stitch line */}
                    <path
                      d="M30 28 L390 510 L750 28"
                      fill="none"
                      stroke="url(#goldThreadGrad)"
                      strokeWidth="1.4"
                      strokeDasharray="4 6"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    {/* Corner floral medallion at apex */}
                    <circle cx="390" cy="538" r="5" fill="none" stroke="url(#goldThreadGrad)" strokeWidth="1.6" opacity="0.85" />
                    <circle cx="390" cy="538" r="2.2" fill="url(#goldThreadGrad)" opacity="0.7" />
                    <circle cx="24" cy="24" r="4" fill="none" stroke="url(#goldThreadGrad)" strokeWidth="1.4" opacity="0.7" />
                    <circle cx="756" cy="24" r="4" fill="none" stroke="url(#goldThreadGrad)" strokeWidth="1.4" opacity="0.7" />
                  </g>
                </g>
                <circle
                  className="fold-light"
                  cx="390"
                  cy="510"
                  r="220"
                  fill="url(#foldGlow)"
                />
                <rect
                  className="envelope-outline"
                  x="1"
                  y="1"
                  width="778"
                  height="998"
                  rx="3"
                  fill="none"
                />
              </svg>

              <div className="seal-anchor">
                <div
                  className={`seal-container${
                    phase === 'cracking' ? ' is-cracking' : ''
                  }${phase === 'opening' || phase === 'open' ? ' is-open' : ''}`}
                >
                  <button
                    className="wax-seal"
                    type="button"
                    onClick={openInvitation}
                    aria-label="Open Nwaamaka and Nnaemeka's wedding invitation"
                    aria-expanded={phase !== 'sealed'}
                    disabled={phase === 'cracking' || phase === 'opening'}
                  >
                    <span className="seal-halo" aria-hidden="true" />

                    <span className="seal-half seal-half--left" aria-hidden="true">
                      <img src={sealImage} alt="" draggable="false" />
                    </span>
                    <span className="seal-half seal-half--right" aria-hidden="true">
                      <img src={sealImage} alt="" draggable="false" />
                    </span>

                    <svg
                      className="crack-overlay"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className="crack-line crack-line--main"
                        pathLength="1"
                        d="M50 2 L48.5 13 L52 22 L49 32 L53 42 L48.5 53 L51.5 63 L47.5 74 L50.5 85 L49 98"
                      />
                      <path
                        className="crack-line crack-line--branch crack-line--branch-one"
                        pathLength="1"
                        d="M49.4 31.5 L41.5 27 L35 30 L28.5 27"
                      />
                      <path
                        className="crack-line crack-line--branch crack-line--branch-two"
                        pathLength="1"
                        d="M52.3 43 L60.5 38.5 L67 41 L74.5 36.5"
                      />
                      <path
                        className="crack-line crack-line--branch crack-line--branch-three"
                        pathLength="1"
                        d="M48.6 65.5 L40.5 70.5 L34 68 L28 73.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <p className="opening-instruction" aria-live="polite">
              {phase === 'sealed' && (
                <>
                  <span className="tap-mark" aria-hidden="true" />
                  Touch the seal to open
                </>
              )}
              {phase === 'cracking' && 'Breaking the seal…'}
              {phase === 'opening' && 'Opening your invitation…'}
              {phase === 'open' && 'Welcome to our love story'}
            </p>
          </section>

          <p className="opening-date">Saturday · 19 December · 2026</p>

          {phase === 'open' && (
            <button className="replay-button" type="button" onClick={replayOpening}>
              <span aria-hidden="true">↻</span> Replay invitation
            </button>
          )}
        </div>
      )}
    </div>
  )
}
