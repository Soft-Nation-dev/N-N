import { useEffect, useState, type FormEvent } from 'react'
import { MotionConfig } from 'motion/react'
import { wedding } from '../content/wedding'
import { RsvpModal } from './RsvpModal'
import { CountdownSection } from './sections/CountdownSection'
import { DressCodeSection } from './sections/DressCodeSection'
import { MessageSection } from './sections/MessageSection'
import { RsvpSection } from './sections/RsvpSection'
import { ScheduleSection } from './sections/ScheduleSection'
import { StorySection } from './sections/StorySection'
import { VenuesSection } from './sections/VenuesSection'
import { WeddingFooter } from './sections/WeddingFooter'
import { WeddingHero } from './sections/WeddingHero'

function openWhatsApp(message: string) {
  window.open(
    `https://wa.me/${wedding.contact.whatsapp}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer',
  )
}

export function InvitationPage({
  onReplay,
  celebrationActive,
}: {
  onReplay: () => void
  celebrationActive: boolean
}) {
  const [rsvpOpen, setRsvpOpen] = useState(false)

  useEffect(() => {
    if (!rsvpOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRsvpOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [rsvpOpen])

  const sendRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    openWhatsApp([
      `Hello, I would like to RSVP for ${wedding.hashtags[1]}.`,
      `Name: ${data.get('guestName') || ''}`,
      `Attendance: ${data.get('attendance') || ''}`,
      `Number of guests: ${data.get('guestCount') || '1'}`,
      `Message: ${data.get('rsvpMessage') || '—'}`,
    ].join('\n'))
  }

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    openWhatsApp([
      `A message for ${wedding.couple.partnerOne.firstName} and ${wedding.couple.partnerTwo.firstName}:`,
      `From: ${data.get('senderName') || ''}`,
      `Email: ${data.get('senderEmail') || ''}`,
      '',
      String(data.get('coupleMessage') || ''),
    ].join('\n'))
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="invitation-page">
        <WeddingHero celebrationActive={celebrationActive} />

        <div className="paper-flow">
          <StorySection />
          <CountdownSection />
          <ScheduleSection />
          <VenuesSection />
          <DressCodeSection />
          <RsvpSection onOpen={() => setRsvpOpen(true)} />
          <MessageSection onSubmit={sendMessage} />
          <WeddingFooter />
        </div>

        <button className="replay-opening" type="button" onClick={onReplay}>
          <span aria-hidden="true">↻</span>
          Replay invitation
        </button>

        {rsvpOpen && (
          <RsvpModal onClose={() => setRsvpOpen(false)} onSubmit={sendRsvp} />
        )}
      </main>
    </MotionConfig>
  )
}
