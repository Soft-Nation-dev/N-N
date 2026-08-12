import type { FormEvent } from 'react'

export interface RsvpReceipt {
  code: string
  guestName: string
  attendance: 'accepts' | 'declines'
  guestCount: number
  submittedAt: string
  updatedAt: string
  eventDate: string
  message: string
  editToken: string
}

export function RsvpModal({
  onClose,
  onSubmit,
  submitting,
  error,
  receipt,
  draft,
  editing,
  onEdit,
}: {
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitting: boolean
  error: string
  receipt: RsvpReceipt | null
  draft: RsvpReceipt | null
  editing: boolean
  onEdit: () => void
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <section
        className={`rsvp-modal${receipt ? ' rsvp-modal--receipt' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close RSVP form">
          &times;
        </button>

        {receipt ? (
          <article className="rsvp-receipt">
            <div className="receipt-corner receipt-corner--one" aria-hidden="true" />
            <div className="receipt-corner receipt-corner--two" aria-hidden="true" />
            <p className="section-kicker">Vanilla Love Story</p>
            <h2 id="rsvp-title">
              {receipt.attendance === 'accepts' ? 'Your Place Is Reserved' : 'Your Response Is Received'}
            </h2>
            <p className="receipt-intro">This certifies that the response of</p>
            <strong className="receipt-guest">{receipt.guestName}</strong>

            <div className="receipt-rule" aria-hidden="true"><i /><span>✦</span><i /></div>

            <dl className="receipt-details">
              <div><dt>Celebration</dt><dd>Nwaamaka &amp; Nnaemeka</dd></div>
              <div><dt>Wedding day</dt><dd>{receipt.eventDate}</dd></div>
              <div><dt>Response</dt><dd>{receipt.attendance === 'accepts' ? 'Joyfully accepts' : 'Regretfully declines'}</dd></div>
              {receipt.attendance === 'accepts' && (
                <div><dt>Party size</dt><dd>{receipt.guestCount} {receipt.guestCount === 1 ? 'guest' : 'guests'}</dd></div>
              )}
              <div><dt>Receipt</dt><dd>{receipt.code}</dd></div>
            </dl>

            <div className={`receipt-seal${receipt.attendance === 'declines' ? ' receipt-seal--received' : ''}`} aria-label={receipt.attendance === 'accepts' ? 'Attendance confirmed' : 'Response received'}>
              <span>{receipt.attendance === 'accepts' ? 'Confirmed' : 'Received'}</span>
              <b>N<span>&amp;</span>N</b>
              <small>19 · 12 · 26</small>
            </div>

            <p className="receipt-note">
              {receipt.attendance === 'accepts'
                ? 'Please keep this keepsake as confirmation of your RSVP.'
                : 'Thank you for sending your warm wishes to the couple.'}
            </p>
            <div className="receipt-actions">
              <button type="button" onClick={() => window.print()}>Print or save receipt</button>
              <button type="button" onClick={onEdit}>Edit my response</button>
            </div>
          </article>
        ) : (
          <>
            <p className="section-kicker">Please Respond</p>
            <h2 id="rsvp-title">{editing ? 'Edit Your Attendance' : 'Confirm Your Attendance'}</h2>
            <form className="wedding-form" onSubmit={onSubmit}>
              <label>
                <span>Your full name</span>
                <input name="guestName" type="text" autoComplete="name" minLength={2} maxLength={100} defaultValue={draft?.guestName || ''} required autoFocus />
              </label>
              <fieldset>
                <legend>Will you be attending?</legend>
                <label><input name="attendance" type="radio" value="accepts" defaultChecked={draft?.attendance === 'accepts'} required /> Joyfully accepts</label>
                <label><input name="attendance" type="radio" value="declines" defaultChecked={draft?.attendance === 'declines'} required /> Regretfully declines</label>
              </fieldset>
              <label>
                <span>Number of guests</span>
                <select name="guestCount" defaultValue={String(draft?.guestCount || 1)}>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                </select>
              </label>
              <label>
                <span>Message for the couple (optional)</span>
                <textarea name="rsvpMessage" rows={3} maxLength={600} defaultValue={draft?.message || ''} />
              </label>
              <label className="rsvp-honeypot" aria-hidden="true">
                <span>Website</span>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
              {error && <p className="rsvp-form-error" role="alert">{error}</p>}
              <button type="submit" disabled={submitting}>
                {submitting
                  ? (editing ? 'Updating your receipt…' : 'Pressing the seal…')
                  : (editing ? 'Update my RSVP' : 'Confirm and receive receipt')}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
