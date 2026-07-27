# German Site Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete, persistent German locale to every route, shared component, and partnership dataset without changing the existing site structure or other translations.

**Architecture:** Extend the existing `UiLanguage` union, language provider, locale-indexed copy objects, and JSON translation dictionaries with `de`. Keep the current client-side locale model and `translateDataText` fallback, then enforce completeness through source-scanning, dataset-coverage, browser, and production-build checks.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JSON translation dictionaries, Node.js assertion scripts, Playwright.

## Global Constraints

- German is the fourth locale: `fr | en | es | de`.
- Preserve all current routes, layout, content, and behavior.
- Preserve official names of universities, law schools, degrees, named programs, tests, organizations, and branded services.
- Use idiomatic formal German and preserve all legal, financial, eligibility, reliability, and “to be confirmed” qualifications.
- Do not remove or rewrite existing French, English, or Spanish translations.
- Selecting German must update the current route immediately, persist in local storage, and set `document.documentElement.lang` to `de`.
- Dataset translation fallback may display cleaned source text at runtime, but automated verification must fail for every missing required German mapping.

---

## File Structure

- `scripts/verify-german-locale.mjs`: static contract for the locale union, selector, provider, and German entries in all locale-indexed source files.
- `scripts/verify-data-translations.mjs`: recursively derives required display strings from the France and alternatives datasets and verifies German coverage and protected proper names.
- `scripts/verify-germany-translations.mjs`: extends the existing German-directory dataset contract to `de`.
- `scripts/verify-german-integration.mjs`: Playwright journey through every route category in German.
- `data/text-translations.json`: German translations for France-directory and shared dataset values.
- `data/germany-translations.json`: German translations for Germany-directory dataset values.
- `src/lib/text-utils.ts`: four-language type and translation lookup.
- `src/components/language-provider.tsx`: validates, persists, and applies `de`.
- `src/components/site-header.tsx`: exposes `DE` / `Deutsch` on desktop and mobile.
- Existing locale-indexed files under `src/app`, `src/components`, and `src/lib`: add German UI copy without restructuring components.
- `package.json`: exposes focused and aggregate German verification commands.

---

### Task 1: German Locale Contract and Global Language Control

**Files:**
- Create: `scripts/verify-german-locale.mjs`
- Modify: `src/lib/text-utils.ts`
- Modify: `src/components/language-provider.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing `UiLanguage`, `LanguageProvider`, and `LanguageSwitch`.
- Produces: `UiLanguage = "fr" | "en" | "es" | "de"` and a globally available `Deutsch` selection persisted under `llm-partnerships-language`.

- [ ] **Step 1: Write the failing locale contract**

Create a Node assertion script that reads the three source files and checks exact German plumbing:

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const textUtils = read("src/lib/text-utils.ts")
const provider = read("src/components/language-provider.tsx")
const header = read("src/components/site-header.tsx")

assert.match(textUtils, /"fr"\s*\|\s*"en"\s*\|\s*"es"\s*\|\s*"de"/)
assert.match(provider, /stored === "de"/)
assert.match(header, /de:\s*"DE"/)
assert.match(header, /de:\s*"Deutsch"/)
assert.match(header, /\["fr",\s*"en",\s*"es",\s*"de"\]/)
console.log("German locale plumbing verified")
```

Add `"translations:verify:de": "node scripts/verify-german-locale.mjs"` to `package.json`.

- [ ] **Step 2: Run the contract and verify RED**

Run: `npm run translations:verify:de`

Expected: FAIL on the missing German member in `UiLanguage`.

- [ ] **Step 3: Implement minimal global German plumbing**

Extend the locale union in `text-utils.ts`. Accept `stored === "de"` in the provider. Add:

```ts
de: "DE"
```

and:

```ts
de: "Deutsch"
```

to the header labels, add `de: { aria: "Sprache ändern", label: "Sprache" }`, append `"de"` to the selector list, and add German header navigation copy:

```ts
de: {
  subtitle: "Verzeichnis der Partnerschaften",
  about: "Über das Projekt",
  guide: "USA-Ratgeber",
  alternatives: "Alternative Wege",
  submit: "Information einreichen",
  submitShort: "Einreichen",
  franceUs: "Frankreich–USA",
  germanyUs: "Deutschland–USA",
  menu: "Menü",
}
```

