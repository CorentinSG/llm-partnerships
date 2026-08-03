# UK map and directory refresh design

## Goal

Repair the United Kingdom directory map and replace the incomplete UK dataset with the active LL.M. pathways documented in the August 2026 research spreadsheet. Preserve the site's current visual language, routes, filters, budget tooling, localization model, and all non-UK content.

## Confirmed problem

The production map is not merely low fidelity: its hand-authored polygon renders as a nearly invisible dark rectangle/triangle in both desktop and mobile views. It has no useful coastline stroke, and its four London/Dundee/Bristol markers float without a legible geographic reference. Nearby London points are displaced without leader lines, so their apparent positions are misleading.

## Approved map design

- Replace the hand-authored `data/uk.json` outline with an accurate, simplified, locally bundled UK GeoJSON. No map data is fetched at runtime.
- Fit the projection to the actual geometry and keep the country entirely visible at every supported breakpoint.
- Use the existing dark/light visual tokens, but give the land a clearly visible fill and coastline stroke with sufficient contrast.
- Remove decorative crosshair/grid lines that currently obscure the silhouette.
- Plot the five active origin universities at their real coordinates: Queen Mary University of London, King's College London, University of Greenwich, Middlesex University London, and University of Bristol.
- Resolve the four-point London collision with deterministic displaced display positions. Draw a leader line from every displaced marker to its true coordinate so geography remains honest.
- Keep marker selection connected to the existing result filters. Hover, keyboard focus, and tap/selection expose the institution name; no information depends on hover alone.
- Preserve zoom and pan, enlarge mobile touch targets, and keep reset/clear controls reachable without covering markers.

## Directory data

Publish six active pathways:

1. Queen Mary University of London to William & Mary Law School — Drapers' Company Scholarship LL.M.
2. King's College London to Georgetown Law — integrated LL.B./LL.M. dual degree.
3. King's College London / CTLS alumni to Georgetown Law — CTLS Alumni Scholarship.
4. University of Greenwich to Mitchell Hamline School of Law — LL.M. progression agreement.
5. Middlesex University London to Case Western Reserve University — LL.M. in U.S. and Global Legal Studies pathway.
6. University of Bristol to Cardozo School of Law — 50% LL.M. partnership award.

The Bristol record remains visible with an explicit evidence note: confirmed by the University of Bristol but not mirrored on a Cardozo partnership page. This is presented as a source limitation, not as proof that the arrangement is inactive.

Remove the Dundee exchange and Dundee/Pepperdine entries from the active LL.M. directory because they do not satisfy the UK-to-US LL.M. scope. Keep the expired Hull/American University agreement and all other JD-only, undergraduate-exchange, or US-to-UK arrangements out of the published active set.

## Content and comparison behavior

- Update the hero and result counts to six active pathways across five British universities.
- Preserve separate records where one university has materially different routes, costs, eligibility, or bar consequences.
- Surface exact scholarship coverage, published tuition/estimated cost, eligibility, deadlines, English tests, quotas, duration, credits, and official source links where the spreadsheet provides them.
- Distinguish fact, calculation, and inference. Calculated net tuition values are labelled as estimates.
- Make the Georgetown dual degree's New York Bar incompatibility prominent. Do not imply bar eligibility for any other pathway; use the existing legal-warning model.
- Update the budget selector and partnership comparison inputs to the new active records without changing the estimator's general calculation model.

## Localization

Update all UK-specific page copy, filters, map labels, pathway details, evidence warnings, and budget labels in French, English, Spanish, German, and Italian. Existing global translations and other country directories remain unchanged.

## Responsive and accessible behavior

- Verify the map and result flow at 320px, 360px, 390px, 768px, 1024px, 1440px, and 1680px.
- The map must never introduce horizontal overflow or place controls outside its card.
- Marker hit targets are at least 44px on touch layouts while their visible dots remain visually restrained.
- Selected and focused markers have a non-color-only state, a readable institution label, and a programmatic accessible name.
- Leader lines, labels, and controls remain legible in both themes and at browser zoom.

## Verification

- Add or update data tests for exactly six active pathways, five UK institutions, unique IDs/slugs, source URLs, and exclusion of the old Dundee/Hull records.
- Add translation coverage for all five locales.
- Add map assertions for valid UK geometry, all five markers, London leader lines, accessible names, and selected/filter behavior.
- Extend browser checks to desktop and 390px mobile, including map visibility, interaction, no horizontal overflow, and the updated result count.
- Run the complete UK verification suite, type checking, production build, and relevant global locale/navigation tests before publication.

## Publication

After verification, commit and push the scoped changes through the existing repository workflow, deploy to Vercel production, and inspect the live `/uk` page on desktop and mobile. No Google Sheet content is modified.
