-- SeedAdmin
INSERT INTO "Admin" ("id", "email", "password", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@company.com',
  '$2b$10$wa010UUO6yt1beK9k90B1.1ejtRkk0oKpJuhn.macnFtuuo1j0Eku',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;
