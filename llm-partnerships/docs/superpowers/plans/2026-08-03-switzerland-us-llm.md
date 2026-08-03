# Switzerland–United States LL.M. Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone Switzerland–United States LL.M. partnership directory in French, English, Spanish, German, and Italian without altering the existing country directories.

**Architecture:** Reuse the established country-directory pattern: a normalized JSON dataset feeds a country adapter, filterable page, interactive country/U.S. maps, shared cards and detail pages. Publish only the six spreadsheet entries with reliability score 4 or 5; preserve explicit caveats for the Berkeley executive track, Fletcher bar exclusion, and Georgetown's lack of a Swiss-only admission advantage.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, d3-geo, Node verification scripts, Playwright.

## Global Constraints

- Preserve every existing France, Germany, Italy, and United Kingdom page and dataset.
- Add `/switzerland` as a separate directory and reuse `/partnership/[id]` for details.
- Include all page copy and data fields in FR, EN, ES, DE, and IT.
- Use only current official university or law-school sources for published claims.
- Mark all bar-exam statements as informational and subject to individual evaluation.
- Push the verified result to `master` and deploy it to the existing Vercel production project.

---

### Task 1: Contract tests

**Files:**
- Create: `scripts/verify-switzerland-data.mjs`
- Create: `scripts/verify-switzerland-translations.mjs`
- Create: `scripts/verify-switzerland-integration.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: the established database schema and country adapter conventions.
- Produces: executable checks for six published partnerships, four Swiss institutions, complete five-language coverage, `/switzerland`, maps, navigation, and detail routing.

- [ ] **Step 1: Write the failing tests**

  Assert six unique partnership IDs, the exact four Swiss institutions, HTTPS official sources, explicit caveats, complete translations, and all route/component hooks.

- [ ] **Step 2: Run tests to verify they fail**

  Run `npm run data:verify:switzerland`, `npm run translations:verify:switzerland`, and `npm run test:integration:switzerland`; expect missing-module or missing-file failures.

### Task 2: Dataset and translations

**Files:**
- Create: `data/switzerland-database.json`
- Create: `data/switzerland-translations.json`
- Create: `src/lib/switzerland-data.ts`
- Modify: `src/lib/text-utils.ts`

**Interfaces:**
- Produces: `getAllSwissPartnerships`, `getSwissPartnershipById`, `getSwissUniversitiesPoints`, and `getSwissFilterOptions`.

- [ ] **Step 1: Add the six publishable records**

  Include UZH–Berkeley, UZH–Cardozo, Lucerne–Notre Dame, Lucerne–Texas, St. Gallen–Fletcher, and Geneva Graduate Institute–Georgetown.

- [ ] **Step 2: Add complete EN/ES/DE/IT translations**

  Preserve official institution/program names while translating descriptions, admission, cost, status, missing-data, and warning fields.

- [ ] **Step 3: Run data and translation tests**

  Expect both verification scripts to pass with zero missing values.

### Task 3: Page, maps, routing, and navigation

**Files:**
- Create: `data/switzerland.json`
- Create: `src/components/switzerland-map.tsx`
- Create: `src/components/pages/switzerland-home-page.tsx`
- Create: `src/app/switzerland/page.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/pages/partnership-detail-page.tsx`
- Modify: `src/app/partnership/[id]/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: the Swiss adapter and shared filters, cards, U.S. map, simulator, and detail components.
- Produces: a fully localized `/switzerland` directory and Swiss detail-page back navigation.

- [ ] **Step 1: Implement the country map and directory page**

  Match the established responsive layout, filter behavior, result cards, map switch, reliability legend, and cost simulator.

- [ ] **Step 2: Wire routes and navigation**

  Add the fifth country link to desktop/mobile navigation, update about/metadata copy from four to five directories, and resolve Swiss IDs in the dynamic detail route.

- [ ] **Step 3: Run integration and browser checks**

  Verify all five locales, navigation, cards, maps, detail links, back links, responsive layout, and no regressions in existing country directories.

### Task 4: Production verification and release

**Files:**
- Modify: `docs/research/switzerland-us-llm-sources.md`

**Interfaces:**
- Produces: documented official sources, a clean production build, a pushed `master`, and a verified Vercel deployment.

- [ ] **Step 1: Run the complete verification suite**

  Run all country data/translation/integration scripts, locale checks, final regressions, designer verification, and `npm run build`; require exit code 0.

- [ ] **Step 2: Commit and push**

  Stage only Switzerland-related and necessary shared-file changes, commit, push the feature branch, fast-forward `master`, and push `master`.

- [ ] **Step 3: Deploy and inspect production**

  Deploy the existing Vercel project, request `/switzerland` and one Swiss detail URL, and confirm HTTP success plus expected localized content.

