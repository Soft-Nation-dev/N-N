import type { Variants } from 'motion/react'

export const luxuryEase = [0.16, 1, 0.3, 1] as const
export const sectionViewport = { once: true, amount: 0.16 } as const

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: luxuryEase,
      staggerChildren: 0.12,
    },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const childVariants: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: luxuryEase },
  },
}

export const countdownGroupVariants: Variants = {
  hidden: { opacity: 0, x: 80, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: luxuryEase,
      staggerChildren: 0.18,
      staggerDirection: -1,
    },
  },
}

export const countdownUnitVariants: Variants = {
  hidden: { opacity: 0, x: 48, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: luxuryEase },
  },
}
