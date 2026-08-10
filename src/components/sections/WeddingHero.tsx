import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import heroBgMobile from '../../assets/hero-bg-mobile.jpg'
import heroBgDesktop from '../../assets/hero-bg-desktop.jpg'
import { wedding } from '../../content/wedding'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

const burstColours = [
  'rgba(199, 126, 137, 0.92)',
  'rgba(241, 215, 196, 0.96)',
  'rgba(211, 177, 104, 0.9)',
  'rgba(247, 232, 211, 0.96)',
]

const flowerBurst = Array.from({ length: 28 }, (_, index) => {
  const spread = index / 27
  const peakX = -43 + spread * 86 + ((index % 3) - 1) * 2.5
  const landingX = peakX * 1.16 + ((index % 5) - 2) * 2

  return {
    peakX: `${peakX}vw`,
    landingX: `${landingX}vw`,
    peakY: `${-(38 + (index % 7) * 4)}vh`,
    landingY: `${12 + (index % 5) * 4}vh`,
    width: `${6 + (index % 4) * 1.5}px`,
    height: `${10 + (index % 5) * 1.7}px`,
    duration: `${4.8 + (index % 5) * 0.3}s`,
    delay: `${0.06 + (index % 7) * 0.035}s`,
    rotation: `${220 + index * 37}deg`,
    colour: burstColours[index % burstColours.length],
  }
})

export function WeddingHero({ celebrationActive }: { celebrationActive: boolean }) {
  return (
    <motion.section
      className="wedding-hero"
      id="home"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <picture className="wedding-hero__art-container">
        <source media="(min-width: 768px)" srcSet={heroBgDesktop} />
        <img
          className="wedding-hero__art"
          src={heroBgMobile}
          alt=""
        />
      </picture>
      <div className="wedding-hero__veil" aria-hidden="true" />
      <div className="hero-petals" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <i
            key={index}
            style={{
              '--petal-left': `${4 + index * 9}%`,
              '--petal-width': `${5 + (index % 3) * 2}px`,
              '--petal-height': `${9 + (index % 4) * 2}px`,
                '--petal-duration': `${8 + index * 0.72}s`,
                '--petal-delay': `${index * -1.7}s`,
              '--petal-drift': `${(index % 3) * 18 - 18}px`,
            } as CSSProperties}
          />
        ))}
      </div>

      {celebrationActive && (
        <div className="hero-flower-burst" aria-hidden="true">
          {flowerBurst.map((petal, index) => (
            <i
              key={index}
              style={{
                '--burst-peak-x': petal.peakX,
                '--burst-land-x': petal.landingX,
                '--burst-peak-y': petal.peakY,
                '--burst-land-y': petal.landingY,
                '--burst-width': petal.width,
                '--burst-height': petal.height,
                '--burst-duration': petal.duration,
                '--burst-delay': petal.delay,
                '--burst-rotation': petal.rotation,
                '--burst-colour': petal.colour,
              } as CSSProperties}
            />
          ))}
        </div>
      )}

      <motion.div className="wedding-hero__content" variants={staggerContainer}>
        <motion.p className="hero-eyebrow" variants={childVariants}>
          Wedding Day
        </motion.p>
        <motion.time dateTime={wedding.date.iso} variants={childVariants}>
          {wedding.date.display}
        </motion.time>
        <motion.h1 variants={childVariants}>
          {wedding.couple.partnerOne.firstName}
          <span>&</span>
          {wedding.couple.partnerTwo.firstName}
        </motion.h1>
      </motion.div>

      <motion.a
        className="scroll-cue"
        href="#invitation"
        aria-label="Scroll to invitation details"
        variants={childVariants}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <span>Scroll down</span>
        <svg
          className="scroll-cue__chevron"
          width="16"
          height="10"
          viewBox="0 0 14 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L7 7L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.a>
    </motion.section>
  )
}
