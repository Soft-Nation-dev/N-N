const lock = document.querySelector('#ledger-lock')
const content = document.querySelector('#ledger-content')
const unlockForm = document.querySelector('#unlock-form')
const unlockStatus = document.querySelector('#unlock-status')
const ledgerStatus = document.querySelector('#ledger-status')
const entries = document.querySelector('#ledger-entries')
const filters = document.querySelector('#ledger-filters')
let adminPassword = ''

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function fetchLedger() {
  const data = new FormData(filters)
  const params = new URLSearchParams()
  if (data.get('q')) params.set('q', data.get('q'))
  if (data.get('status')) params.set('status', data.get('status'))

  ledgerStatus.textContent = 'Turning the pages…'
  const response = await fetch(`/api/admin/rsvps?${params}`, {
    headers: { authorization: `Bearer ${adminPassword}` },
  })
  const payload = await response.json()

  if (!response.ok) throw new Error(payload.error || 'Unable to open the ledger.')

  document.querySelector('#total-responses').textContent = payload.totals.responses
  document.querySelector('#total-attending').textContent = payload.totals.attending
  document.querySelector('#total-guests').textContent = payload.totals.guests
  document.querySelector('#total-declined').textContent = payload.totals.declined

  if (!payload.rsvps.length) {
    entries.innerHTML = '<p class="empty-ledger">No responses match this page of the ledger.</p>'
  } else {
    entries.innerHTML = payload.rsvps.map((rsvp, index) => `
      <article class="ledger-entry">
        <span class="entry-number">${String(index + 1).padStart(2, '0')}</span>
        <div class="entry-copy">
          <h3>${escapeHtml(rsvp.guest_name)}</h3>
          <p>${rsvp.message ? `“${escapeHtml(rsvp.message)}”` : '<em>No message enclosed.</em>'}</p>
        </div>
        <div class="entry-meta">
          <span class="entry-status${rsvp.attendance === 'declines' ? ' is-declining' : ''}">
            ${rsvp.attendance === 'accepts' ? `Accepts · ${rsvp.guest_count} guest${rsvp.guest_count === 1 ? '' : 's'}` : 'Declines'}
          </span>
          <small>${escapeHtml(rsvp.receipt_code)} · ${formatDate(rsvp.created_at)}</small>
        </div>
      </article>
    `).join('')
  }
  ledgerStatus.textContent = `${payload.rsvps.length} response${payload.rsvps.length === 1 ? '' : 's'} shown.`
}

unlockForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  adminPassword = new FormData(unlockForm).get('password')
  unlockStatus.textContent = 'Unsealing…'
  try {
    await fetchLedger()
    lock.hidden = true
    content.hidden = false
    unlockForm.reset()
  } catch (error) {
    adminPassword = ''
    unlockStatus.textContent = error.message
  }
})

filters.addEventListener('submit', async (event) => {
  event.preventDefault()
  try { await fetchLedger() } catch (error) { ledgerStatus.textContent = error.message }
})

document.querySelector('#refresh-ledger').addEventListener('click', async () => {
  try { await fetchLedger() } catch (error) { ledgerStatus.textContent = error.message }
})
document.querySelector('#print-ledger').addEventListener('click', () => window.print())
document.querySelector('#seal-ledger').addEventListener('click', () => {
  adminPassword = ''
  entries.replaceChildren()
  content.hidden = true
  lock.hidden = false
  unlockStatus.textContent = ''
  document.querySelector('#admin-password').focus()
})
