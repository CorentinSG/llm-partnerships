# Germany Directory Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the 27 reliable, active Germany–U.S. LL.M. destination cards supported by the supplied research sheet.

**Architecture:** Keep the existing country-directory architecture. Replace the German canonical dataset, extend its translation dictionary, update Germany-specific page copy and warnings, and let the existing loaders, maps, filters, details, and simulator consume the expanded data.

**Tech Stack:** Next.js, React, TypeScript, JSON datasets, Node assertion scripts, Playwright.

## Global Constraints

- Do not change the France, Italy, UK, or Switzerland datasets or page behavior.
- Publish only active sheet rows with reliability at least 4.
- Keep uncertain, expired, and one-sided cases out of the current-opportunity cards.
- Preserve all caveats about admission, scholarships, credit transfer, bar eligibility, dates, and stale prices.
- Translate every new visible value into English, Spanish, German, and Italian.
- Keep desktop and mobile behavior accessible and horizontally overflow-free.

---

### Task 1: Lock the expanded dataset contract

**Files:**
- Modify: `scripts/verify-germany-data.mjs`
- Modify: `scripts/verify-final-fixes.mjs`

**Interfaces:**
- Consumes: `data/germany-database.json`
- Produces: assertions for 13 faculties, 27 pathways, required additions, explicit exclusions, and unchanged country counts

- [ ] **Step 1: Write the failing assertions** for the new counts, required IDs, exclusion IDs, valid source hosts, and simulator union.
- [ ] **Step 2: Run `node scripts/verify-germany-data.mjs` and `node scripts/verify-final-fixes.mjs`** and confirm they fail because the current dataset still contains 8 faculties and 16 pathways.
- [ ] **Step 3: Do not alter production data until the expected red failures are captured.**

### Task 2: Replace the German canonical dataset and research ledger

**Files:**
- Modify: `data/germany-database.json`
- Modify: `docs/research/germany-us-llm-partnerships.md`

**Interfaces:**
- Consumes: the supplied sheet’s `Partnerschaften`, `Ausgeschlossene Abkommen`, and `Analysen` tabs
- Produces: the existing `PartnershipsDatabase` JSON shape consumed by `src/lib/germany-data.ts`

- [ ] **Step 1: Replace the obsolete faculty set with the 13 represented German faculties** and stable map coordinates.
- [ ] **Step 2: Build 27 destination-specific partnership records** from the 17 qualifying rows, retaining official links, deadlines, seats, tuition conditions, admission routes, language evidence, missing information, and source caveats.
- [ ] **Step 3: Record the sheet URL, selection rule, excluded IDs, and aggregate-row expansion in the research ledger.**
- [ ] **Step 4: Run `node scripts/verify-germany-data.mjs`** and correct only implementation defects until it passes.

### Task 3: Complete five-language data coverage

**Files:**
- Modify: `data/germany-translations.json`
- Modify: `scripts/verify-germany-translations.mjs`

**Interfaces:**
- Consumes: every visible canonical string returned by `getAllGermanPartnerships()` and `getGermanUniversitiesPoints()`
- Produces: exact `en`, `es`, `de`, and `it` dictionary entries keyed by French canonical text

- [ ] **Step 1: Extend the translation test to require Italian and semantic warning sentinels.**
- [ ] **Step 2: Run `node scripts/verify-germany-translations.mjs`** and confirm it lists the newly missing strings.
- [ ] **Step 3: Add translations for every missing value, preserving official names and TOEFL/IELTS labels.**
- [ ] **Step 4: Re-run the Germany translation test and `npm run verify:it`** until both pass.

### Task 4: Update Germany page communication and browser behavior

**Files:**
- Modify: `src/components/pages/germany-home-page.tsx`
- Modify: `scripts/verify-germany-integration.mjs`

**Interfaces:**
- Consumes: 27 localized partnerships and 13 German map points
- Produces: localized scope copy, permanent warnings, paginated cards, maps, filters, details, and simulator behavior

- [ ] **Step 1: Update the browser assertions** for 27 results, pagination, new map markers, exclusions, warning visibility, and a 390px mobile viewport without horizontal overflow.
- [ ] **Step 2: Run `node scripts/verify-germany-integration.mjs`** and confirm the old page fails the new contract.
- [ ] **Step 3: Add the translated count/scope copy and warning panel** without changing the existing interaction structure.
- [ ] **Step 4: Re-run the browser integration test** until it passes.

### Task 5: Full verification and release

**Files:**
- Verify only: repository and production deployment

**Interfaces:**
- Consumes: completed Germany refresh
- Produces: passing build, pushed `master`, Ready production deployment, and browser-verified public page

- [ ] **Step 1: Run all Germany checks, final regressions, Italian coverage, TypeScript, and production build.**
- [ ] **Step 2: Commit only the Germany refresh files and push `master`.**
- [ ] **Step 3: Deploy production from the linked Vercel project root.**
- [ ] **Step 4: Verify the public Germany route on desktop and mobile, including 27 results, 13 map points, warnings, exclusions, and no horizontal overflow.**
