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
