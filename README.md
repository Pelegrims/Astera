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

### How birth time is handled (and the USSR-era "1 hour off" fix)

The city autocomplete resolves an IANA timezone, and `offsetForDate()`
(`lib/city-timezone.ts`) returns the exact historical UTC offset for the
birth moment — including Soviet decree time and seasonal DST, straight
from the IANA tz database. Offsets are minute-accurate (India +5:30 stays
+5:30; it used to round to +6).

BaZi pillars are then computed from **mean local solar time**, not the
clock: `solar = clock − utcOffset + longitude×4min` (see
`meanSolarMoment()` in `lib/bazi.ts`). This is the convention Julia's
reference calculator (feng-shui.ua) uses, and it's what resolved the
1-hour discrepancy she caught on USSR-era dates. Verified against the
reference's own rendered output for Kyiv, 1989-05-19: clock 20:00 at
UTC+4 (decree +1 and DST +1 over base UTC+2) → solar **18:02** → pillars
己巳 / 己巳 / 己卯 / **癸酉** — exact match. The old code fed raw clock
time in, which put 20:00 into the 戌 hour (19–21) instead of the correct
酉 (17–19 solar). The UI now prints the solar time it used under the
pillars, so any chart can be checked against a reference at a glance.

The **Western astrology** chart deliberately does *not* use solar time —
natal charts are computed from civil time converted to UT, which
`circular-natal-horoscope-js` handles internally from the coordinates.
The two systems using different time frames is correct, not a bug.

### Full classical chart layout

`BaziChart` now renders the complete classical picture, modeled on the
reference calculator's layout: the **Day Master front and center** (a hero
glyph above the table — it's the figure every other symbol is read
against), then the four pillars in reference column order (Hour · Day ·
Month · Year), each with its Ten God, stem, branch (with animal +
element), **hidden stems with their own Ten Gods**, and the **Qi phase**
(12-stage cycle) — the latter two via lunar-javascript's
`get*ShiShenZhi()` / `get*DiShi()`, wrapped in safe calls so a missing
method degrades to a chart without that layer instead of a crash.

**Symbolic stars** (deities / spirits &amp; demons) live in
`lib/bazi-stars.ts` — pure classical table lookups (Nobleman, Peach
Blossom, Sky Horse, Arts Star, General Star, Golden Carriage, Academic
Star, Heavenly Doctor, Robbery Demon, Void/空亡) anchored to the day
stem/branch, year stem/branch, and month branch, marked (d)/(y)/(m) like
the reference marks (д)/(г). The tables are verified in code review
against the reference's rendered side panel for two known charts — see
the file header. **Число Гуа (Life Gua) is deliberately not included**:
several schools compute it differently, waiting on Julia's preferred
formula. The free Thank-You preview shows the full pillar chart but keeps
the 10-year luck cycles out — those stay part of the paid Extended
Reading pitch.

**Transit pillars ("Current Energies")** live below the natal chart on
`/bazi`: the pillars of any selected moment — defaulting to right now in
the birth city's clock — with year/month/day/hour dropdowns and a "Back
to now" reset. Everything in them (Ten Gods, hidden-stem gods, Qi
phases, activated stars) is read **relative to the natal Day Master and
natal star anchors**, which is how classical BaZi reads transits and how
the reference's selectable year/month columns behave. To keep natal and
transit mathematically inseparable, the Ten God and Qi-phase logic now
lives in pure table functions (`tenGodOf`, `qiPhaseOf` in `lib/bazi.ts`)
shared by both paths — verified against the reference's rendered labels
(Day Master 辛: 丙 = Direct Officer / Правильная власть, 庚 = Rob
Wealth, phase at 午 = Illness, at 寅 = Conception). lunar-javascript now
supplies only the ganzhi themselves, hidden-stem lists, and luck
pillars.

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
     "utcOffset" numeric not null,
     focus text not null,
     consent boolean not null default false,
     status text not null default 'new',
     "createdAt" timestamptz not null default now(),
     report jsonb not null default '{}'::jsonb
   );
   ```

   If the table was already created earlier with `"utcOffset" integer`,
   run this once in the Supabase SQL editor (offsets are now
   minute-accurate, so half-hour zones like India +5.5 need a numeric
   column — inserting 5.5 into an integer column fails):

   ```sql
   alter table requests alter column "utcOffset" type numeric using "utcOffset"::numeric;
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

