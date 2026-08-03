# Country Directory Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace five country-directory header links with one accessible, localized selector optimized for desktop and mobile.

**Architecture:** A focused `CountryDirectoryMenu` component owns route resolution and Radix Select navigation. `SiteHeader` supplies localized copy and controls the surrounding mobile sheet so a country selection closes every open layer. Existing routes and page content remain unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Radix Select, Tailwind CSS, Playwright.

## Global Constraints

- Preserve `/`, `/germany`, `/italy`, `/uk`, and `/switzerland` exactly.
- Preserve all non-country header links, language controls, theme controls, typography, and header height.
- Support French, English, Spanish, German, and Italian labels.
- Mobile touch targets are at least 44px high and must not overflow at widths from 320px through 1680px.
- No new dependency or design system.

---

### Task 1: Specify selector behavior in tests

**Files:**
- Modify: `scripts/verify-directory-navigation.mjs`

**Interfaces:**
- Consumes: existing Next.js routes and `SiteHeader` rendering.
- Produces: failing assertions for `CountryDirectoryMenu`, active route state, keyboard navigation, mobile sheet closure, and responsive overflow.

- [ ] **Step 1: Replace source assertions for duplicated links**

Assert that the header imports and renders `CountryDirectoryMenu` twice, supplies all five route records once, and no longer directly renders five country `<Link>` elements.

- [ ] **Step 2: Expand localized browser copy**

Add localized `country` and all five country-pair labels for `fr`, `en`, `es`, `de`, and `it`.

- [ ] **Step 3: Add desktop behavior checks**

At 1680px, open the country combobox, verify five options, verify France is selected on `/`, use ArrowDown and Enter to navigate to `/germany`, and verify Germany becomes selected.

- [ ] **Step 4: Add mobile behavior checks**

At 320px, 360px, 390px, 768px, 1024px, and 1440px, open the sheet, verify the full-width country combobox and five options, select Germany, verify `/germany`, verify the sheet closes, and verify no horizontal overflow.

- [ ] **Step 5: Run the test and confirm the expected failure**

Run: `node scripts/verify-directory-navigation.mjs`

Expected: FAIL because `CountryDirectoryMenu` and the `Pays`/`Country` selector do not exist yet.

### Task 2: Implement the country selector and integrate the header

**Files:**
- Create: `src/components/country-directory-menu.tsx`
- Modify: `src/components/site-header.tsx`
- Test: `scripts/verify-directory-navigation.mjs`

**Interfaces:**
- Consumes: `label: string`, `directories: Array<{ href: string; label: string }>`, `mobile?: boolean`, and `onNavigate?: () => void`.
- Produces: `CountryDirectoryMenu` with route-aware selection and navigation.

- [ ] **Step 1: Create route-aware selector**

Use `usePathname`, `useRouter`, and the existing Select primitives. Resolve an active option only when `pathname` exactly equals a directory route. On value change, call `onNavigate?.()` and then `router.push(href)`.

- [ ] **Step 2: Apply responsive and accessible presentation**

Give the trigger an accessible name combining the selector label and active directory. Use a compact desktop trigger and a full-width mobile trigger with `min-h-11`. Keep content within `calc(100vw - 2rem)`, allow long option labels to wrap, and use Radix's built-in check indicator and keyboard behavior.

- [ ] **Step 3: Integrate localized copy**

Add `country` to every language object in `site-header.tsx`, define the five routes from existing translated names, replace desktop country links with one menu, and replace mobile country links with the full-width menu.

- [ ] **Step 4: Control mobile sheet closure**

Add `mobileMenuOpen` state to `SiteHeader`, bind it to `Sheet open`/`onOpenChange`, and pass `onNavigate={() => setMobileMenuOpen(false)}` to the mobile selector.

- [ ] **Step 5: Run focused navigation verification**

Run: `node scripts/verify-directory-navigation.mjs`

Expected: PASS with selector behavior verified across all requested widths and languages.

- [ ] **Step 6: Commit the implementation**

```powershell
git add src/components/country-directory-menu.tsx src/components/site-header.tsx scripts/verify-directory-navigation.mjs
git commit -m "feat: consolidate country directory navigation"
```

### Task 3: Regression verification and production release

**Files:**
- Modify only if a regression is demonstrated by a failing test.

**Interfaces:**
- Consumes: completed selector integration.
- Produces: verified build, pushed `master`, and ready Vercel production deployment.

- [ ] **Step 1: Run locale and directory regressions**

Run the German, Italian, UK, Swiss, and final-fixes verification scripts plus `node scripts/verify-directory-navigation.mjs`.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: exit code 0 and all application routes generated.

- [ ] **Step 3: Inspect diff and working tree**

Run: `git diff --check` and `git status --short`. Preserve the pre-existing untracked `vercel-login.log`.

- [ ] **Step 4: Push and deploy**

Push the feature branch and `HEAD:master`, deploy the linked Vercel project with `npx vercel --prod --yes`, and wait for `READY`.

- [ ] **Step 5: Verify production**

Use `vercel curl` on `/`, `/germany`, and `/switzerland`, then confirm the selector and all five country labels are present in the production HTML/client payload.
