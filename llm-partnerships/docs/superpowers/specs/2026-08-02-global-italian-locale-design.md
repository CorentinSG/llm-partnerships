# Global Italian Locale Design

## Goal

Add Italian as a fifth complete interface language across the entire LL.M. Partnerships site. The locale must cover every public page, reusable component, interactive state, form label, map, filter, cost simulator, and all partnership data for the France–U.S., Germany–U.S., and Italy–U.S. directories.

## User experience

- Add `IT` / `Italiano` to the existing language switch on desktop and mobile.
- Persist the selected language through the existing local-storage mechanism and set `<html lang="it">`.
- Keep all routes and navigation behavior unchanged.
- Preserve official university, school, degree, program, and language-test names when translation would alter an official proper name.
- Translate explanatory prose, categories, specialties, statuses, financial information, requirements, deadlines, buttons, labels, empty states, and accessibility text.

## Architecture

Extend `UiLanguage` from four to five values and add an `it` entry to each existing localized copy object. Add Italian entries to the three data-translation dictionaries and make `translateDataText` resolve them through the same precedence rules already used for English, Spanish, and German. No runtime translation service will be introduced.

The header will keep its responsive behavior. The added language button must remain usable at desktop and mobile widths without hiding or overflowing navigation.

## Verification

- A structural verifier will inventory localized objects and fail when the Italian locale is absent from required pages/components.
- Data verifiers will require a non-empty Italian mapping for every user-visible value in all three directories.
- A browser integration test will select Italian, verify `<html lang="it">`, exercise every route, search/filter translated data, open partnership details, and verify mobile persistence.
- Existing French, English, Spanish, and German suites plus the production build must remain green.

## Delivery

Commit on `codex/italian-locale`, push the branch, fast-forward `master` only when safe, deploy the linked Vercel project to production, and verify a public route in Italian.