## Setting up Paddle checkout ("Get my extended reading")

The upsell button after the free BaZi preview opens a real Paddle checkout
overlay via `@paddle/paddle-js` (see `components/ui/PaddleCheckoutButton.tsx`).

**One-time setup, per environment (sandbox first, then live later):**

1. In Paddle, go to **Developer tools → Authentication** and create a
   client-side token (starts with `test_` in sandbox, `live_` in production).
2. In Paddle, go to **Catalog → Products**, open (or create) the Extended
   Reading product, and copy its Price ID (starts with `pri_`).
3. In Paddle, go to **Checkout → Checkout settings** and set a default
   payment link (your site's URL) — checkout will fail with "Something
   went wrong" without this.
4. In Vercel → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` — the token from step 1
   - `NEXT_PUBLIC_PADDLE_PRICE_ID` — the price ID from step 2
   - `NEXT_PUBLIC_PADDLE_ENVIRONMENT` — `sandbox` for now
5. Redeploy.

**Going live later:** repeat steps 1–2 in your live Paddle account (not
sandbox), update the three env vars in Vercel with the new `live_` token,
new price ID, and `NEXT_PUBLIC_PADDLE_ENVIRONMENT=production`, then redeploy.
No code changes needed — this is purely a config swap.

## Multi-system calculator (`/bazi`) — now 3 systems in one form

The calculator now computes three readings from one birth date/time/city
entry: **Western astrology**, **BaZi**, and **Matrix of Destiny**.

**Western astrology** (`lib/astrology.ts`) uses
[`circular-natal-horoscope-js`](https://github.com/0xStarcat/CircularNatalHoroscopeJS)
(Unlicense) — a real astronomical ephemeris (Moshier), not an
approximation. Computes planet signs, exact degrees, house placement
(Placidus system), and aspects with a 2° orb, as requested. The 12
**Placidus house cusps** are now surfaced in the result (`houses`), each
with the sign on the cusp (deg°min′ precision, so cusps can be compared
digit-for-digit against astro-seek.com, whose default is also Placidus)
and that sign's **ruling planet(s)** — Julia's scheme: modern ruler
first, traditional co-ruler second (Scorpio → Pluto, Mars; Aquarius →
Uranus, Saturn; Pisces → Neptune, Jupiter). Each planet also carries the
inverse view (`rulesHouses`) — every house it rules in this specific
chart — and the UI's houses table shows where each house's ruler itself
sits ("2nd — Virgo 15°32′ — Mercury → H5"). Like the BaZi
integration, **this hasn't been run end-to-end here** (no network access
in this environment to `npm install` and test it) — before trusting it
for real clients, run it locally and check a chart you already know the
correct planets/houses for.

**Matrix of Destiny** (`lib/matrix-of-destiny.ts`) is **our own
implementation** of the commonly-circulated public digit-sum method
(reduce any number above 22 by summing its digits). Different
popularizers of this system have their own trademarked diagrams and
sometimes slightly different point layouts and interpretive labels — what's
here is a reasonable, original rendering of the public method, not a copy
of any specific practitioner's branded version. If Julia has a preferred
exact method/labels, this can be adjusted to match.

**Explicitly left out:** ХВД (chrono-vector diagnostics) / chakra
analysis — per Mark, this is Julia's own closed methodology, so it isn't
something to approximate or fabricate a formula for. If she shares her
actual calculation method later, it can be added the same way BaZi and
astrology were.
