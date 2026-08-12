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

export function RsvpSection({ onOpen, hasReceipt }: { onOpen: () => void; hasReceipt: boolean }) {
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
            aria-label={hasReceipt ? 'View your RSVP receipt' : 'Open RSVP form'}
          >
            <span className="rsvp-seal-rotator">
              <img src={rsvpSealImg} alt="" className="rsvp-seal-image" />
            </span>

            <span className="rsvp-click-cue">
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="rsvp-chevron" aria-hidden="true">
                <path d="M1 9L9 1L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <strong className="rsvp-click-text">{hasReceipt ? 'View your RSVP receipt' : 'Tap the seal to RSVP'}</strong>
              <small>{hasReceipt ? 'Your response has been saved' : 'Open the attendance form'}</small>
            </span>
          </button>
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
