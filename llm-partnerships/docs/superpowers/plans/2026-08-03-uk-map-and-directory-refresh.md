# UK Map and Directory Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish six current UK-to-US LL.M. pathways and replace the broken UK map with an accurate, legible, responsive, accessible map.

**Architecture:** Keep `data/uk-database.json` as the canonical French dataset and `data/uk-translations.json` as the exact-value localization dictionary consumed by the existing UK adapter. Replace only the UK GeoJSON and map renderer, using a locally bundled simplified Natural Earth geometry plus deterministic London marker offsets and leader lines. Preserve the shared cards, filters, US map, cost simulator, header, routes, and detail-page infrastructure.

**Tech Stack:** Next.js 16, React 19, TypeScript, d3-geo, Tailwind CSS, Node assertion scripts, Playwright.

## Global Constraints

- Preserve every non-UK directory and all unrelated navigation.
- Publish exactly six active pathways across exactly five British universities.
- Keep Bristol visible with the evidence limitation “confirmed by Bristol, not mirrored by Cardozo”.
- Remove Dundee and Hull from the active UK LL.M. directory.
- Bundle map geometry locally; make no runtime map-data request.
- Support French, English, Spanish, German, and Italian for every new UK-specific value.
- Do not claim bar eligibility; prominently state that the KCL integrated dual degree cannot meet New York Bar course requirements.
- Keep touch targets at least 44px on mobile and prevent horizontal overflow from 320px through 1680px.
- Preserve the existing URL scheme and return UK details to `/uk`.
- Do not modify the source Google Sheet.

---

## File map

- `data/uk-database.json`: canonical institutions and six active pathway records.
- `data/uk-translations.json`: EN/ES/DE/IT translations for all values emitted by the canonical dataset.
- `data/uk.json`: accurate simplified UK MultiPolygon with source metadata.
- `src/lib/uk-data.ts`: existing adapter; only adjust category/application mappings if a new dataset value requires it.
- `src/components/uk-map.tsx`: UK projection, leader-line layout, interaction, labels, and responsive SVG.
- `src/components/pages/uk-home-page.tsx`: localized hero/count copy and any UK-specific quick-filter wording.
- `scripts/verify-uk-data.mjs`: dataset scope and evidence assertions.
- `scripts/verify-uk-translations.mjs`: complete five-locale coverage and critical-warning assertions.
- `scripts/verify-uk-integration.mjs`: source-level wiring, geometry, map behavior, and copy assertions.
- `scripts/verify-uk-page.mjs`: desktop/mobile browser behavior and visual-legibility checks.
- `docs/research/uk-us-llm-sources.md`: concise provenance ledger for the spreadsheet and official sources used in each published record.

### Task 1: Lock the new UK dataset contract

**Files:**
- Modify: `scripts/verify-uk-data.mjs`
- Create: `docs/research/uk-us-llm-sources.md`

**Interfaces:**
- Consumes: `getAllUkPartnerships(): Partnership[]` and `getUkUniversitiesPoints(): FrenchUniversityPoint[]` from `src/lib/uk-data.ts`.
- Produces: executable assertions for the six pathway IDs and five origin institutions used by every later task.

- [ ] **Step 1: Replace the old count and Dundee assertions with the failing active-scope contract**

```js
const expectedIds = new Set([
  "qmul-william-mary",
  "kcl-georgetown-dual",
  "kcl-ctls-georgetown",
  "greenwich-mitchell-hamline",
  "middlesex-case-western",
  "bristol-cardozo",
])

assert.equal(institutions.length, 5, "The UK directory must contain five institutions")
assert.equal(partnerships.length, 6, "The UK directory must expose six active LL.M. pathways")
assert.deepEqual(new Set(partnerships.map(({ id }) => id)), expectedIds)
assert.equal(partnerships.some(({ id }) => /dundee|hull/i.test(id)), false)
```

- [ ] **Step 2: Add critical evidence assertions**

```js
assert.match(partnerships.find(({ id }) => id === "qmul-william-mary").financialAid, /billet|tuition|logement|allocation/i)
assert.match(partnerships.find(({ id }) => id === "kcl-georgetown-dual").notes, /New York Bar/i)
assert.match(partnerships.find(({ id }) => id === "kcl-ctls-georgetown").tuitionDisplay, /50 %/)
assert.match(partnerships.find(({ id }) => id === "greenwich-mitchell-hamline").financialAid, /50 %/)
assert.match(partnerships.find(({ id }) => id === "middlesex-case-western").availableSeatsDisplay, /deux/i)
assert.match(partnerships.find(({ id }) => id === "bristol-cardozo").sourceNote, /Bristol.*Cardozo/i)
```

