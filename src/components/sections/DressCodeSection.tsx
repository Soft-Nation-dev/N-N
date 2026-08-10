import { motion } from 'motion/react'
import { wedding } from '../../content/wedding'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function DressCodeSection() {
  return (
    <motion.section
      className="paper-section dresscode-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.div className="section-inner" variants={staggerContainer}>
        {/* Dress Code Block */}
        <motion.div className="dress-code-block" variants={childVariants}>
          <h2 className="dress-code-heading">Dress Code</h2>
          <p className="dress-code-text">
            We kindly ask our guests to avoid deep red and maroon attire for the celebration.
          </p>
          <div className="colour-palette" aria-label="Wedding colours">
            {wedding.colours.map((colour) => (
              <div key={colour.name} className="colour-swatch-item">
                <i className={`swatch swatch--${colour.className}`} />
                <span>{colour.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

    </motion.section>
  )
}
