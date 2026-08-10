import { motion } from 'motion/react'
import { wedding } from '../../content/wedding'
import { TornPaperEdge } from '../TornPaperEdge'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function ScheduleSection() {
  const events = [wedding.ceremony, wedding.reception]

  return (
    <motion.section
      className="paper-section schedule-section torn-card-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      {/* Realistic Deckle Torn Top Edge */}
      <TornPaperEdge position="top" />

      <motion.div className="section-inner" variants={staggerContainer}>
        <motion.p className="schedule-script-kicker" variants={childVariants}>
          Schedule of Events
        </motion.p>
        <motion.h2 className="schedule-title" variants={childVariants}>
          Our Wedding Day
        </motion.h2>

        <motion.div className="event-timeline" variants={staggerContainer}>
          {events.map((event, index) => (
            <motion.article variants={childVariants} key={event.title} className="event-card">
              <time dateTime={event.timestamp} className="event-time">{event.shortTime}</time>
              <span
                className={`timeline-bloom${index === 1 ? ' timeline-bloom--rose' : ''}`}
                aria-hidden="true"
              >
                &#10047;
              </span>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.venue}, {event.address}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>

      {/* Realistic Deckle Torn Bottom Edge */}
      <TornPaperEdge position="bottom" />
    </motion.section>
  )
}