- [ ] **Step 3: Run the contract and confirm it fails against the five-record dataset**

Run: `npm run data:verify:uk`

Expected: FAIL because the current dataset has four institutions, five records, and a Dundee exchange.

- [ ] **Step 4: Record source provenance without copying the entire spreadsheet**

Create `docs/research/uk-us-llm-sources.md` with one table row per published ID containing the home-university source, US-school source when available, spreadsheet reliability score, current-cycle date, and a plain-language evidence limitation. Add a second table listing Dundee, Hull, JD-only, exchange-only, and US-to-UK arrangements as excluded categories.

- [ ] **Step 5: Commit the failing contract and research ledger**

```bash
git add scripts/verify-uk-data.mjs docs/research/uk-us-llm-sources.md
git commit -m "test: define refreshed UK directory scope"
```

### Task 2: Replace the canonical UK partnership records

**Files:**
- Modify: `data/uk-database.json`
- Modify: `src/lib/uk-data.ts`
- Test: `scripts/verify-uk-data.mjs`

**Interfaces:**
- Consumes: the existing `PartnershipsDatabase` JSON shape and `Partnership` adapter contract.
- Produces: the exact six IDs specified in Task 1 and points for KCL, QMUL, Greenwich, Middlesex, and Bristol.

- [ ] **Step 1: Replace `frenchUniversities` with five institution objects**

Use stable IDs `kcl`, `qmul`, `greenwich`, `middlesex`, and `bristol`. Store real campus coordinates and current faculty names. Remove `dundee`.

- [ ] **Step 2: Replace `partnerships` with six complete active records**

Use these stable IDs and program identities:

```json
[
  { "id": "qmul-william-mary", "programType": "LL.M. in American Legal Studies" },
  { "id": "kcl-georgetown-dual", "programType": "LL.B./LL.M. Dual Degree" },
  { "id": "kcl-ctls-georgetown", "programType": "CTLS Alumni Scholarship for Georgetown LL.M. programs" },
  { "id": "greenwich-mitchell-hamline", "programType": "Mitchell Hamline LL.M. progression pathway" },
  { "id": "middlesex-case-western", "programType": "LL.M. in United States and Global Legal Studies" },
  { "id": "bristol-cardozo", "programType": "Cardozo LL.M. Partnership Scholarship" }
]
```

For every object, populate all existing schema fields with the spreadsheet facts. Use `null` for unpublished seat bounds, `Non communiqué` for unknown display values, and explicit caveats in `missingInformation`, `sourceNote`, and `notes`. Use only HTTPS official links.

- [ ] **Step 3: Make any minimal adapter mapping additions**

If the records use a new partnership category, add only that key to `mapTuitionCategory` or `partnershipTypes`. Keep `getAllUkPartnerships`, `getUkPartnershipById`, `getUkUniversitiesPoints`, and `getUkFilterOptions` signatures unchanged.

- [ ] **Step 4: Run the new data contract**

Run: `npm run data:verify:uk`

Expected: `UK dataset verified: 5 institutions, 6 pathways`.

- [ ] **Step 5: Commit the canonical data**

```bash
git add data/uk-database.json src/lib/uk-data.ts
git commit -m "feat: refresh UK LL.M. partnerships"
```

### Task 3: Translate every new UK value

**Files:**
- Modify: `scripts/verify-uk-translations.mjs`
- Modify: `data/uk-translations.json`

**Interfaces:**
- Consumes: all translatable string values emitted by Task 2.
- Produces: exact dictionary entries under `en`, `es`, `de`, and `it`, while French remains canonical.

- [ ] **Step 1: Replace the removed Dundee-warning assertion with three critical warning checks**

```js
const dualBarWarning = partnerships.find(({ id }) => id === "kcl-georgetown-dual").notes
const bristolEvidence = partnerships.find(({ id }) => id === "bristol-cardozo").sourceNote
const qmulCoverage = partnerships.find(({ id }) => id === "qmul-william-mary").financialAid

for (const language of ["en", "es", "de", "it"]) {
  assert.ok(translations[language][dualBarWarning]?.includes("New York"))
  assert.ok(translations[language][bristolEvidence]?.trim())
  assert.ok(translations[language][qmulCoverage]?.trim())
}
```

