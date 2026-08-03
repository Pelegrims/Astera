# Astera — Astrology Report MVP

A calm, premium wellness-styled MVP for selling personal astrology reports.
Next.js 14 (App Router) + TypeScript + Tailwind. No database required to run —
everything works against in-memory mock data out of the box.

## Client journey

```
Facebook/Instagram Ad → Landing (/) → Quiz (/quiz) → Thank you (/thank-you)
        ↓
Astrologer opens Admin (/admin) → writes report (/admin/[id]) → Mark as Ready
        ↓
Client opens their private link (/report/[id])
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Visit `/admin` to see the astrologer's side —
it's linked from nowhere in the client-facing UI on purpose (it's an
internal tool), so bookmark it directly.

Deploys to Vercel with zero configuration — just connect the repo.

## Project structure

```
app/
  page.tsx                landing page
  quiz/page.tsx            quiz page (renders QuizForm)
  thank-you/page.tsx        waiting page after submission
  admin/page.tsx            admin dashboard — list of requests
  admin/[id]/page.tsx        report editor for one request
  report/[id]/page.tsx       public report the client receives
  actions.ts               server actions: submitQuiz, saveReport, markAsReady...

components/
  ui/                      Button, Card, Container, Badge, OrbitDivider
  landing/                 Hero, HowItWorks, TrustStrip, FinalCta, Footer
  quiz/QuizForm.tsx         multi-step quiz, single form submitted once
  admin/                   RequestsTable, ReportEditor
  report/ReportSection.tsx  one section of the public report

lib/
  types.ts                 ClientRequest, ReportSections, FocusArea, etc.
  mock-data.ts              seed data — 4 example requests in different states
  store.ts                  data access layer (in-memory now, swap for Supabase later)
```

Everything reads and writes through `lib/store.ts`. No component talks to
mock data or a database directly — that's what makes swapping the backend
later a small, contained change instead of a rewrite.

## Connecting a real database (Supabase)

The in-memory store resets on every deploy/restart, which is fine for demoing
the flow but not for production. To switch to Supabase:

1. `npm install @supabase/supabase-js`
2. In Supabase, create one `requests` table:

   | column         | type                                  |
   |----------------|---------------------------------------|
   | id             | text, primary key                     |
   | first_name     | text                                   |
   | email          | text                                   |
   | phone          | text, nullable                         |
   | birth_date     | text                                   |
   | birth_time     | text, nullable                         |
   | birth_location | text                                   |
   | focus          | text                                   |
   | consent        | boolean                                |
   | status         | text                                   |
   | created_at     | timestamptz, default now()             |
   | report         | jsonb (stores the whole ReportSections)|

3. Add `lib/supabase.ts`:

   ```ts
   import { createClient } from "@supabase/supabase-js";
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );
   ```

4. Rewrite the function bodies in `lib/store.ts` to call `supabase.from("requests")...`
   instead of touching the in-memory array. The exported function signatures
   stay identical, so nothing in `app/` or `components/` needs to change.
5. Add the two env vars from step 3 to Vercel's project settings.

## Adding real auth to /admin

There's no login on `/admin` yet — it's left out on purpose to keep the MVP
simple. Before sending real client data through this, add either:
- Supabase Auth with a middleware check on `/admin/*`, or
- a simple shared password gate via Next.js middleware, as a stopgap.

## Design notes

- Dark, warm palette (deep charcoal-navy background, muted gold and dusty
  plum accents) — deliberately avoiding both "mystical purple/stars" clichés
  and generic SaaS blue.
- Palette: pearl/petal light base with deep jewel-tone accents — Iris Bloom
  (primary accent), Lavender Mist (soft accent), Aubergine and Burgundy
  (rare signature accents, used mainly in the dark hero/CTA blocks). All
  colors are Tailwind tokens in `tailwind.config.ts`, so retheming again
  later means editing one file, not every component.
- Typeface pairing: Bodoni Moda (display, high-contrast editorial serif,
  used sparingly with italics for warmth) + Inter (body/UI) + IBM Plex Mono
  (data — birth dates, timestamps, step counters).
- The hero and final CTA use a bold dark gradient block (burgundy → aubergine
  → iris) against an otherwise light page — contrast between sections
  rather than one flat palette throughout.
- The recurring thin arc (`OrbitDivider`) is the one signature motif — it
  stands in for "astrology" without a single star or moon icon anywhere in
  the product.
- Mobile-first throughout; the quiz in particular is designed to be answered
  comfortably with one thumb.

## Free BaZi chart calculator (`/bazi`)

A public, free lead-magnet tool — visitors enter their birth details and get
an instant Four Pillars (BaZi) chart: pillars, Day Master, five-element
balance, and 10-year luck cycles. Ends with a CTA into the main quiz.

Uses [`lunar-javascript`](https://github.com/6tail/lunar-javascript) (MIT)
for the actual calendar/pillar math — the same engine professional BaZi
tools use, so we don't reimplement Chinese solar-term calendar astronomy
ourselves.

**Before this goes live for real users:** run `npm install`, then test
`calculateBazi()` in `lib/bazi.ts` against a few birth dates you already
know the correct chart for. This code was written against the library's
documented API but hasn't been executed end-to-end yet — if any method
name doesn't match what actually installs, check
`node_modules/lunar-javascript`'s README for the current `EightChar` API.

The timezone field is a manual UTC-offset dropdown rather than automatic
city-based historical timezone detection (the reference tool this was
modeled on does this automatically, including historical DST/Soviet-era
clock changes) — that's a meaningfully more complex feature to get right
and verify, left for a second pass once the core calculator is confirmed
accurate.

## Setting up Supabase (real, persistent storage)

The app now reads/writes through Supabase instead of an in-memory array —
this was the missing piece before testing with real users or ads, since
in-memory data doesn't reliably survive across serverless invocations on
Vercel.

**One-time setup:**

1. Go to [supabase.com](https://supabase.com), sign up (free tier is
   enough for an MVP), and create a new project.
2. In the Supabase dashboard, go to the **SQL Editor** and run:

   ```sql
   create table requests (
     id text primary key,
     "firstName" text not null,
     email text not null,
     phone text,
     "birthDate" text not null,
     "birthTime" text,
     "birthLocation" text not null,
     gender text not null,
     "utcOffset" integer not null,
     focus text not null,
     consent boolean not null default false,
     status text not null default 'new',
     "createdAt" timestamptz not null default now(),
     report jsonb not null default '{}'::jsonb
   );
   ```

3. In the Supabase dashboard, go to **Project Settings → API** and copy:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (not the `anon` key — this one bypasses row
     security and must stay server-only) → this is `SUPABASE_SERVICE_ROLE_KEY`
4. In Vercel, go to your project → **Settings → Environment Variables**,
   and add both of those.
5. Redeploy (Vercel → Deployments → Redeploy on the latest one) so the new
   env vars take effect.

`lib/mock-data.ts` is no longer used by the live app — it's kept only as a
reference for the exact shape of a request record. The admin dashboard and
Thank You page will now show real, persistent submissions.
