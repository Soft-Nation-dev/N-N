import { motion } from 'motion/react'
import { wedding } from '../../content/wedding'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function VenuesSection() {
  const venues = [
    { ...wedding.ceremony, type: 'Holy Matrimony', illustration: 'chapel' },
    { ...wedding.reception, type: 'Reception', illustration: 'hall' },
  ]

  return (
    <motion.section
      className="paper-section venues-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.div className="section-inner" variants={staggerContainer}>
        <motion.p className="section-kicker" variants={childVariants}>Join us</motion.p>
        <motion.h2 variants={childVariants}>Wedding Venues</motion.h2>
        <motion.div className="venue-grid" variants={staggerContainer}>
          {venues.map((venue) => (
            <motion.article className="venue-card" variants={childVariants} key={venue.type}>
              <div
                className={`venue-illustration venue-illustration--${venue.illustration}`}
                aria-hidden="true"
              >
                <i className="venue-illustration__roof" />
                <i className="venue-illustration__building" />
                <i className="venue-illustration__detail" />
              </div>
              <p className="venue-type">{venue.type}</p>
              <h3>{venue.venue}</h3>
              <p>{venue.address}</p>
              <time dateTime={venue.timestamp}>{venue.time}</time>
              <a href={venue.directions} target="_blank" rel="noreferrer">
                Open directions
              </a>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