- [ ] **Step 2: Run the translation verifier and capture the missing-value list**

Run: `npm run translations:verify:uk`

Expected: FAIL listing every new canonical French value not yet mapped.

- [ ] **Step 3: Add exact EN/ES/DE/IT values for every missing key**

Keep official institution and program names unchanged where they are proper names. Translate cities, categories, descriptions, eligibility, deadlines, costs, caveats, tests, and missing-information labels. Preserve currency figures, dates, percentages, and legal rule references exactly.

- [ ] **Step 4: Run translation checks**

Run: `npm run translations:verify:uk && npm run translations:verify:data && npm run verify:de && npm run verify:it`

Expected: all commands PASS with no missing or forbidden fallback values.

- [ ] **Step 5: Commit localized data**

```bash
git add data/uk-translations.json scripts/verify-uk-translations.mjs
git commit -m "feat: localize refreshed UK pathways"
```

### Task 4: Replace the broken UK geometry and marker layout

**Files:**
- Modify: `data/uk.json`
- Modify: `scripts/verify-uk-integration.mjs`
- Modify: `src/components/uk-map.tsx`

**Interfaces:**
- Consumes: five `FrenchUniversityPoint` objects and `selectedUkUniversity?: string`.
- Produces: the unchanged `UkMap` component API, plus SVG elements marked with `data-uk-land`, `data-marker-origin`, and `data-marker-leader` for stable verification.

- [ ] **Step 1: Add failing geometry and map-source assertions**

```js
const geo = JSON.parse(readFileSync(paths.geo, "utf8"))
assert.equal(geo.type, "FeatureCollection")
assert.ok(geo.features.length >= 1)
assert.match(JSON.stringify(geo), /Natural Earth/i)
assert.match(map, /data-uk-land/)
assert.match(map, /data-marker-origin/)
assert.match(map, /data-marker-leader/)
assert.doesNotMatch(map, /width \* 0\.5.*height \* 0\.12/s)
```

- [ ] **Step 2: Run the integration test and confirm failure**

Run: `npm run test:integration:uk`

Expected: FAIL because the existing hand-authored geometry lacks source metadata and leader-line contracts.

- [ ] **Step 3: Replace `data/uk.json` with simplified Natural Earth UK geometry**

Use Natural Earth Admin 0 Countries geometry, select the United Kingdom feature, retain all principal polygons including Great Britain and Northern Ireland, simplify only enough for a compact bundle, and add `properties.source` and `properties.license` metadata. Validate the JSON after editing.

- [ ] **Step 4: Refactor projection to fit the entire feature collection**

Set `const ukFeature = ukGeojson` and call `projection.fitExtent(...)` with the `FeatureCollection`, not `features[0]`. Draw every polygon through one `geoPath`. Apply `data-uk-land="true"`, a visible semantic-token fill, a coastline stroke, `vectorEffect="non-scaling-stroke"`, and no decorative crosshairs.

- [ ] **Step 5: Implement deterministic collision-safe markers**

Project each true point into `{ originX, originY }`. Use a fixed offset table keyed by the four London institution names and `{x: 0, y: 0}` elsewhere. Clamp display coordinates within the map padding. Render a leader line whenever displacement exceeds 2px:

```tsx
<line
  data-marker-leader={p.frenchUniversity}
  x1={originX}
  y1={originY}
  x2={x}
  y2={y}
  vectorEffect="non-scaling-stroke"
/>
```

Render a small true-coordinate dot with `data-marker-origin` before the interactive display marker.

- [ ] **Step 6: Make labels work on hover, focus, and selection**

Use `const showLabel = isHovered || isFocused || selected`. Keep the existing keyboard Enter/Space behavior, `aria-pressed`, and translated accessible name. Give the interactive group a transparent 44px hit circle on touch layouts while retaining the current restrained visible dot.

- [ ] **Step 7: Run map and build checks**

Run: `npm run test:integration:uk && npx tsc --noEmit && npm run build`

Expected: all commands PASS; the production build includes `/uk` and all six detail paths.

- [ ] **Step 8: Commit the map fix**

```bash
git add data/uk.json src/components/uk-map.tsx scripts/verify-uk-integration.mjs
git commit -m "fix: rebuild the UK partnership map"
```

