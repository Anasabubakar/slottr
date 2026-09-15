Visit https://cal.com/docs/introduction/quick-start/self-hosting/installation#requirements for full instructions

## Production deployment: Vercel (web) + Render (Postgres)

Slottr runs at https://slottr.anasmasama.dev.

1. Provision Postgres on Render via `render.yaml` at the repo root (Blueprint
   deploy). This creates the `slottr-db` database only — web hosting is on
   Vercel, not Render.
2. Create a Vercel project linked to this repository with root directory
   `apps/web`, and set `slottr.anasmasama.dev` as its production domain.
3. Set the required environment variables on the Vercel project (see
   `.env.example` at the repo root) — `DATABASE_URL` / `DATABASE_DIRECT_URL`
   from the Render Postgres connection string, `NEXTAUTH_SECRET`,
   `CALENDSO_ENCRYPTION_KEY`, `NEXT_PUBLIC_WEBAPP_URL` /
   `NEXT_PUBLIC_WEBSITE_URL` / `NEXTAUTH_URL` set to
   `https://slottr.anasmasama.dev`, and the Google Calendar OAuth variables
   below. Do not commit real secrets.
4. Configure Google Calendar OAuth in Google Cloud Console (APIs & Services →
   Credentials), add `https://slottr.anasmasama.dev/api/auth/callback/google`
   as an authorized redirect URI, and set `GOOGLE_API_CREDENTIALS` and
   `GOOGLE_LOGIN_ENABLED=true`.
5. Deploy, then create a public event type, complete a test booking, and
   confirm the calendar event and email notifications arrive.

## API v2 (REST API) on Render — free tier

The public REST API (`apps/api/v2`, a NestJS service) is not part of the
Vercel web deployment above — it's a separate long-running Docker service,
provisioned via the same `render.yaml` Blueprint as `slottr-api-v2`. To keep
this at zero cost:

- The web service uses Render's **free** plan (sleeps after ~15 min of
  inactivity; the first request after sleeping takes a few seconds to wake up
  — fine for a personal/portfolio use case, not for production traffic).
- Redis is **not** provisioned on Render (no free tier there). Use
  [Upstash](https://upstash.com) instead — it has a free tier well within
  what this needs (low request volume, no persistence requirements beyond
  caching).

Steps:

1. Sign up free at upstash.com → create a Redis database (any nearby region)
   → copy its `rediss://...` connection string (use the TLS one).
2. In the Render dashboard, re-sync the Blueprint used for `slottr-db` so it
   picks up the new `slottr-api-v2` service from `render.yaml`, or create it
   via New → Blueprint pointing at this repo.
3. On the `slottr-api-v2` service, manually set three env vars in the Render
   dashboard (marked `sync: false` in render.yaml):
   - `REDIS_URL` — the Upstash connection string from step 1.
   - `NEXTAUTH_SECRET` — copy the exact value from the Vercel project's env vars.
   - `CALENDSO_ENCRYPTION_KEY` — copy the exact value from the Vercel project's env vars.
4. Deploy. Once live, note the public Render URL (e.g.
   `https://slottr-api-v2.onrender.com`) and update the `API_URL` env var to
   match it exactly, then redeploy.
5. Verify: `curl -H "Authorization: Bearer <your cal_ API key>" https://<render-url>/api/v2/me`
   should return your account JSON, not a 401/500. Generate an API key from
   the web app at Settings → Developer → API Keys first if you don't have one.
6. Optional, still free: point a custom subdomain (e.g. `api.anasmasama.dev`)
   at this Render service via Render's custom domain settings + a CNAME at
   your DNS provider, then update `API_URL` and `NEXT_PUBLIC_API_V2_URL` (on
   the Vercel web app) accordingly.

### Cron jobs on Vercel Hobby plan

Vercel's Hobby plan allows at most 2 cron jobs per project, running once per
day. `apps/web/vercel.json` is trimmed to the 2 daily cleanup crons
(`calendar-subscriptions-cleanup`, `tasks/cleanup`) to fit this limit. The
higher-frequency crons this app normally relies on — calendar subscription
refresh, task processing, credential refresh, selected-calendars sync, all
originally every 1-5 minutes — are disabled and **will not run** until you
upgrade to Vercel Pro and restore them (see git history for the original
`crons` array in this file).
