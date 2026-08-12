import { motion } from 'motion/react'
import churchImage from '../../assets/church.jpg'
import receptionHallImage from '../../assets/reception-hall-image.webp'
import { wedding } from '../../content/wedding'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function VenuesSection() {
  const venues = [
    {
      ...wedding.ceremony,
      type: 'Holy Matrimony',
      image: churchImage,
      imageAlt: 'Christ the King Chaplaincy',
    },
    {
      ...wedding.reception,
      type: 'Reception',
      image: receptionHallImage,
      imageAlt: 'Kobbs Civic Event Centre reception hall',
    },
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
              <div className="venue-card__image-frame">
                <img
                  className="venue-card__image"
                  src={venue.image}
                  alt={venue.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="venue-card__image-shade" aria-hidden="true" />
              </div>
              <div className="venue-card__content">
                <p className="venue-type">{venue.type}</p>
                <h3>{venue.venue}</h3>
                <p>{venue.address}</p>
                <time dateTime={venue.timestamp}>{venue.time}</time>
                <a
                  className="venue-directions"
                  href={venue.directions}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open directions to ${venue.venue} in Google Maps`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s6-5.05 6-11a6 6 0 1 0-12 0c0 5.95 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2.25" />
                  </svg>
                  <span>
                    <strong>Open directions</strong>
                    <small>View in Google Maps</small>
                  </span>
                  <b aria-hidden="true">&#8599;</b>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
