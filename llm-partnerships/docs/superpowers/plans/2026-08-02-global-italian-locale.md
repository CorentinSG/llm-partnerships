# Global Italian Locale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Italian as a complete fifth locale across every public page, component, interactive state, and partnership-data field.

**Architecture:** Extend the existing `UiLanguage` union and local copy dictionaries with `it`, keeping the current client-side persistence and translation lookup flow. Add Italian mappings to all three data dictionaries and enforce completeness through structural, data, and Playwright integration verifiers.

**Tech Stack:** Next.js 16, React 19, TypeScript, JSON translation dictionaries, Node assertion scripts, Playwright.

## Global Constraints

- Use `it` as the locale code and `IT` / `Italiano` as its switch labels.
- Persist the locale through `llm-partnerships-language` and set `<html lang="it">`.
- Preserve official university, school, degree, program, and language-test names.
- Do not introduce a runtime translation service or change existing routes.
- Existing FR, EN, ES, and DE behavior must remain unchanged.

---

### Task 1: Italian locale contract and core plumbing

**Files:**
- Create: `scripts/verify-italian-locale.mjs`
- Modify: `src/lib/text-utils.ts`
- Modify: `src/components/language-provider.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/theme-toggle.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `UiLanguage = "fr" | "en" | "es" | "de" | "it"`
- Produces: persistent Italian selection through the existing `useLanguage()` API.

- [ ] **Step 1: Write the failing structural verifier**

The verifier must assert that `UiLanguage` contains `it`, the switch iterates over `it`, the header contains `IT` and `Italiano`, the provider accepts `it`, and the theme toggle has Italian accessible labels.

- [ ] **Step 2: Run the verifier and confirm the expected failure**

Run: `node scripts/verify-italian-locale.mjs`
Expected: FAIL because `it` is absent from `UiLanguage`.

- [ ] **Step 3: Implement the minimal locale plumbing**

Add `it` to `UiLanguage`, the provider validation list, language labels/names, switch iteration, header copy, and theme-toggle copy. Italian header navigation must read `Francia–Stati Uniti`, `Germania–Stati Uniti`, and `Italia–Stati Uniti`.

- [ ] **Step 4: Verify green and compile**

Run: `node scripts/verify-italian-locale.mjs && npx tsc --noEmit`
Expected: PASS and TypeScript exit 0 after all required copy objects receive an `it` entry in Task 2.

### Task 2: Translate all static interface copy

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/guide/page.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/components/alternative-card.tsx`
- Modify: `src/components/cost-simulator.tsx`
- Modify: `src/components/founder-faq.tsx`
- Modify: `src/components/france-map.tsx`
- Modify: `src/components/germany-map.tsx`
- Modify: `src/components/italy-map.tsx`
- Modify: `src/components/pages/alternatives-page.tsx`
- Modify: `src/components/pages/germany-home-page.tsx`
- Modify: `src/components/pages/home-page.tsx`
- Modify: `src/components/pages/italy-home-page.tsx`
- Modify: `src/components/pages/submit-information-form.tsx`
- Modify: `src/components/partnership-card.tsx`
- Modify: `src/components/partnership-dialog.tsx`
- Modify: `src/components/reliability-badge.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/stats-bar.tsx`
- Modify: `src/components/tuition-badges.tsx`
- Modify: `src/components/us-lawyer-path.tsx`
- Modify: `src/components/us-map.tsx`
- Modify: `src/lib/partnership-details-copy.ts`
- Modify: `src/lib/tuition-offers.ts`

**Interfaces:**
- Consumes: `UiLanguage` with `it` from Task 1.
- Produces: a complete `it` member in every user-facing localized copy object.

- [ ] **Step 1: Expand the structural verifier**

Inventory every file above and assert that its localized object includes an `it:` member. Add semantic checks for representative Italian phrases: `Informazioni sul progetto`, `Cerca una partnership`, `Torna alla ricerca`, `Nessun risultato`, and `Preventivo annuale LL.M.`.

