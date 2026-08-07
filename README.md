# Company Project — Admin Dashboard + Backend

This zip contains **only** the two new projects requested:

```
company-project/
├── admin/    ← React + Vite + TS admin dashboard (NEW)
├── server/   ← Node.js + Express + Prisma backend (NEW)
└── README.md
```

Your existing `web/` project is **not included** — it wasn't uploaded to this
conversation, so nothing in it was touched. See "Connecting to `web/`" below
for the exact integration steps to run in your own `web/` folder.

---

## 1. Backend (`server/`)

### Setup

```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, Cloudinary keys
npx prisma migrate dev --name init
npm run prisma:seed    # creates one admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
npm run dev             # starts on http://localhost:5000
```

### API routes actually implemented

**Auth**
| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/login` | — |
| POST | `/api/auth/logout` | JWT |
| GET | `/api/auth/me` | JWT |

**Public (consumed by `web/`)** — always returns `published: true` members only
| Method | Path | Auth |
|---|---|---|
| GET | `/api/members` | — |
| GET | `/api/members/:id` | — |

**Admin (consumed by `admin/`)** — full CRUD, JWT-protected
| Method | Path | Auth |
|---|---|---|
| GET | `/api/members/admin/all` | JWT |
| GET | `/api/members/admin/:id` | JWT |
| POST | `/api/members/admin` | JWT |
| PUT | `/api/members/admin/:id` | JWT |
| DELETE | `/api/members/admin/:id` | JWT |
| PATCH | `/api/members/admin/:id/publish` | JWT |
| PATCH | `/api/members/admin/:id/unpublish` | JWT |
| POST | `/api/members/admin/:id/photo` (multipart, field name `photo`) | JWT |

**Note on the routes:** your original spec listed one shared `GET/POST/PUT/DELETE /api/members` set for everything. In practice the public site and the admin dashboard need different data (public = published-only, minimal fields; admin = everything, including drafts), so the admin operations were namespaced under `/api/members/admin/...` rather than overloading the same path with different auth/behavior. Nothing outside of Member CRUD + auth was added.

### Member fields (exactly as specified)
`fullName`, `passportNumber`, `jobPosition`, `photoUrl`, `published`, timestamps.
No phone number or home address field exists anywhere in the schema.

---

## 2. Admin Dashboard (`admin/`)

### Setup

```bash
cd admin
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev              # starts on http://localhost:5174
```

Log in with the email/password you set in `server/.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

### What's built
- `/login` — JWT login form (React Hook Form + Zod)
- `/` — dashboard with published/unpublished counts
- `/members` — search, filter (all/published/unpublished), publish/unpublish, delete (with confirm modal), edit
- `/members/new`, `/members/:id/edit` — create/edit form + photo uploader (uploads straight to Cloudinary via the backend)
- All dashboard routes are wrapped in `ProtectedRoute` — an unauthenticated visitor is redirected to `/login` and never sees dashboard markup.

---

## 3. Connecting to your existing `web/`

Nothing in `web/`'s design changes. You only need to:

1. Install axios in `web/`: `npm install axios`
2. Add an env var, e.g. `VITE_API_BASE_URL=http://localhost:5000/api` to `web/.env`
3. On your home page, replace the hardcoded member array with a fetch to `GET /api/members`, and render the existing member card markup you already have — just map over the API response instead of static data. Each returned member has: `id`, `fullName`, `passportNumber`, `jobPosition`, `photoUrl`.
4. For the photo, use `<img src={member.photoUrl} className="h-16 w-16 rounded-full object-cover border-2 border-green-600" />` (or your existing Tailwind classes) — circular photo with a green border, placed above the footer, per your spec.
5. Add the "Approved" badge (green) next to each member — since the public endpoint only ever returns `published: true` members, every member returned is by definition approved.
6. Clicking a card can route to `/members/:id` in your `web/` router, calling `GET /api/members/:id` for the profile page.

I did not touch or generate any `web/` files since none were uploaded to this conversation — send them over (zip preferred) and I'll write the exact integration diff against your real components in the next step.

---

## 4. Deployment

| App | URL | Notes |
|---|---|---|
| `web/` | `https://company.com` | Static build, calls `api.company.com` |
| `admin/` | `https://admin.company.com` | Static build, calls `api.company.com`, protected by JWT client-side |
| `server/` | `https://api.company.com` | Node process; set `CORS_ORIGIN_ADMIN` and `CORS_ORIGIN_WEB` to the two production origins above so the browser allows both frontends and nothing else |

All three communicate only over HTTPS via the REST API — no shared code or direct DB access from either frontend. Set `DATABASE_URL` to your production Postgres instance and run `npx prisma migrate deploy` (not `migrate dev`) as part of your deploy step.
