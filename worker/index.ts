const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
} as const

type Attendance = 'accepts' | 'declines'

interface RsvpSubmission {
  guestName?: unknown
  attendance?: unknown
  guestCount?: unknown
  message?: unknown
  website?: unknown
}

interface EditableRsvpRow extends RsvpRow {
  updated_at: string
}

interface RsvpRow {
  id: string
  receipt_code: string
  guest_name: string
  attendance: Attendance
  guest_count: number
  message: string
  created_at: string
}

function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  })
}

function allowedOrigins(env: Env) {
  return new Set(
    env.ALLOWED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('origin')
  if (!origin || !allowedOrigins(env).has(origin)) return {}

  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  }
}

function withCors(response: Response, request: Request, env: Env) {
  const next = new Response(response.body, response)
  for (const [name, value] of Object.entries(corsHeaders(request, env))) {
    next.headers.set(name, value)
  }
  return next
}

function cleanText(value: unknown, maximum: number) {
  if (typeof value !== 'string') return ''
  return Array.from(value)
    .map((character) => {
      const code = character.codePointAt(0) || 0
      return code < 32 || code === 127 ? ' ' : character
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximum)
}

function parseSubmission(input: RsvpSubmission) {
  const guestName = cleanText(input.guestName, 100)
  const attendance = input.attendance === 'accepts' || input.attendance === 'declines'
    ? input.attendance
    : null
  const parsedCount = Number(input.guestCount)
  const guestCount = attendance === 'accepts' && Number.isInteger(parsedCount)
    ? Math.min(4, Math.max(1, parsedCount))
    : 0
  const message = cleanText(input.message, 600)
  const website = cleanText(input.website, 120)

  if (website) return { error: 'Unable to record this response.' } as const
  if (guestName.length < 2) return { error: 'Please enter your full name.' } as const
  if (!attendance) return { error: 'Please select whether you will attend.' } as const

  return { guestName, attendance, guestCount, message } as const
}

async function digest(value: string) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function digestHex(value: string) {
  return bytesToHex(new Uint8Array(await digest(value)))
}

async function secretsMatch(provided: string, expected: string) {
  const [providedHash, expectedHash] = await Promise.all([digest(provided), digest(expected)])
  const providedBytes = new Uint8Array(providedHash)
  const expectedBytes = new Uint8Array(expectedHash)
  let difference = providedBytes.length ^ expectedBytes.length

  for (let index = 0; index < expectedBytes.length; index += 1) {
    difference |= expectedBytes[index] ^ (providedBytes[index] || 0)
  }
  return difference === 0
}

async function isAdmin(request: Request, env: Env) {
  const authorization = request.headers.get('authorization') || ''
  if (!authorization.startsWith('Bearer ')) return false
  return secretsMatch(authorization.slice(7), env.ADMIN_PASSWORD)
}

async function fingerprint(request: Request, env: Env) {
  const address = request.headers.get('cf-connecting-ip') || 'local'
  const day = new Date().toISOString().slice(0, 10)
  const hash = await digest(`${env.RSVP_HASH_SALT}|${day}|${address}`)
  return bytesToHex(new Uint8Array(hash))
}

function receiptCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  const code = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
  return `VLS-${code.slice(0, 4)}-${code.slice(4)}`
}

function editToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(24)))
}

function receiptFromRow(row: EditableRsvpRow, token: string) {
  return {
    code: row.receipt_code,
    guestName: row.guest_name,
    attendance: row.attendance,
    guestCount: row.guest_count,
    message: row.message,
    submittedAt: row.created_at,
    updatedAt: row.updated_at,
    eventDate: '19 December 2026',
    editToken: token,
  }
}

