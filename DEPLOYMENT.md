Deployment guide

Overview
- Backend: Render (Node.js + PostgreSQL)
- Frontends: Vercel (web and admin)

Prerequisites
- GitHub repo connected to Vercel and Render
- Render account with a PostgreSQL database or external Postgres URL
- Vercel account

1) Backend (Render)

A. Provision Postgres on Render
- In Render, create a new PostgreSQL database.
- Copy the database URL (DATABASE_URL).

B. Create a new Web Service on Render
- Environment: Node
- Build Command: npm ci && npm run build
- Start Command: npm start
- Root: `server` (point Render to the `server` folder repo path)
- Add the following Environment variables (Render Dashboard > Environment > Add):
  - `DATABASE_URL` = (your Render Postgres URL)
  - `JWT_SECRET` = (strong secret)
  - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` (optional)
  - `CORS_ORIGIN_ADMIN` = https://<your-admin-vercel-url>
  - `CORS_ORIGIN_WEB` = https://<your-web-vercel-url>

C. Deployment hooks
- The `postinstall` script in `server/package.json` runs `prisma generate` automatically during install.
- After the service is deployed, run migrations once on Render (shell or a Deploy Hook) with:

  npx prisma migrate deploy --schema=./prisma/schema.prisma

Or add `npx prisma migrate deploy` as a build step if you prefer automatic migration. Note: automatic destructive migrations must be handled carefully.

2) Frontend (Vercel) — `web` and `admin`

A. Create two Vercel projects connected to the same repo and point each to the matching folder:
- Project 1: `web` → Root Directory: `web`
- Project 2: `admin` → Root Directory: `admin`

B. Set Environment Variables in each Vercel project
- `VITE_API_BASE_URL` = https://<your-backend-render-url>

C. Build & Output
- Vercel will run `npm i` and `npm run build` by default in each folder. The `web` and `admin` packages already have `build` scripts configured.

3) CORS
- Ensure `CORS_ORIGIN_ADMIN` and `CORS_ORIGIN_WEB` on the server match the deployed Vercel URLs. These are read by `server/src/config/env.ts`.

4) Verify end-to-end
- Deploy backend first, then deploy frontends.
- Open `https://<web>.vercel.app` and verify the members list loads.
- Open the admin site, create a member, publish it, then confirm it appears on the public site.

Local test commands

# Build server and generate prisma client
cd server
npm ci
npx prisma generate
npm run build

# Start server locally (dev)
npm run dev

# Build frontends
cd web
npm ci
npm run build

cd admin
npm ci
npm run build

Tips
- If Prisma client generation fails on Windows with file locks, stop any running Node processes and re-run `npx prisma generate`.
- For zero-downtime, run migrations using `prisma migrate deploy` on each deploy and do not include `prisma migrate dev` in production.

Questions?
- Tell me whether you want me to create Render and Vercel deployment templates (YAML) or CI workflows (GitHub Actions).