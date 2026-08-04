# Italy–United States Directory Refresh Design

## Goal

Replace the original 12-record Italy baseline with the current, more complete research supplied in Google Sheets while preserving the existing `/italy` experience and every other country directory.

## Publication rule

- Publish every active or probably active pathway with reliability 4 or 5.
- Keep `LUISS–Temple` and `LUISS–Suffolk` visible as `to_confirm` because 2026–2027 approval is still pending.
- Exclude expired or reliability 2–3 records from the active directory.
- Remove the expired Roma Tre–Cardozo record.
- Split the aggregated UC Law San Francisco row into Bologna and Roma Tre cards, both visibly qualified because the evidence is one-sided; Bologna also carries the faculty-scope warning.

This produces 22 public route cards across 11 Italian institutions from 21 qualified spreadsheet rows.

## Data and interface

The current schema, filters, maps, cards, detail pages, cost simulator, navigation, and styling remain unchanged. Records receive current tuition, fees, discounts, language thresholds, eligibility, deadlines, seat counts, bar-exam cautions, source notes, and official URLs. The Italy hero states the new route and institution counts, and an always-visible application notice highlights pending approvals, non-guaranteed bar eligibility, and the Delaware exclusion.

## Localization and evidence

All newly displayed values are available in French, English, Spanish, German, and Italian. Official university and program names remain unchanged. Bar-exam language is always attributed to the publishing institution and never presented as an individual eligibility guarantee.

## Verification

Data tests enforce the 22-route/11-institution contract, excluded IDs, qualified statuses, official links, and representative financial/bar claims. Translation, integration, simulator, mobile, TypeScript, production build, Git push, and Vercel production checks must all pass.
