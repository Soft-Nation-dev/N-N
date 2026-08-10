import { motion } from 'motion/react'
import rsvpSealImg from '../../assets/rsvp-seal.jpg'
import { wedding } from '../../content/wedding'
import { TornPaperEdge } from '../TornPaperEdge'
import {
  childVariants,
  sectionVariants,
  sectionViewport,
  staggerContainer,
} from '../animation'

export function RsvpSection({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      className="paper-section rsvp-section torn-card-section"
      id="rsvp"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      {/* Realistic Deckle Torn Top Edge */}
      <TornPaperEdge position="top" />

      <motion.div className="section-inner" variants={staggerContainer}>
        <motion.h2 className="rsvp-heading" variants={childVariants}>
          Confirm Your Attendance
        </motion.h2>
        
        <motion.p className="rsvp-subtext" variants={childVariants}>
          To help us prepare for a joyful celebration,<br />
          kindly confirm your attendance.
        </motion.p>

        {/* Burgundy Wax Seal Trigger Button */}
        <motion.div className="rsvp-seal-wrapper" variants={childVariants}>
          <button
            className="rsvp-wax-seal-button"
            type="button"
            onClick={onOpen}
            aria-label="Open RSVP form"
          >
            <img src={rsvpSealImg} alt="RSVP Wax Seal" className="rsvp-seal-image" />
          </button>
          
          <div className="rsvp-click-cue">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="rsvp-chevron">
              <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="rsvp-click-text">Click to open</span>
          </div>
        </motion.div>

        {/* Sign-off */}
        <motion.div className="rsvp-signoff" variants={childVariants}>
          <p className="rsvp-hope-text">Hope to see you there</p>
          <p className="rsvp-couple-names">
            {wedding.couple.partnerOne.firstName} and {wedding.couple.partnerTwo.firstName}
          </p>
        </motion.div>
      </motion.div>

      {/* Torn lower edge carries the grey stationery into the next cream section. */}
      <TornPaperEdge position="bottom" />
    </motion.section>
  )
}