- [ ] **Step 2: Run the verifier and confirm it lists files without Italian copy**

Run: `node scripts/verify-italian-locale.mjs`
Expected: FAIL with one or more missing `it` sections.

- [ ] **Step 3: Add idiomatic Italian copy to every listed object**

Translate all visible labels, descriptions, accessibility labels, empty states, form validation messages, filters, maps, FAQ content, guide content, and cost-simulator explanations. Preserve legal abbreviations and official names.

- [ ] **Step 4: Verify structural completeness and TypeScript**

Run: `node scripts/verify-italian-locale.mjs && npx tsc --noEmit`
Expected: PASS.

### Task 3: Translate all directory data into Italian

**Files:**
- Modify: `data/text-translations.json`
- Modify: `data/germany-translations.json`
- Modify: `data/italy-translations.json`
- Modify: `src/lib/text-utils.ts`
- Create: `scripts/verify-italian-data-translations.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: all user-visible values returned by `getAllPartnerships`, `getAllGermanPartnerships`, and `getAllItalianPartnerships`.
- Produces: `it: Record<string, string>` in each dictionary and Italian lookup support in `translateDataText`.

- [ ] **Step 1: Write the failing data-completeness verifier**

Collect every string shown by the three adapters, including nested specialties, language-test details, missing-information values, notes, and attachments. Assert a non-empty Italian mapping for every value and exact sentinel mappings: `États-Unis → Stati Uniti`, `Amérique du Nord → America del Nord`, and `Non communiqué → Non comunicato`.

- [ ] **Step 2: Run the verifier and confirm missing `it` dictionaries**

Run: `node scripts/verify-italian-data-translations.mjs`
Expected: FAIL because the dictionaries do not yet expose `it`.

- [ ] **Step 3: Generate and review Italian mappings**

Seed shared translations from existing exact matches, translate the remaining French explanatory text to Italian in a one-time build script, preserve a protected set of institution/program/test names, and manually correct legal/financial sentinels concerning tuition waivers, scholarship non-guarantees, and bar eligibility. Remove the one-time generator after producing the JSON files.

- [ ] **Step 4: Wire Italian lookup and verify completeness**

Run: `node scripts/verify-italian-data-translations.mjs && npm run translations:verify:data && npm run translations:verify:germany && npm run translations:verify:italy`
Expected: all translation verifiers PASS.

### Task 4: Browser integration, regression, and delivery

**Files:**
- Create: `scripts/verify-italian-integration.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: the completed `it` locale and all dictionaries.
- Produces: `npm run test:integration:it` and `npm run verify:it`.

- [ ] **Step 1: Write the failing Playwright integration test**

Start Next.js on port 4176. Select `Italiano`, assert `<html lang="it">`, visit `/`, `/germany`, `/italy`, `/about`, `/guide`, `/alternatives`, `/submit`, one French detail, one German detail, one Italian detail, and the not-found route. Verify translated headings, search using `Stati Uniti`, correct back links, local-storage persistence, and the mobile language switch.

- [ ] **Step 2: Run it and confirm failure before the full locale is wired**

Run: `node scripts/verify-italian-integration.mjs`
Expected: FAIL on the first missing Italian UI or data assertion.

- [ ] **Step 3: Complete any wiring exposed by the browser test**

Fix only missing Italian copy, layout overflow, accessibility names, or persistence behavior demonstrated by the failing test.

- [ ] **Step 4: Run the full verification gate**

Run all data verifiers, translation verifiers, Italian structural/integration tests, existing German and Italy browser suites, `npx tsc --noEmit`, `npm run test:final-fixes`, `npm run build`, and `git diff --check` with fail-fast exit handling.
Expected: every command exits 0 and the build lists all existing routes.

- [ ] **Step 5: Commit, push, fast-forward master, and deploy**

Commit the implementation, push `codex/italian-locale`, verify `origin/master` is an ancestor before pushing `HEAD:master`, deploy the linked Vercel project with `npx vercel --prod --yes`, and verify an Italian production route using `vercel curl`.