- [ ] **Step 4: Run the contract and type-check**

Run: `npm run translations:verify:de`

Expected: PASS with `German locale plumbing verified`.

Run: `npx tsc --noEmit`

Expected: FAIL with missing `de` properties in locale-indexed copy objects. This is the intended RED signal for Task 2.

- [ ] **Step 5: Commit**

```powershell
git add package.json scripts/verify-german-locale.mjs src/lib/text-utils.ts src/components/language-provider.tsx src/components/site-header.tsx
git commit -m "Add German locale plumbing"
```

---

### Task 2: German Copy for Every Page and Shared Component

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/guide/page.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/components/alternative-card.tsx`
- Modify: `src/components/cost-simulator.tsx`
- Modify: `src/components/filters/filters-panel.tsx`
- Modify: `src/components/filters/multi-select-filter.tsx`
- Modify: `src/components/founder-faq.tsx`
- Modify: `src/components/france-map.tsx`
- Modify: `src/components/germany-map.tsx`
- Modify: `src/components/pages/alternatives-page.tsx`
- Modify: `src/components/pages/germany-home-page.tsx`
- Modify: `src/components/pages/home-page.tsx`
- Modify: `src/components/pages/partnership-detail-page.tsx`
- Modify: `src/components/pages/submit-information-form.tsx`
- Modify: `src/components/page-shell.tsx`
- Modify: `src/components/partnership-card.tsx`
- Modify: `src/components/partnership-details.tsx`
- Modify: `src/components/partnership-dialog.tsx`
- Modify: `src/components/reliability-badge.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/stats-bar.tsx`
- Modify: `src/components/theme-toggle.tsx`
- Modify: `src/components/tuition-badges.tsx`
- Modify: `src/components/us-lawyer-path.tsx`
- Modify: `src/components/us-map.tsx`
- Modify: `src/lib/partnership-details-copy.ts`
- Modify: `src/lib/tuition-offers.ts`
- Test: `scripts/verify-german-locale.mjs`

**Interfaces:**
- Consumes: four-member `UiLanguage` from Task 1.
- Produces: a complete `de` branch for every locale-indexed UI copy object.

- [ ] **Step 1: Extend the failing static contract to enumerate every locale-indexed file**

Add a `localizedFiles` array containing every file listed above and assert that each contains a German branch:

```js
for (const path of localizedFiles) {
  const source = read(path)
  assert.match(source, /\bde\s*:/, `${path} must contain German copy`)
}
```

Also assert that source files no longer use a three-way language fallback:

```js
for (const path of localizedFiles) {
  assert.doesNotMatch(
    read(path),
    /language\s*===\s*"fr"[\s\S]{0,300}language\s*===\s*"en"[\s\S]{0,300}:/,
    `${path} must define German behavior explicitly`,
  )
}
```

- [ ] **Step 2: Run the static contract and verify RED**

Run: `npm run translations:verify:de`

Expected: FAIL naming the first page or shared component without German copy.

- [ ] **Step 3: Add idiomatic German copy to all listed files**

For every existing `{ fr, en, es }` copy object, add a structurally identical `de` object. Translate every user-visible label, paragraph, button, status, tooltip, placeholder, empty state, form validation message, map instruction, simulator description, and accessibility label. Keep interpolation tokens, numeric values, JSX structure, and keys identical.

Use these terminology rules consistently:

```ts
{
  partnership: "Partnerschaft",
  partnerships: "Partnerschaften",
  tuition: "Studiengebühren",
  scholarship: "Stipendium",
  fullWaiver: "Vollständiger Erlass",
  partialReduction: "Teilweise Ermäßigung",
  confirmed: "Bestätigt",
  probable: "Wahrscheinlich",
  toBeConfirmed: "Zu bestätigen",
  application: "Bewerbung",
  admissionRequirements: "Zulassungsvoraussetzungen",
  languageTests: "Sprachnachweise",
}
```

Preserve branded and academic names such as `LL.M.`, `TOEFL`, `IELTS`, `Duolingo English Test`, `LSAC`, university names, and degree titles.

- [ ] **Step 4: Verify the static contract and TypeScript**

Run: `npm run translations:verify:de`

Expected: PASS.

Run: `npx tsc --noEmit`

Expected: PASS with exit code 0 and no missing `de` properties.

- [ ] **Step 5: Commit**

```powershell
git add scripts/verify-german-locale.mjs src/app src/components src/lib/partnership-details-copy.ts src/lib/tuition-offers.ts
git commit -m "Translate all interface copy into German"
```

---

### Task 3: German Coverage for France and Alternatives Data

**Files:**
- Create: `scripts/verify-data-translations.mjs`
- Modify: `data/text-translations.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: `data/database.json`, `data/alternatives.json`, and the existing `translateDataText(value, language)` lookup.
- Produces: `text-translations.json.de`, mapping every required display string to non-empty German text.

