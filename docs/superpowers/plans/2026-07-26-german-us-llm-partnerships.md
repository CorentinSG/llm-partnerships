# German–U.S. LL.M. Partnerships Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate `/germany` directory that mirrors the existing French–U.S. experience and presents 16 sourced German–U.S. LL.M. pathways without changing the French dataset or page behavior.

**Architecture:** Keep `data/database.json` and the `/` page as the isolated French implementation. Add a parallel German dataset and loader that map into the existing `Partnership` view model, then reuse cards, detail pages, filters, U.S. map, cost simulator, and layout through a Germany-specific page component. Add a dedicated Germany GeoJSON/map component and only make narrow shared changes for navigation, generic metadata, translations, and detail lookup across both datasets.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 3, d3-geo, Radix UI, Playwright, JSON data.

## Global Constraints

- Do not change the French partnership records, French map points, French result counts, French filters, or French cost-simulator inputs.
- Keep the current `/` route as the France–United States page.
- Add the Germany–United States directory at `/germany`.
- Present exactly 16 German pathway records across 9 German law faculties.
- Use official German faculty or U.S. law-school pages as primary sources.
- Preserve current partnership detail URLs and allow German detail records through the same `/partnership/[id]` route.
- Provide every new visible string in French, English, and Spanish.
- Do not introduce a new visual theme or dependency.
- Treat old deadlines as dated evidence, not as a future deadline.

---

## File structure

- Create `llm-partnerships/data/germany-database.json`: German universities, 16 partnerships, official links, reliability metadata.
- Create `llm-partnerships/data/germany.json`: Federal Republic of Germany boundary used by d3-geo.
- Create `llm-partnerships/src/lib/germany-data.ts`: German-only data mapping, points, filters, and detail lookup.
- Create `llm-partnerships/src/components/germany-map.tsx`: accessible German origin map matching `FranceMap`.
- Create `llm-partnerships/src/components/pages/germany-home-page.tsx`: `/germany` directory UI, isolated state, German copy.
- Create `llm-partnerships/src/app/germany/page.tsx`: route entry and metadata.
- Create `llm-partnerships/scripts/verify-germany-data.mjs`: deterministic dataset and source validation.
- Modify `llm-partnerships/src/lib/database-schema.ts`: allow the German database to use the established raw partnership structure.
- Modify `llm-partnerships/src/lib/data.ts`: expose a combined detail lookup only; keep French list APIs unchanged.
- Modify `llm-partnerships/src/app/partnership/[id]/page.tsx`: resolve French or German records.
- Modify `llm-partnerships/src/components/site-header.tsx`: add France–U.S. and Germany–U.S. section links.
- Modify `llm-partnerships/src/app/about/page.tsx`: describe both independent sections.
- Modify `llm-partnerships/src/app/layout.tsx`: broaden global metadata.
- Modify `llm-partnerships/src/components/pages/home-page.tsx`: add one non-disruptive link to `/germany`; do not change French data flow.
- Modify `llm-partnerships/src/components/filters/filters-panel.tsx`: accept an optional localized origin-university label while retaining the French default.
- Modify `llm-partnerships/scripts/designer-verify.mjs`: include `/germany` and one German detail route.
- Modify `llm-partnerships/package.json`: add `data:verify:germany`.

---

### Task 1: German dataset and validation

**Files:**
- Create: `llm-partnerships/data/germany-database.json`
- Create: `llm-partnerships/scripts/verify-germany-data.mjs`
- Modify: `llm-partnerships/package.json`

**Interfaces:**
- Produces: a JSON object with `schemaVersion`, `language`, `projectName`, `unknownValue`, `statusDefinitions`, `tuitionCategories`, `partnershipTypes`, `frenchUniversities`, and `partnerships`.
- Produces: `npm run data:verify:germany`, exiting `0` only for 9 universities and 16 unique partnerships with HTTPS official sources.

- [ ] **Step 1: Write the failing validator**

Create a validator that imports `data/germany-database.json`, asserts `frenchUniversities.length === 9`, `partnerships.length === 16`, checks unique university and partnership IDs, verifies every `frenchUniversityId`, requires `officialLink` to begin with `https://`, and checks every reliability status is one of `confirmed`, `to_confirm`, or `incomplete`.

