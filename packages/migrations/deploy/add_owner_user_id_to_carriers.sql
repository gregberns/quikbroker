-- Add owner_user_id column to carriers table to link carriers to users
-- This makes carriers work similarly to brokers

ALTER TABLE app.carriers 
ADD COLUMN owner_user_id INTEGER REFERENCES app.users(id);