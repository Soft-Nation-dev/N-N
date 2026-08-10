import type { FormEvent } from 'react'
import { motion } from 'motion/react'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function MessageSection({
  onSubmit,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <motion.section
      className="paper-section message-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.div className="section-inner" variants={staggerContainer}>
        <motion.p className="section-kicker" variants={childVariants}>With love</motion.p>
        <motion.h2 variants={childVariants}>Send a Message to the Couple</motion.h2>
        <motion.form className="wedding-form" onSubmit={onSubmit} variants={childVariants}>
          <label>
            <span>Name</span>
            <input name="senderName" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>Email Address</span>
            <input name="senderEmail" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="coupleMessage" rows={5} required />
          </label>
          <button type="submit">Send with love</button>
        </motion.form>
      </motion.div>
    </motion.section>
  )
}

