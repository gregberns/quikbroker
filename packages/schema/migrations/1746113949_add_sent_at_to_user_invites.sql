-- Up Migration

-- Add a 'sent_at' field to track when the invite email was sent
ALTER TABLE app.user_invites ADD COLUMN sent_at TIMESTAMP;