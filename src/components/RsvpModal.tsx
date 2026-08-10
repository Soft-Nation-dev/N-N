import type { FormEvent } from 'react'

export function RsvpModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <section className="rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close RSVP form">
          ×
        </button>
        <p className="section-kicker">Please Respond</p>
        <h2 id="rsvp-title">Confirm Your Attendance</h2>
        <form className="wedding-form" onSubmit={onSubmit}>
          <label>
            <span>Your name</span>
            <input name="guestName" type="text" autoComplete="name" required autoFocus />
          </label>
          <fieldset>
            <legend>Will you be attending?</legend>
            <label><input name="attendance" type="radio" value="Joyfully accepts" required /> Joyfully accepts</label>
            <label><input name="attendance" type="radio" value="Regretfully declines" required /> Regretfully declines</label>
          </fieldset>
          <label>
            <span>Number of guests</span>
            <select name="guestCount" defaultValue="1">
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
            </select>
          </label>
          <label>
            <span>Message for the couple (optional)</span>
            <textarea name="rsvpMessage" rows={3} />
          </label>
          <button type="submit">Send RSVP via WhatsApp</button>
        </form>
      </section>
    </div>
  )
}