### Task 5: Update page copy, counts, filters, and browser coverage

**Files:**
- Modify: `src/components/pages/uk-home-page.tsx`
- Modify: `scripts/verify-uk-integration.mjs`
- Modify: `scripts/verify-uk-page.mjs`

**Interfaces:**
- Consumes: six `Partnership` records and five map points.
- Produces: the existing `/uk` page and detail navigation with refreshed copy in five locales.

- [ ] **Step 1: Change source-level copy assertions to six pathways and five universities**

Assert the localized summaries contain these numeric claims:

```text
FR: 6 parcours actifs dans 5 universités britanniques
EN: 6 active pathways across 5 UK universities
ES: 6 itinerarios activos en 5 universidades británicas
DE: 6 aktive Studienwege an 5 britischen Universitäten
IT: 6 percorsi attivi in 5 università britanniche
```

- [ ] **Step 2: Update Playwright expectations before page code**

Require six detail links, five accessible map markers, no Dundee text, a selectable Middlesex marker, the KCL bar warning, the Bristol evidence caveat, and all five localized summaries. On 390×844, assert the map SVG is inside the viewport width and the page has no horizontal overflow.

- [ ] **Step 3: Run browser checks and confirm failure**

Run: `npm run test:browser:uk`

Expected: FAIL on the old result count/copy and removed Dundee interaction.

- [ ] **Step 4: Update `uk-home-page.tsx` copy and quick-filter behavior**

Replace every old “4 partnerships / 5 pathways” summary and the Dundee exchange caveat. Keep the existing page composition. Ensure “Frais réduits” can return all applicable reduced or fully funded records rather than assuming Cardozo is the only result.

- [ ] **Step 5: Update browser interactions to stable new records**

Use `Middlesex University London` for marker keyboard/tap filtering, `CTLS Alumni Scholarship` for a 50% tuition search, and `kcl-georgetown-dual` for the English detail-route warning. Verify the country selector still reports UK in desktop and mobile navigation.

- [ ] **Step 6: Run the UK suite**

Run: `npm run data:verify:uk && npm run translations:verify:uk && npm run test:integration:uk && npm run test:browser:uk`

Expected: all four commands PASS.

- [ ] **Step 7: Commit page integration**

```bash
git add src/components/pages/uk-home-page.tsx scripts/verify-uk-integration.mjs scripts/verify-uk-page.mjs
git commit -m "feat: integrate expanded UK directory"
```

### Task 6: Final regression, production deployment, and live verification

**Files:**
- Modify only if a regression test exposes an in-scope UK defect.

**Interfaces:**
- Consumes: the completed UK implementation.
- Produces: pushed Git history and a verified Vercel production deployment.

- [ ] **Step 1: Run all relevant regression checks**

Run: `npm run data:verify:uk && npm run translations:verify:uk && npm run test:integration:uk && npm run test:browser:uk && npm run test:final-fixes && npm run verify:de && npm run verify:it && npx tsc --noEmit && npm run build`

Expected: every command exits 0.

- [ ] **Step 2: Inspect the scoped diff and worktree**

Run: `git status --short && git diff master...HEAD --stat && git log --oneline --decorate -8`

Expected: only intended UK/spec/plan files plus the pre-existing untracked `../vercel-login.log`; no generated `.next` or credential file is staged.

- [ ] **Step 3: Push the current branch**

Run: `git push -u origin codex/switzerland-us-llm`

Expected: push succeeds and the remote branch points to the verified commits.

- [ ] **Step 4: Publish through the repository's established production workflow**

Fast-forward or merge the verified branch into `master` using the repository's existing non-interactive workflow, push `master`, then run `npx vercel --prod --yes` from the linked project if the Git push does not already create the required production deployment.

Expected: Vercel reports a successful production deployment for `https://llm-partnerships.vercel.app`.

- [ ] **Step 5: Verify the live page in desktop and mobile viewports**

Open `https://llm-partnerships.vercel.app/uk`. Confirm six results, five map markers, a visible coastline, London leader lines, working keyboard/tap filtering, localized copy, no Dundee/Hull entry, and no horizontal overflow at 390×844. Check the deployment response and browser console for errors.

- [ ] **Step 6: Report the deployed outcome**

Provide the production URL, pushed branch/commit, deployment status, test commands, and any deliberately retained evidence caveat. Do not claim completion until the live checks pass.
