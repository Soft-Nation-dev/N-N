import { motion } from 'motion/react'
import { wedding } from '../../content/wedding'
import { TornPaperEdge } from '../TornPaperEdge'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function StorySection() {
  const [firstFamily, secondFamily] = wedding.families

  return (
    <motion.section
      className="paper-section story-section torn-card-section"
      id="invitation"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      

      <motion.div className="section-inner" variants={staggerContainer}>
        <motion.h2 className="story-script-heading" variants={childVariants}>
          Two Souls, One Destiny
        </motion.h2>

        <motion.p className="story-script-subheading" variants={childVariants}>
          A Lifetime Written Together
        </motion.p>

        <motion.p className="story-body" variants={childVariants}>
          Dear Friends and Family,<br />
          Join us for a celebration of love, laughter, prayers, and unforgettable memories as we begin our forever.
        </motion.p>

        <motion.div className="family-block" variants={childVariants}>
          <p>
            <strong>{firstFamily.names}</strong>
            <span>{firstFamily.location}</span>
          </p>
          <i className="family-and">&amp;</i>
          <p>
            <strong>{secondFamily.names}</strong>
            <span>{secondFamily.location}</span>
          </p>
        </motion.div>

        <motion.p className="invitation-intro" variants={childVariants}>
          joyfully invite you to witness the Holy Matrimony of their beloved children
        </motion.p>

        <motion.h3 className="couple-names" variants={childVariants}>
          {wedding.couple.partnerOne.invitationName}
          <span>&amp;</span>
          {wedding.couple.partnerTwo.invitationName}
        </motion.h3>

        <motion.blockquote variants={childVariants}>
          “{wedding.quote}”
        </motion.blockquote>
      </motion.div>

      {/* Realistic Deckle Torn Bottom Edge */}
      <TornPaperEdge position="bottom" />
    </motion.section>
  )
}
