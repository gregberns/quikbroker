-- Add an admin user with password "admin123"
INSERT INTO app.users (email, password_hash, role)
VALUES ('admin@quikbroker.com', '$2b$10$W0LphVObp71mDs/wS4jY7.6jFMB76Og793d9kYlSKaIRg1JQd3nyu', 'admin')
ON CONFLICT (email) DO NOTHING;
