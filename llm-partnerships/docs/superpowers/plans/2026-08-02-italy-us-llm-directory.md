# Italy–United States LL.M. Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a fully sourced, four-language Italy–United States LL.M. directory matching the France and Germany sections.

**Architecture:** Reuse the Germany country-directory boundary: dedicated Italy JSON datasets, typed adapter, map, page, translation dictionary, route, and verification scripts. Integrate Italy only through shared navigation, detail routing, descriptions, filters, cards, maps, and simulator interfaces already used by the other country directories.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JSON datasets, D3 geographic projections, Playwright, Node.js assertion scripts, Vercel.

## Global Constraints

- Publish twelve baseline pathways across five Italian institutions.
- Mark Roma Tre–Cardozo `to_confirm` with annual confirmation language.
- Support only official institutional sources for material claims.
- Keep standard U.S. tuition, partner tuition, Italian tuition, mandatory fees, and living costs distinct.
- Never describe LUISS `No Fee` pathways as free LL.M.s.
- Preserve university, law-school, degree, program, test, and service names.
- Translate all Italy UI and dataset text into French, English, Spanish, and German.
- Do not remove or rewrite France or Germany content.
- Complete TypeScript, data, translation, browser, responsive, regression, build, Git, and Vercel verification.

---

### Task 1: Official Research Ledger and Dataset Contract

