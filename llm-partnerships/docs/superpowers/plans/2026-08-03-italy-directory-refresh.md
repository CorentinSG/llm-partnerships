# Italy Directory Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the expanded and corrected Italy–United States LL.M. directory from the supplied 2026 spreadsheet.

**Architecture:** Keep the current Italy-specific JSON, adapter, map, and page. Update the normalized records and translations, then adjust only the Italy contracts and copy needed for the expanded directory.

**Tech Stack:** Next.js, React, TypeScript, JSON datasets, Node verification scripts, Vercel.

## Global Constraints

- Do not change existing France, Germany, UK, or Switzerland records.
- Publish 22 Italy route cards across 11 institutions.
- Exclude expired and reliability 2–3 records.
- Preserve qualified wording for pending approvals and bar eligibility.
- Support FR, EN, ES, DE, and IT without horizontal overflow.

---

### Task 1: Define the refreshed data contract

**Files:**
- Modify: `scripts/verify-italy-data.mjs`
- Modify: `scripts/verify-italy-integration.mjs`
- Modify: `scripts/verify-final-fixes.mjs`

- [ ] Change expected Italy counts and IDs to 22 routes and 11 institutions.
- [ ] Assert that Roma Tre–Cardozo is absent and LUISS–Temple/Suffolk are qualified.
- [ ] Run `npm run data:verify:it` and confirm it fails on the old 12-record dataset.

### Task 2: Refresh Italy records and map institutions

**Files:**
- Modify: `data/italy-database.json`
- Modify: `data/italy.json`
- Modify: `docs/research/italy-us-llm-sources.md`

- [ ] Update existing records with the spreadsheet's current annual facts.
- [ ] Add Bocconi, Genova, Parma, Firenze, Bologna, Roma Tre, and Federico II pathways.
- [ ] Remove the expired Cardozo pathway and document excluded/qualified cases.
- [ ] Run `npm run data:verify:it` and confirm it passes.

### Task 3: Localize every new value and update page copy

**Files:**
- Modify: `data/italy-translations.json`
- Modify: `src/components/pages/italy-home-page.tsx`
- Modify: `scripts/verify-italy-translations.mjs`

- [ ] Add translations for all new canonical values in EN, ES, DE, and IT.
- [ ] Update hero counts and add the application-warning panel in five languages.
- [ ] Run `npm run translations:verify:it` and confirm no value falls back.

### Task 4: Verify integration and production

**Files:**
- Modify: `scripts/verify-italy-page.mjs`

- [ ] Run Italy data, translation, integration, page, simulator, and regression checks.
- [ ] Run `npx tsc --noEmit` and `npm run build`.
- [ ] Verify `/italy` at desktop and 390px mobile widths.
- [ ] Commit, push `master`, deploy with `npx vercel --prod --yes`, and verify the production alias.
