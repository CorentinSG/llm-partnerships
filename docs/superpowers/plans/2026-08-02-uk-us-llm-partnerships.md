# UK–U.S. LL.M. Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add, translate, test, publish, and deploy a standalone UK–U.S. LL.M. partnership directory that mirrors the existing country directories.

**Architecture:** Reuse the established country data-adapter, map, localized home-page, and shared detail-page interfaces. Keep UK data and translations isolated in new files, then add only the navigation, description, detail resolver, and package-script hooks needed to expose them.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JSON datasets, d3-geo, Node assertion scripts, Playwright, Vercel CLI.

## Global Constraints

- Preserve every existing France, Germany, and Italy record and behavior.
- Use only official institutional pages to corroborate the supplied Google Doc.
- Present 4 institutional partnerships and 5 LL.M. pathways.
- Support FR, EN, ES, DE, and IT for every visible page string and dataset value.
- Make uncertainty, annual dates, tuition scope, and bar-exam limitations explicit.

---

### Task 1: Verified UK dataset and adapter

**Files:**
- Create: `llm-partnerships/scripts/verify-uk-data.mjs`
- Create: `llm-partnerships/data/uk-database.json`
- Create: `llm-partnerships/src/lib/uk-data.ts`
- Modify: `llm-partnerships/package.json`

**Interfaces:**
- Produces: `getAllUkPartnerships(): Partnership[]`, `getUkPartnershipById(id)`, `getUkUniversitiesPoints()`, and `getUkFilterOptions()`.

- [ ] **Step 1: Write the failing data verifier** asserting four institutions, five unique pathways, two Georgetown degrees, official HTTPS sources, valid coordinates, reliability labels, and the Dundee exchange warning.
- [ ] **Step 2: Run `npm run data:verify:uk`** and confirm failure because the dataset/adapter do not exist.
- [ ] **Step 3: Add the minimal source-grounded dataset and adapter** following the Italy adapter’s public API while keeping every uncertainty visible.
- [ ] **Step 4: Run `npm run data:verify:uk`** and confirm `UK dataset verified: 4 institutions, 5 pathways`.
- [ ] **Step 5: Commit** the verifier, dataset, adapter, and package script.

### Task 2: Complete five-language data translations

**Files:**
- Create: `llm-partnerships/scripts/verify-uk-translations.mjs`
- Create: `llm-partnerships/data/uk-translations.json`
- Modify: `llm-partnerships/src/lib/text-utils.ts`
- Modify: `llm-partnerships/package.json`

**Interfaces:**
- Consumes: all strings returned by `getAllUkPartnerships()` and `getUkUniversitiesPoints()`.
- Produces: complete `en`, `es`, `de`, and `it` dictionaries consumed by `translateDataText`.

- [ ] **Step 1: Write the failing translation verifier** that inventories every visible UK value and rejects missing or empty EN/ES/DE/IT mappings.
- [ ] **Step 2: Run `npm run translations:verify:uk`** and confirm failure because the dictionary is absent.
- [ ] **Step 3: Add faithful translations** for institutional metadata, pathway terms, tuition, admissions, reliability notes, and warnings; preserve proper names.
- [ ] **Step 4: Register the dictionary** in the shared data translator and run the verifier until it passes with the exact inventoried value count.
- [ ] **Step 5: Commit** the translation dictionary, registration, verifier, and package script.

### Task 3: UK page, map, navigation, and detail routing

**Files:**
- Create: `llm-partnerships/scripts/verify-uk-integration.mjs`
- Create: `llm-partnerships/data/uk.json`
- Create: `llm-partnerships/src/components/uk-map.tsx`
- Create: `llm-partnerships/src/components/pages/uk-home-page.tsx`
- Create: `llm-partnerships/src/app/uk/page.tsx`
- Modify: `llm-partnerships/src/components/site-header.tsx`
- Modify: `llm-partnerships/src/components/pages/partnership-detail-page.tsx`
- Modify: `llm-partnerships/src/app/partnership/[id]/page.tsx`
- Modify: `llm-partnerships/src/app/about/page.tsx`
- Modify: `llm-partnerships/src/components/pages/home-page.tsx`
- Modify: `llm-partnerships/src/components/pages/germany-home-page.tsx`
- Modify: `llm-partnerships/src/components/pages/italy-home-page.tsx`
- Modify: `llm-partnerships/package.json`

**Interfaces:**
- Consumes: UK data APIs and the shared `PartnershipCard`, filters, U.S. map, simulator, and detail page.
- Produces: `/uk`, UK detail resolution under `/partnership/[id]`, and localized desktop/mobile navigation.

- [ ] **Step 1: Write the failing integration verifier** for route files, five localized copy blocks, both navigation modes, UK detail origin/back-link, data resolver, map labels, and updated four-directory descriptions.
- [ ] **Step 2: Run `npm run test:integration:uk`** and confirm it fails on the missing route/components.
- [ ] **Step 3: Add the UK GeoJSON, map, home page, and App Router entry** by matching the Italy directory’s layout and interactions, with a visible 4-partnership/5-pathway explanation.
- [ ] **Step 4: Wire navigation, cross-directory CTAs, about copy, and dynamic details** without changing existing datasets or route semantics.
- [ ] **Step 5: Run the UK integration verifier** and then all Germany/Italy locale and integration verifiers.
- [ ] **Step 6: Commit** the page and integration changes.

### Task 4: Browser QA, regressions, push, and production deployment

**Files:**
- Modify: `llm-partnerships/scripts/verify-final-fixes.mjs`
- Create: `llm-partnerships/scripts/verify-uk-page.mjs`
- Modify: `llm-partnerships/package.json`

**Interfaces:**
- Produces: reproducible browser coverage and a verified production deployment.

- [ ] **Step 1: Write the failing browser verifier** for `/uk` in all five languages, search/filter behavior, mobile navigation, one detail page, and the `/uk` back-link.
- [ ] **Step 2: Start the production build locally and run the verifier**, confirming the first run fails before its required wiring is complete.
- [ ] **Step 3: Complete only the missing browser-facing behavior**, then run UK data, translation, integration, browser, existing regression, and `npm run build` checks.
- [ ] **Step 4: Update the final regression count** to include five UK pathways while leaving the existing 42/16/12 assertions intact.
- [ ] **Step 5: Commit, push the feature branch, fast-forward `master`, and push `master`** after confirming the diff contains no unrelated files.
- [ ] **Step 6: Deploy with `npx vercel --prod --yes`** using the existing project identity, verify `/uk` and one UK detail URL with `vercel curl`, and remove only the temporary link metadata created for deployment.