**Files:**
- Create: `docs/research/italy-us-llm-sources.md`
- Create: `scripts/verify-italy-data.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: a twelve-record evidence ledger and executable dataset requirements consumed by Tasks 2–5.

- [ ] **Step 1: Write the official-source ledger**

Record each pathway ID, Italian institution, U.S. institution, official home-university source, official U.S. source, evidence date, and supported fields. Use the supplied Word research as a lead, then verify every URL and value against official university domains. Record excluded pathways and why they fail the US-bound LL.M. inclusion rule.

- [ ] **Step 2: Write the failing data verifier**

Create `verify-italy-data.mjs` with assertions equivalent to:

```js
assert.equal(database.partnerships.length, 12)
assert.equal(database.frenchUniversities.length, 5)
assert.equal(new Set(database.partnerships.map((item) => item.id)).size, 12)
assert.equal(
  database.partnerships.find((item) => item.id === "roma-tre-cardozo")
    .reliabilityStatus,
  "to_confirm",
)
for (const item of database.partnerships) {
  assert.match(item.officialLink, /^https:\/\//)
  assert.ok(item.sourceNote.trim())
  assert.ok(["confirmed", "to_confirm", "incomplete"].includes(item.reliabilityStatus))
}
```

Add `"data:verify:italy": "node scripts/verify-italy-data.mjs"` to `package.json`.

- [ ] **Step 3: Run RED**

Run: `npm run data:verify:italy`

Expected: FAIL because `data/italy-database.json` does not exist.

- [ ] **Step 4: Commit the research and failing contract**

```powershell
git add docs/research/italy-us-llm-sources.md scripts/verify-italy-data.mjs package.json
git commit -m "Document official Italy US LLM sources"
```

---

### Task 2: Italy Data, Adapter, and Geographic Points

**Files:**
- Create: `data/italy-database.json`
- Create: `data/italy.json`
- Create: `src/lib/italy-data.ts`
- Modify: `src/lib/data.ts`
- Test: `scripts/verify-italy-data.mjs`

**Interfaces:**
- Produces: `getAllItalianPartnerships(): Partnership[]`, `getItalianPartnershipById(id)`, `getItalianUniversitiesPoints()`, and `getItalianFilterOptions()`.

- [ ] **Step 1: Add all twelve normalized records**

Use IDs:

```text
luiss-fordham
luiss-temple
luiss-uc-law-sf
luiss-american-wcl
luiss-suffolk
cattolica-fordham
cattolica-boston-college
cattolica-berkeley
trento-washu
trento-cincinnati
lum-indiana-maurer
roma-tre-cardozo
```

Populate every common partnership field from verified evidence. Represent zero partner tuition as `no_tuition` only when `tuitionDisplay` explicitly says Italian tuition and living expenses remain payable. Preserve annual years and uncertainty in `sourceNote`, `notes`, and `missingInformation`.

- [ ] **Step 2: Add five Italian map points**

Create map points for LUISS and Roma Tre in Rome, Cattolica in Milan, Trento in Trento, and LUM in Casamassima with official institution names and validated coordinates.

- [ ] **Step 3: Implement the typed adapter**

Follow the Germany adapter and export the four exact interfaces above. Use Italy’s geographic fallback center `{ lat: 41.8719, lng: 12.5674 }`. Reuse the common tuition, seats, language-test, reliability, and filter types without changing France or Germany adapters.

- [ ] **Step 4: Run GREEN and regressions**

Run: `npm run data:verify:italy && npm run data:verify:germany && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add data/italy-database.json data/italy.json src/lib/italy-data.ts src/lib/data.ts scripts/verify-italy-data.mjs
git commit -m "Add verified Italy US LLM data"
```

---

### Task 3: Italy Route, Page, Map, and Shared Navigation

**Files:**
- Create: `src/app/italy/page.tsx`
- Create: `src/components/pages/italy-home-page.tsx`
- Create: `src/components/italy-map.tsx`
- Modify: `src/app/partnership/[id]/page.tsx`
- Modify: `src/components/pages/partnership-detail-page.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `scripts/verify-directory-navigation.mjs`
- Test: `scripts/verify-italy-page.mjs`

**Interfaces:**
- Consumes: Task 2 Italy accessors.
- Produces: `/italy`, Italy detail routes, Italy/USA map switching, and three-country navigation.

- [ ] **Step 1: Write the failing page contract**

Assert that `/italy` files exist, the page imports `ItalyHomePage`, the home page imports all Italy accessors, the dynamic detail route checks Italy IDs, and header copy contains `italyUs` in `fr`, `en`, `es`, and `de`.

- [ ] **Step 2: Run RED**

Run: `node scripts/verify-italy-page.mjs`

Expected: FAIL on missing `src/app/italy/page.tsx`.

- [ ] **Step 3: Implement the country page and map**

Clone the Germany page behavior, then replace only country-specific imports, copy, map data, filter options, simulator origin copy, and route destination. Italy map labels must identify the five institutions and support selecting/clearing filters, pan/zoom, keyboard access, and mobile gestures.

- [ ] **Step 4: Integrate navigation and detail routing**

Add localized labels:

```ts
fr: "Italie–États-Unis"
en: "Italy–United States"
es: "Italia–Estados Unidos"
de: "Italien–USA"
```

Resolve Italy records after France and Germany lookups without changing existing ID behavior. Set detail back navigation to `/italy` for Italy records.

- [ ] **Step 5: Update platform descriptions narrowly**

Change references to two directories into three directories and name France, Germany, and Italy in each language. Leave all other prose intact.

- [ ] **Step 6: Run GREEN and TypeScript**

Run: `node scripts/verify-italy-page.mjs && node scripts/verify-directory-navigation.mjs && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/app src/components scripts/verify-italy-page.mjs scripts/verify-directory-navigation.mjs
git commit -m "Add Italy US LLM directory page"
```

---

### Task 4: Complete Four-Language Italy Translations

**Files:**
- Create: `data/italy-translations.json`
- Create: `scripts/verify-italy-translations.mjs`
- Modify: `src/lib/text-utils.ts`
- Modify: `src/components/pages/italy-home-page.tsx`
- Modify: `src/components/italy-map.tsx`
- Test: `scripts/verify-italy-translations.mjs`

**Interfaces:**
- Produces: complete `en`, `es`, and `de` mappings for every dataset-backed Italy value and four-language Italy UI copy.

- [ ] **Step 1: Write the failing translation coverage test**

Collect every user-facing string from the Italy database and map points. Require a non-empty translation in `en`, `es`, and `de`; require all official Italian and U.S. institution names to map to themselves; add semantic sentinels for `No Fee`, Roma Tre annual confirmation, bar eligibility, 50% reductions, and Italian tuition remaining payable.

- [ ] **Step 2: Run RED**

Run: `npm run translations:verify:italy`

Expected: FAIL because `italy-translations.json` does not exist.

- [ ] **Step 3: Add complete translations and lookup support**

Import `italy-translations.json` in `text-utils.ts` and resolve it before general translations. Translate all page, map, card, filter, simulator, reliability, source, and missing-information copy. Preserve all official names, amounts, dates, percentages, tests, and uncertainty.

- [ ] **Step 4: Run GREEN and all locale regressions**

Run: `npm run translations:verify:italy && npm run translations:verify:germany && npm run translations:verify:data && npm run translations:verify:de && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add data/italy-translations.json scripts/verify-italy-translations.mjs src/lib/text-utils.ts src/components/pages/italy-home-page.tsx src/components/italy-map.tsx package.json
git commit -m "Translate Italy LLM directory"
```

---

### Task 5: Browser Verification, Production Build, and Deployment

**Files:**
- Create: `scripts/verify-italy-integration.mjs`
- Modify: `scripts/verify-final-fixes.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: repeatable end-to-end proof and a production deployment.

- [ ] **Step 1: Write the failing Playwright journey**

Self-start Next.js on a dedicated port. Verify desktop and 390×844 mobile flows for:

```text
header → /italy → Italy map → U.S. map → filters → search → card → detail → back
```

Exercise LUISS–Fordham, Trento–Cincinnati, LUM–Indiana, Cattolica–Berkeley, and Roma Tre–Cardozo. Assert visible `to_confirm` wording, no-additional-partner-fee wording, a 50% discount, translated search in all four languages, persistent locale, simulator presence, and no horizontal overflow or console errors.

- [ ] **Step 2: Run RED**

Run: `npm run test:integration:italy`

Expected: FAIL on the first unimplemented Italy interaction.

- [ ] **Step 3: Fix only verified integration gaps**

Make narrowly scoped accessibility, wrapping, search-index, route, or copy fixes revealed by the browser journey. Do not redesign shared components or alter existing country data.

- [ ] **Step 4: Run the complete verification matrix**

Run:

```powershell
npm run data:verify:italy
npm run translations:verify:italy
npm run test:integration:italy
npm run data:verify:germany
npm run translations:verify:germany
npm run test:integration:germany
npm run verify:de
npm run test:final-fixes
npx tsc --noEmit
npm run build
```

Expected: every command exits 0.

- [ ] **Step 5: Commit, push, and deploy**

Check `git diff --check`, commit any final scoped fixes, fetch `origin/master`, require `origin/master` to be an ancestor of the branch, push the feature branch, fast-forward `master`, and poll GitHub deployment statuses until Vercel reports `Production: success` with an environment URL.