```js
import assert from "node:assert/strict"
import database from "../data/germany-database.json" with { type: "json" }

assert.equal(database.frenchUniversities.length, 9, "expected 9 German faculties")
assert.equal(database.partnerships.length, 16, "expected 16 German pathways")

const universityIds = database.frenchUniversities.map(({ id }) => id)
const partnershipIds = database.partnerships.map(({ id }) => id)
assert.equal(new Set(universityIds).size, universityIds.length, "duplicate university id")
assert.equal(new Set(partnershipIds).size, partnershipIds.length, "duplicate partnership id")

const statuses = new Set(["confirmed", "to_confirm", "incomplete"])
for (const partnership of database.partnerships) {
  assert.ok(universityIds.includes(partnership.frenchUniversityId), `unknown university: ${partnership.id}`)
  assert.ok(partnership.officialLink.startsWith("https://"), `missing official HTTPS source: ${partnership.id}`)
  assert.ok(statuses.has(partnership.reliabilityStatus), `invalid reliability: ${partnership.id}`)
}

console.log("German dataset verified: 9 faculties, 16 pathways")
```

- [ ] **Step 2: Run the validator and confirm failure**

Run: `node scripts/verify-germany-data.mjs` from `llm-partnerships`.

Expected: failure with `ERR_MODULE_NOT_FOUND` for `data/germany-database.json`.

- [ ] **Step 3: Add the sourced dataset**

Create all 9 German university records with coordinates and all 16 pathway records listed in the design specification. Encode the published distinctions explicitly in `programType`, `partnershipType`, `shortDescription`, `availableSeatsDisplay`, `tuitionDisplay`, `financialAid`, `applicationDeadline`, `sourceNote`, `missingInformation`, and `notes`.

Use these corrected current facts:

- Freiburg–UConn: 5 places annually; tuition remission up to 50%.
- FU Berlin–Miami: up to 2 places; discretionary remission of 10–50%.
- Münster–UConn: up to 7 nominations; scholarship up to 50%.
- Mannheim–Vanderbilt: at least 2 awards of USD 50,000, published February 2, 2026.
- Regensburg–UC Law SF students: 75% Leary Scholarship, approximately USD 41,000.
- Regensburg–UC Law SF graduates: 50% Riesenfeld Scholarship, approximately USD 25,000.

For Augsburg, use four separate exchange-credit pathways. For Düsseldorf, keep the exchange-credit and graduate scholarship pathways separate. Mark school-wide or discretionary benefits honestly.

- [ ] **Step 4: Add and run the npm validator command**

Add:

```json
"data:verify:germany": "node scripts/verify-germany-data.mjs"
```

Run: `npm run data:verify:germany`.

Expected: `German dataset verified: 9 faculties, 16 pathways`.

- [ ] **Step 5: Commit the dataset**

```powershell
git add llm-partnerships/data/germany-database.json llm-partnerships/scripts/verify-germany-data.mjs llm-partnerships/package.json
git commit -m "Add sourced German US LLM partnership data"
```

### Task 2: German loader and shared detail resolution

**Files:**
- Create: `llm-partnerships/src/lib/germany-data.ts`
- Modify: `llm-partnerships/src/lib/database-schema.ts`
- Modify: `llm-partnerships/src/lib/data.ts`
- Test: `llm-partnerships/scripts/verify-germany-data.mjs`

**Interfaces:**
- Produces: `getAllGermanPartnerships(): Partnership[]`
- Produces: `getGermanPartnershipById(id: string): Partnership | undefined`
- Produces: `getGermanUniversitiesPoints(): FrenchUniversityPoint[]`
- Produces: `getGermanFilterOptions(): ReturnType<typeof getFilterOptions>`
- Produces: `getAnyPartnershipById(id: string): Partnership | undefined`

- [ ] **Step 1: Extend the validator to inspect normalized data through a small TypeScript build check**

Add schema assertions that every raw partnership has `partnerUniversity`, `programType`, `tuitionCategory`, `applicationDeadline`, and non-empty `shortDescription`.

Run: `npm run data:verify:germany`.

Expected: PASS for raw data validation.

- [ ] **Step 2: Implement the German mapper**

Mirror the stable mapping behavior from `src/lib/data.ts` in a dedicated module. Do not import or mutate the French database. Preserve the existing `Partnership` property names so shared cards and filters work without changes.

```ts
export function getAllGermanPartnerships() {
  return germanPartnerships
}

export function getGermanPartnershipById(id: string) {
  return germanPartnerships.find((partnership) => partnership.id === id)
}

export function getGermanUniversitiesPoints(): FrenchUniversityPoint[] {
  return germanyDatabase.frenchUniversities.map((university) => ({
    frenchUniversity: university.name,
    frenchFaculty: university.faculty,
    city: university.city,
    coordinates: university.coordinates,
  }))
}
```

