import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { wedding } from '../../content/wedding'
import {
  childVariants,
  countdownGroupVariants,
  countdownUnitVariants,
  luxuryEase,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

const weddingTimestamp = new Date(wedding.date.timestamp).getTime()

function getCountdown() {
  const remaining = Math.max(0, weddingTimestamp - Date.now())
  const totalMinutes = Math.floor(remaining / 60000)

  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
    seconds: Math.floor((remaining % 60000) / 1000),
  }
}

function RollingTimeUnit({ value, label }: { value: number; label: string }) {
  const formattedValue = String(value).padStart(2, '0')
  const isDays = label === 'Days'

  return (
    <motion.div className="countdown-unit" variants={countdownUnitVariants}>
      <span
        className={`rolling-number${isDays ? ' rolling-number--days' : ''}`}
        aria-live="off"
      >
        <AnimatePresence initial={false}>
          <motion.strong
            className="rolling-number__value"
            key={formattedValue}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
          >
            {formattedValue}
          </motion.strong>
        </AnimatePresence>
      </span>
      <span>{label}</span>
    </motion.div>
  )
}

export function CountdownSection() {
  const [countdown, setCountdown] = useState(getCountdown)

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(getCountdown()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <motion.section
      className="paper-section countdown-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.div className="section-inner" variants={staggerContainer}>
        <motion.p className="section-kicker" variants={childVariants}>
          The celebration begins in
        </motion.p>
        <motion.div
          className="countdown"
          aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes and ${countdown.seconds} seconds until the wedding`}
          variants={countdownGroupVariants}
        >
          <RollingTimeUnit value={countdown.days} label="Days" />
          <b>:</b>
          <RollingTimeUnit value={countdown.hours} label="Hours" />
          <b>:</b>
          <RollingTimeUnit value={countdown.minutes} label="Minutes" />
          <b>:</b>
          <RollingTimeUnit value={countdown.seconds} label="Seconds" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
