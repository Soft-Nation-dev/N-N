CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY NOT NULL,
  receipt_code TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('accepts', 'declines')),
  guest_count INTEGER NOT NULL DEFAULT 0 CHECK (guest_count BETWEEN 0 AND 4),
  message TEXT NOT NULL DEFAULT '',
  client_fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rsvps_created_at
  ON rsvps(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rsvps_attendance
  ON rsvps(attendance);

CREATE INDEX IF NOT EXISTS idx_rsvps_fingerprint
  ON rsvps(client_fingerprint, created_at DESC);