Build filter options from `germanPartnerships` using the same output keys consumed by `FiltersPanel`.

- [ ] **Step 3: Add combined detail lookup**

Keep `getAllPartnerships()` French-only. Add:

```ts
import { getGermanPartnershipById } from "@/lib/germany-data"

export function getAnyPartnershipById(id: string) {
  return getPartnershipById(id) ?? getGermanPartnershipById(id)
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`.

Expected: no TypeScript errors.

- [ ] **Step 5: Commit the loader**

```powershell
git add llm-partnerships/src/lib/germany-data.ts llm-partnerships/src/lib/database-schema.ts llm-partnerships/src/lib/data.ts llm-partnerships/scripts/verify-germany-data.mjs
git commit -m "Add isolated German partnership data loader"
```

### Task 3: Germany map

**Files:**
- Create: `llm-partnerships/data/germany.json`
- Create: `llm-partnerships/src/components/germany-map.tsx`

**Interfaces:**
- Consumes: `FrenchUniversityPoint[]`, `UiLanguage`, and `usePanZoom`.
- Produces: `GermanyMap({ points, selectedGermanUniversity, onSelect, className, language })`.

- [ ] **Step 1: Add Germany boundary GeoJSON**

Use a valid FeatureCollection containing Germany’s national outline. Keep only the geometry and `name` property required by d3-geo.

- [ ] **Step 2: Implement the map from the France map contract**

Reuse projection fitting, zoom controls, keyboard selection, collision offsets, hover labels, and translated help text. Use Germany-specific IDs such as `deFill` to prevent SVG definition collisions.

```ts
export function GermanyMap({
  points,
  selectedGermanUniversity,
  onSelect,
  className,
  language = "fr",
}: {
  points: FrenchUniversityPoint[]
  selectedGermanUniversity?: string
  onSelect: (university: string | undefined) => void
  className?: string
  language?: UiLanguage
}) {
  // Same accessible interaction contract as FranceMap.
}
```

- [ ] **Step 3: Type-check the map**

Run: `npx tsc --noEmit`.

Expected: no TypeScript errors.

- [ ] **Step 4: Commit the map**

```powershell
git add llm-partnerships/data/germany.json llm-partnerships/src/components/germany-map.tsx
git commit -m "Add interactive Germany university map"
```

### Task 4: Germany directory page

**Files:**
- Create: `llm-partnerships/src/components/pages/germany-home-page.tsx`
- Create: `llm-partnerships/src/app/germany/page.tsx`
- Modify: `llm-partnerships/src/components/filters/filters-panel.tsx`

**Interfaces:**
- Consumes: all four `germany-data.ts` selectors, `GermanyMap`, `UsMap`, `FiltersPanel`, `PartnershipCard`, and `CostSimulator`.
- Produces: `/germany` with German-only search, filters, maps, result pagination, and simulator.
- Produces: `FiltersPanel` optional prop `originUniversityLabel?: string`; default remains the current language-specific French label.

- [ ] **Step 1: Add the optional filter label without changing the default**

```ts
export function FiltersPanel({
  options,
  filters,
  onChange,
  onReset,
  showFrenchUniversityFilter = true,
  originUniversityLabel,
}: {
  // existing props
  originUniversityLabel?: string
}) {
  // Render originUniversityLabel ?? t.frenchUniversity.
}
```

Run: `npx tsc --noEmit`.

Expected: no errors and the existing home page requires no prop change.

- [ ] **Step 2: Build the Germany page component**

Copy the established page composition, but source every collection from `germany-data.ts`. Use a local translated copy object with:

- French title: `Trouvez un LL.M américain via une université allemande.`
- English title: `Find a U.S. LL.M. through a German university.`
- Spanish title: `Encuentra un LL.M estadounidense a través de una universidad alemana.`
- Map tabs: Germany and United States.
- Origin filter: German university / Deutsche Universität context expressed in the active UI language.

Keep result page size at 12 and all filter state local to `/germany`.

- [ ] **Step 3: Add the route**

```tsx
import { GermanyHomePage } from "@/components/pages/germany-home-page"

export default function GermanyPage() {
  return <GermanyHomePage />
}
```

Export localized neutral metadata that describes German–U.S. LL.M. partnerships.

- [ ] **Step 4: Run data and type checks**

Run: `npm run data:verify:germany`.

Expected: PASS.

Run: `npx tsc --noEmit`.

Expected: no TypeScript errors.

- [ ] **Step 5: Commit the page**

