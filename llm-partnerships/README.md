# LL.M Partnerships Directory (MVP)

This is a standalone Next.js app that lists LL.M partnerships between French universities and foreign partner law schools.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style components (local components in `src/components/ui/`)
- lucide-react icons
- Recharts (small stats chart)
- Local data in `data/partnerships.json`

## Run locally

From this folder:

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Email submissions (Gmail)

The “Proposer une information” form can send submissions to your Gmail using Formspree (no backend required).

1) Create a Formspree form and set the recipient email to your Gmail.
2) Add this env var in Vercel (Project → Settings → Environment Variables) and locally if needed:

- `NEXT_PUBLIC_FORMSPREE_ENDPOINT` = `https://formspree.io/f/<yourFormId>`

## Google Analytics (GA4)

1) Create a GA4 property and get your Measurement ID (looks like `G-XXXXXXXXXX`).
2) Add it in Vercel (Project → Settings → Environment Variables):

- `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`

## Edit data

Update `data/database.json`. When a field is unknown, keep:

- `Non communiqué` (not communicated / not found)
- `reliabilityStatus`:
  - `confirmed`
  - `to_confirm`
  - `incomplete`

## Pages

- `/` homepage: map, filters, results
- `/partnership/[id]` detail page
- `/about`
- `/submit` frontend-only submission form (no backend yet)
