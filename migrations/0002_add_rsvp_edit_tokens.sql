ALTER TABLE rsvps ADD COLUMN edit_token_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_rsvps_edit_token_hash
  ON rsvps(edit_token_hash);
