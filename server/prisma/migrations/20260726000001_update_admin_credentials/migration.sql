-- UpdateAdminCredentials
UPDATE "Admin" 
SET 
  email = 'admin@company.com',
  password = '$2b$10$wa010UUO6yt1beK9k90B1.1ejtRkk0oKpJuhn.macnFtuuo1j0Eku'
WHERE email = 'admin@gmail.com';