async function createRsvp(request: Request, env: Env) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 16_384) return json({ error: 'This response is too large.' }, 413)
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ error: 'Please submit the RSVP form.' }, 415)
  }

  let input: RsvpSubmission
  try {
    input = await request.json<RsvpSubmission>()
  } catch {
    return json({ error: 'The RSVP response could not be read.' }, 400)
  }

  const submission = parseSubmission(input)
  if ('error' in submission) return json({ error: submission.error }, 400)

  const clientFingerprint = await fingerprint(request, env)
  const recent = await env.DB.prepare(
    `SELECT COUNT(*) AS count
       FROM rsvps
      WHERE client_fingerprint = ?
        AND datetime(created_at) >= datetime('now', '-15 minutes')`,
  ).bind(clientFingerprint).first<{ count: number }>()

  if ((recent?.count || 0) >= 5) {
    return json({ error: 'Please wait a little before submitting another RSVP.' }, 429)
  }

  const id = crypto.randomUUID()
  const code = receiptCode()
  const token = editToken()
  const tokenHash = await digestHex(token)
  const now = new Date().toISOString()

  await env.DB.prepare(
    `INSERT INTO rsvps
      (id, receipt_code, guest_name, attendance, guest_count, message, client_fingerprint, edit_token_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    id,
    code,
    submission.guestName,
    submission.attendance,
    submission.guestCount,
    submission.message,
    clientFingerprint,
    tokenHash,
    now,
    now,
  ).run()

  return json({
    receipt: {
      code,
      guestName: submission.guestName,
      attendance: submission.attendance,
      guestCount: submission.guestCount,
      message: submission.message,
      submittedAt: now,
      updatedAt: now,
      eventDate: '19 December 2026',
      editToken: token,
    },
  }, 201)
}

async function updateRsvp(request: Request, env: Env, code: string) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 16_384) return json({ error: 'This response is too large.' }, 413)
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ error: 'Please submit the RSVP form.' }, 415)
  }

  const authorization = request.headers.get('authorization') || ''
  if (!authorization.startsWith('Bearer ')) {
    return json({ error: 'This receipt can no longer be edited from this device.' }, 401)
  }

  let input: RsvpSubmission
  try {
    input = await request.json<RsvpSubmission>()
  } catch {
    return json({ error: 'The RSVP response could not be read.' }, 400)
  }

  const submission = parseSubmission(input)
  if ('error' in submission) return json({ error: submission.error }, 400)

  const token = authorization.slice(7)
  const tokenHash = await digestHex(token)
  const now = new Date().toISOString()
  const result = await env.DB.prepare(
    `UPDATE rsvps
        SET guest_name = ?, attendance = ?, guest_count = ?, message = ?, updated_at = ?
      WHERE receipt_code = ? AND edit_token_hash = ?`,
  ).bind(
    submission.guestName,
    submission.attendance,
    submission.guestCount,
    submission.message,
    now,
    code,
    tokenHash,
  ).run()

  if (!result.meta.changes) {
    return json({ error: 'We could not verify this receipt for editing.' }, 403)
  }

  const row = await env.DB.prepare(
    `SELECT receipt_code, guest_name, attendance, guest_count, message, created_at, updated_at
       FROM rsvps
      WHERE receipt_code = ?`,
  ).bind(code).first<EditableRsvpRow>()

  if (!row) return json({ error: 'This RSVP could not be found.' }, 404)
  return json({ receipt: receiptFromRow(row, token) })
}

async function listRsvps(request: Request, env: Env) {
  if (!(await isAdmin(request, env))) {
    return json({ error: 'The guest ledger is sealed. Please enter the admin passphrase.' }, 401, {
      'www-authenticate': 'Bearer',
    })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const query = cleanText(url.searchParams.get('q'), 80)
  const limit = Math.min(250, Math.max(1, Number(url.searchParams.get('limit')) || 250))
  const clauses: string[] = []
  const bindings: Array<string | number> = []

  if (status === 'accepts' || status === 'declines') {
    clauses.push('attendance = ?')
    bindings.push(status)
  }
  if (query) {
    clauses.push('(guest_name LIKE ? OR receipt_code LIKE ? OR message LIKE ?)')
    const search = `%${query}%`
    bindings.push(search, search, search)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const statement = env.DB.prepare(
    `SELECT id, receipt_code, guest_name, attendance, guest_count, message, created_at
       FROM rsvps
       ${where}
      ORDER BY datetime(created_at) DESC
      LIMIT ?`,
  ).bind(...bindings, limit)

  const [rows, totals] = await Promise.all([
    statement.all<RsvpRow>(),
    env.DB.prepare(
      `SELECT
         COUNT(*) AS responses,
         COALESCE(SUM(CASE WHEN attendance = 'accepts' THEN 1 ELSE 0 END), 0) AS attending,
         COALESCE(SUM(CASE WHEN attendance = 'declines' THEN 1 ELSE 0 END), 0) AS declined,
         COALESCE(SUM(CASE WHEN attendance = 'accepts' THEN guest_count ELSE 0 END), 0) AS guests
       FROM rsvps`,
    ).first(),
  ])

  return json({ rsvps: rows.results, totals })
}

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin')
    if (origin && !allowedOrigins(env).has(origin)) return new Response(null, { status: 403 })
    return new Response(null, { status: 204, headers: corsHeaders(request, env) })
  }

  if (url.pathname === '/api/health' && request.method === 'GET') {
    return json({ ok: true, service: 'Vanilla Love RSVP' })
  }
  if (url.pathname === '/api/rsvps' && request.method === 'POST') {
    return createRsvp(request, env)
  }
  const receiptMatch = url.pathname.match(/^\/api\/rsvps\/(VLS-[A-F0-9]{4}-[A-F0-9]{4})$/)
  if (receiptMatch && request.method === 'PUT') {
    return updateRsvp(request, env, receiptMatch[1])
  }
  if (url.pathname === '/api/admin/rsvps' && request.method === 'GET') {
    return listRsvps(request, env)
  }

  return json({ error: 'Not found.' }, 404)
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      const url = new URL(request.url)
      if (url.pathname.startsWith('/api/')) {
        return withCors(await handleApi(request, env), request, env)
      }
      return env.ASSETS.fetch(request)
    } catch (error) {
      console.error(JSON.stringify({
        event: 'rsvp_worker_error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }))
      return withCors(json({ error: 'The RSVP ledger is temporarily unavailable.' }, 500), request, env)
    }
  },
} satisfies ExportedHandler<Env>
