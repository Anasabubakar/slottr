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
