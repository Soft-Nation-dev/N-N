import { useEffect, useState, type FormEvent } from 'react'
import { MotionConfig } from 'motion/react'
import { wedding } from '../content/wedding'
import { RsvpModal, type RsvpReceipt } from './RsvpModal'
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

const rsvpApiBase = (
  import.meta.env.VITE_RSVP_API_URL
  || 'https://vanilla-love-rsvp.ifeanyieee8105.workers.dev'
).trim().replace(/\/$/, '')

const RSVP_STORAGE_KEY = 'vanilla-love-rsvp-receipt-v1'

function loadSavedReceipt(): RsvpReceipt | null {
  try {
    const saved = window.localStorage.getItem(RSVP_STORAGE_KEY)
    if (!saved) return null
    const receipt = JSON.parse(saved) as Partial<RsvpReceipt>
    if (!receipt.code || !receipt.guestName || !receipt.editToken) return null
    return receipt as RsvpReceipt
  } catch {
    return null
  }
}

function saveReceipt(receipt: RsvpReceipt) {
  try {
    window.localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(receipt))
  } catch {
    // The receipt still remains available for this visit when storage is unavailable.
  }
}

export function InvitationPage({
  onReplay,
  onToggleMusic,
  musicPlaying,
  celebrationActive,
}: {
  onReplay: () => void
  onToggleMusic: () => void
  musicPlaying: boolean
  celebrationActive: boolean
}) {
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [rsvpReceipt, setRsvpReceipt] = useState<RsvpReceipt | null>(loadSavedReceipt)
  const [rsvpEditing, setRsvpEditing] = useState(false)

  useEffect(() => {
    if (!rsvpReceipt) return
    saveReceipt(rsvpReceipt)
  }, [rsvpReceipt])

  useEffect(() => {
    if (!rsvpOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRsvpOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [rsvpOpen])

  const sendRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const editingReceipt = rsvpEditing ? rsvpReceipt : null
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)
    setRsvpSubmitting(true)
    setRsvpError('')

    try {
      const response = await fetch(
        editingReceipt
          ? `${rsvpApiBase}/api/rsvps/${encodeURIComponent(editingReceipt.code)}`
          : `${rsvpApiBase}/api/rsvps`, {
        method: editingReceipt ? 'PUT' : 'POST',
        headers: {
          'content-type': 'application/json',
          ...(editingReceipt ? { authorization: `Bearer ${editingReceipt.editToken}` } : {}),
        },
        signal: controller.signal,
        body: JSON.stringify({
          guestName: data.get('guestName'),
          attendance: data.get('attendance'),
          guestCount: data.get('guestCount'),
          message: data.get('rsvpMessage'),
          website: data.get('website'),
        }),
      })
      const payload = await response.json().catch(() => ({})) as { receipt?: RsvpReceipt; error?: string }
      if (!response.ok || !payload.receipt) {
        throw new Error(payload.error || 'We could not record your RSVP. Please try again.')
      }
      saveReceipt(payload.receipt)
      setRsvpReceipt(payload.receipt)
      setRsvpEditing(false)
    } catch (error) {
      setRsvpError(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'The RSVP ledger took too long to respond. Please check your connection and try again.'
          : error instanceof Error
            ? error.message
            : 'We could not record your RSVP. Please try again.',
      )
    } finally {
      window.clearTimeout(timeout)
      setRsvpSubmitting(false)
    }
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
          <RsvpSection hasReceipt={Boolean(rsvpReceipt)} onOpen={() => {
            setRsvpError('')
            setRsvpEditing(false)
            setRsvpOpen(true)
          }} />
          <MessageSection onSubmit={sendMessage} />
          <WeddingFooter />
        </div>

        <div className="floating-invitation-controls">
          <button
            className="music-toggle"
            type="button"
            onClick={onToggleMusic}
            aria-label={musicPlaying ? 'Pause wedding music' : 'Play wedding music'}
            aria-pressed={musicPlaying}
            title={musicPlaying ? 'Pause music' : 'Play music'}
          >
            {musicPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6.75" y="5.25" width="3.5" height="13.5" rx="1" />
                <rect x="13.75" y="5.25" width="3.5" height="13.5" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.8v12.4a1 1 0 0 0 1.55.83l8.25-6.2a1 1 0 0 0 0-1.66L9.55 4.97A1 1 0 0 0 8 5.8Z" />
              </svg>
            )}
          </button>

          <button className="replay-opening" type="button" onClick={onReplay}>
            <span aria-hidden="true">&#8635;</span>
            Replay invitation
          </button>
        </div>

        {rsvpOpen && (
          <RsvpModal
            onClose={() => {
              setRsvpOpen(false)
              setRsvpEditing(false)
            }}
            onSubmit={sendRsvp}
            submitting={rsvpSubmitting}
            error={rsvpError}
            receipt={rsvpEditing ? null : rsvpReceipt}
            draft={rsvpReceipt}
            editing={rsvpEditing}
            onEdit={() => {
              setRsvpEditing(true)
              setRsvpError('')
            }}
          />
        )}
      </main>
    </MotionConfig>
  )
}
