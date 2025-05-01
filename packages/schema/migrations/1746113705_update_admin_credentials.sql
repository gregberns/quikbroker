-- Up Migration

-- Update the admin user with a more secure password
UPDATE app.users 
SET password_hash = '$2b$10$Y37HbHTUkJPUvHTIyhfM4ubD2PRdUG3bNtPY/zPDFPb2Coi.Ia.f2' 
WHERE email = 'admin@quikbroker.com';

-- If there's no admin user yet, create one
INSERT INTO app.users (email, password_hash, role)
SELECT 'admin@quikbroker.com', '$2b$10$Y37HbHTUkJPUvHTIyhfM4ubD2PRdUG3bNtPY/zPDFPb2Coi.Ia.f2', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM app.users WHERE email = 'admin@quikbroker.com');

-- Create an .env file variable note for reference
-- JWT_SECRET should also be set in the environment