- [ ] **Step 1: Write the failing recursive dataset verifier**

Create a verifier that recursively collects non-empty strings, excludes identifiers, URLs, attachment paths, and official proper-name fields, then requires German mappings:

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const load = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"))
const database = load("data/database.json")
const alternatives = load("data/alternatives.json")
const translations = load("data/text-translations.json")
const ignoredKeys = new Set([
  "id", "url", "sourceUrl", "officialUrl", "applicationUrl",
  "attachmentUrl", "frenchUniversity", "partnerUniversity", "degree",
  "test", "name",
])
const values = new Set()

function collect(value, key = "") {
  if (ignoredKeys.has(key)) return
  if (typeof value === "string") {
    const clean = value.trim()
    if (clean && !/^https?:\/\//.test(clean) && clean !== "fr") values.add(clean)
    return
  }
  if (Array.isArray(value)) return value.forEach((item) => collect(item, key))
  if (value && typeof value === "object") {
    for (const [childKey, child] of Object.entries(value)) collect(child, childKey)
  }
}

collect(database)
collect(alternatives)
assert.equal(typeof translations.de, "object", "German data translations must exist")
const missing = [...values].filter(
  (value) => typeof translations.de[value] !== "string" || !translations.de[value].trim(),
)
assert.deepEqual(missing, [], `Missing German data translations:\n${missing.join("\n")}`)
console.log(`General German data translations verified: ${values.size} values`)
```

Add `"translations:verify:data": "node scripts/verify-data-translations.mjs"` to `package.json`.

- [ ] **Step 2: Run the dataset verifier and verify RED**

Run: `npm run translations:verify:data`

Expected: FAIL with `German data translations must exist`.

- [ ] **Step 3: Add the complete German dictionary**

Add a top-level `"de"` object to `data/text-translations.json`. Provide one non-empty, faithful German translation for every key reported by the verifier. Preserve uncertainty markers, admissions thresholds, monetary figures, deadlines, percentages, and proper names verbatim. Do not copy the French source as the German value except for language-independent terms and protected names.

Update `translateDataText` typing in `src/lib/text-utils.ts` only if TypeScript inference requires the new JSON member; retain lookup order and cleaned-source fallback.

- [ ] **Step 4: Run focused and regression checks**

Run: `npm run translations:verify:data`

Expected: PASS with the exact number of covered values.

Run: `npm run translations:verify:de && npx tsc --noEmit`

Expected: both PASS.

- [ ] **Step 5: Commit**

```powershell
git add data/text-translations.json scripts/verify-data-translations.mjs src/lib/text-utils.ts package.json
git commit -m "Translate France and alternatives data into German"
```

---

### Task 4: German Coverage for Germany Directory Data

**Files:**
- Modify: `scripts/verify-germany-translations.mjs`
- Modify: `data/germany-translations.json`

**Interfaces:**
- Consumes: the existing `values` set derived from `getAllGermanPartnerships()` and `getGermanUniversitiesPoints()`.
- Produces: `germany-translations.json.de`, including protected German institution-name identity mappings.

- [ ] **Step 1: Extend the existing verifier to German**

Change both locale loops from:

```js
["en", "es"]
```

to:

```js
["en", "es", "de"]
```

Add exact semantic sentinels:

```js
assert.equal(translations.de["États-Unis"], "Vereinigte Staaten")
assert.equal(translations.de["Amérique du Nord"], "Nordamerika")
assert.equal(
  translations.de["Échange créditable vers un LL.M."],
  "Austausch mit anrechenbaren Leistungen für einen LL.M.",
)
assert.match(
  translations.de[
    "Une nomination crée une éligibilité à la bourse, pas un droit à 50 % ni une garantie d’admission."
  ],
  /berechtigt.*Stipendium.*weder.*50.*Zulassung/i,
)
```

Update the completion message to mention `EN, ES and DE`.

- [ ] **Step 2: Run the Germany verifier and verify RED**

Run: `npm run translations:verify:germany`

Expected: FAIL because `translations.de` is absent.

- [ ] **Step 3: Add the complete Germany German dictionary**

Add a top-level `"de"` object to `data/germany-translations.json`. Translate every value reported missing. For each German institution name collected from `getGermanUniversitiesPoints()`, map the source string to itself. Preserve exact program names, universities, tests, figures, discounts, uncertainty, and non-guarantee language.

- [ ] **Step 4: Run all data translation checks**

Run: `npm run translations:verify:germany`

Expected: PASS with `Germany translations verified: … values mapped in EN, ES and DE`.

Run: `npm run translations:verify:data`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add data/germany-translations.json scripts/verify-germany-translations.mjs
git commit -m "Translate Germany partnership data into German"
```

---

### Task 5: Full German Browser Journey and Production Verification

**Files:**
- Create: `scripts/verify-german-integration.mjs`
- Modify: `package.json`
- Modify only if the browser test exposes overflow: the directly affected component or `src/app/globals.css`

**Interfaces:**
- Consumes: complete German UI and data dictionaries from Tasks 1–4.
- Produces: repeatable end-to-end proof for selection, persistence, route coverage, localized search, responsive navigation, and absence of runtime errors.

- [ ] **Step 1: Write the failing Playwright journey**

Start from the structure used by `verify-germany-integration.mjs`. The new script must:

```js
await page.goto(baseUrl)
await page.getByRole("button", { name: "Deutsch" }).click()
assert.equal(await page.locator("html").getAttribute("lang"), "de")
assert.equal(
  await page.evaluate(() => localStorage.getItem("llm-partnerships-language")),
  "de",
)
await expect(page.getByText("Frankreich–USA", { exact: true })).toBeVisible()
```

Then visit `/`, `/germany`, a France partnership detail, a Germany partnership detail, `/about`, `/guide`, `/alternatives`, `/submit`, and a nonexistent route. On each route, assert one route-specific German heading or control. Reload one route and confirm German persists. Search for a German-translated dataset term on both directories and assert at least one result. Repeat the selector and navigation checks at a mobile viewport of `390 × 844`. Capture console errors and fail unless the list is empty.

Add:

```json
"test:integration:de": "node scripts/verify-german-integration.mjs",
"verify:de": "npm run translations:verify:de && npm run translations:verify:data && npm run translations:verify:germany && npm run test:integration:de"
```

- [ ] **Step 2: Run the browser journey and verify RED**

Run the development server in a separate process:

```powershell
npm run dev
```

Run: `npm run test:integration:de`

Expected: FAIL on the first missing or mismatched German route assertion, proving the journey detects incomplete coverage.

- [ ] **Step 3: Correct only failures exposed by the journey**

Add any genuinely missing German string to its existing locale copy object or dictionary. If a German label overflows, permit wrapping with existing Tailwind utilities such as `whitespace-normal`, `min-w-0`, or responsive width adjustments on the affected element only. Do not redesign, reorder, or remove current content.

- [ ] **Step 4: Run full fresh verification**

Run: `npm run verify:de`

Expected: all four German checks PASS.

Run: `npm run data:verify:germany && npm run test:final-fixes && npm run designer:verify`

Expected: all existing regression checks PASS.

Run: `npx tsc --noEmit`

Expected: exit code 0.

Run: `npm run build`

Expected: Next.js production build completes with exit code 0.

- [ ] **Step 5: Review requirements and commit**

Check `git diff --check`, inspect `git diff --stat`, and verify that only German translation, test, documentation, or narrowly required responsive files changed.

```powershell
git add package.json scripts data src
git commit -m "Add complete German site translation"
```

- [ ] **Step 6: Publish and verify deployment**

Push the current branch, fast-forward `master` only after confirming it has no divergent commits, and query GitHub deployment statuses for the pushed SHA. Acceptance requires a successful Vercel `Production` deployment with a non-empty environment URL.