```powershell
git add llm-partnerships/src/components/pages/germany-home-page.tsx llm-partnerships/src/app/germany/page.tsx llm-partnerships/src/components/filters/filters-panel.tsx
git commit -m "Add Germany US LLM directory page"
```

### Task 5: Navigation, global scope copy, and detail pages

**Files:**
- Modify: `llm-partnerships/src/components/site-header.tsx`
- Modify: `llm-partnerships/src/components/pages/home-page.tsx`
- Modify: `llm-partnerships/src/app/about/page.tsx`
- Modify: `llm-partnerships/src/app/layout.tsx`
- Modify: `llm-partnerships/src/app/partnership/[id]/page.tsx`

**Interfaces:**
- Consumes: `getAnyPartnershipById`.
- Produces: visible France–U.S. and Germany–U.S. navigation in all three languages.
- Preserves: the French page’s existing title, datasets, filters, maps, and results.

- [ ] **Step 1: Update partnership detail resolution**

Replace French-only detail lookup with `getAnyPartnershipById`. Keep the route format and not-found behavior unchanged.

Run: `npx tsc --noEmit`.

Expected: no errors.

- [ ] **Step 2: Add section navigation**

Add desktop and mobile links:

```ts
franceUs: "France–États-Unis",
germanyUs: "Allemagne–États-Unis",
```

with equivalent English and Spanish strings. Link to `/` and `/germany`.

- [ ] **Step 3: Add a restrained cross-link on the French page**

Add one translated tertiary link near the existing hero actions that sends users to `/germany`. Do not change the French hero title, explanatory paragraphs, dataset selectors, map mode, or filter state.

- [ ] **Step 4: Broaden only global copy**

Update global metadata and the About page to say the site contains separate French–U.S. and German–U.S. directories. Preserve paragraphs describing the French section and add an equivalent Germany paragraph.

- [ ] **Step 5: Type-check and commit**

Run: `npx tsc --noEmit`.

Expected: no errors.

```powershell
git add llm-partnerships/src/components/site-header.tsx llm-partnerships/src/components/pages/home-page.tsx llm-partnerships/src/app/about/page.tsx llm-partnerships/src/app/layout.tsx llm-partnerships/src/app/partnership/[id]/page.tsx
git commit -m "Connect French and German LLM directories"
```

### Task 6: Production and visual verification

**Files:**
- Modify: `llm-partnerships/scripts/designer-verify.mjs`

**Interfaces:**
- Produces: automated route, overflow, console-error, and content checks for `/germany` and a German detail page.

- [ ] **Step 1: Extend browser verification**

Add `/germany` and `/partnership/mannheim-vanderbilt` to the verified route list. Verify the exact specification widths of 375, 768, 1024, and 1440 pixels.

```js
const routes = [
  "/",
  "/germany",
  "/partnership/mannheim-vanderbilt",
  "/alternatives",
  "/guide",
  "/submit",
]
```

- [ ] **Step 2: Run deterministic checks**

Run: `npm run data:verify:germany`.

Expected: `German dataset verified: 9 faculties, 16 pathways`.

Run: `npx tsc --noEmit`.

Expected: no TypeScript errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`.

Expected: successful Next.js production build including `/germany` and dynamic partnership pages.

- [ ] **Step 4: Run browser verification**

Start the production server on an available local port, set `DESIGNER_VERIFY_URL` to that origin, then run `npm run designer:verify`.

Expected: `Designer verification passed`.

- [ ] **Step 5: Manually compare French non-regression**

At 375px, 768px, 1024px, and 1440px, compare `/` before and after:

- same French hero copy;
- same French result count;
- same France/U.S. map tabs;
- same filter defaults;
- same first 12 French records;
- same cost-simulator partnership choices.

Confirm `/germany` shows 16 total records, 9 German origin points, German/United States map tabs, working filters, and German-only simulator choices.

- [ ] **Step 6: Verify source links and translations**

Open at least one record from each German faculty. Confirm the official source opens, untranslated German institution names remain intact, and switching FR/EN/ES translates the surrounding interface without changing factual amounts or guarantees.

- [ ] **Step 7: Commit verification updates**

```powershell
git add llm-partnerships/scripts/designer-verify.mjs
git commit -m "Verify German LLM directory routes"
```

---

## Completion evidence

Record the following in the final handoff:

- validator output confirming 9 faculties and 16 pathways;
- TypeScript check result;
- production build result;
- browser verification result;
- French non-regression result;
- direct local links to `/germany`, the German data file, and the German map component.
