import { motion } from 'motion/react'
import { wedding } from '../../content/wedding'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function WeddingFooter() {
  return (
    <motion.footer
      className="wedding-footer floral-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.div variants={staggerContainer}>
        <motion.p className="footer-verse" variants={childVariants}>
          “{wedding.verse}”
          <strong>{wedding.verseReference}</strong>
        </motion.p>
        <motion.div className="footer-monogram" variants={childVariants} aria-label="N and N">
          <span className="footer-monogram__initial">N</span>
          <span className="footer-monogram__ampersand" aria-hidden="true">&amp;</span>
          <span className="footer-monogram__initial">N</span>
        </motion.div>
        <motion.p variants={childVariants}>For more information</motion.p>
        <motion.a href={`tel:${wedding.contact.phone}`} variants={childVariants}>
          {wedding.contact.display}
        </motion.a>
        <motion.div className="hashtags" variants={childVariants}>
          {wedding.hashtags.map((hashtag) => <span key={hashtag}>{hashtag}</span>)}
        </motion.div>
      </motion.div>
    </motion.footer>
  )
}
