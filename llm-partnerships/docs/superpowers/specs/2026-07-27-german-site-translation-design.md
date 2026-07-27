# German Site Translation Design

## Goal

Add German as a complete fourth language across the existing site while preserving its current content, layout, routes, and behavior. Users must be able to select `Deutsch` from the global language control and read every user-facing interface string and partnership data value in German.

## Scope

The German locale covers every existing route:

- France–United States directory and partnership detail pages
- Germany–United States directory and partnership detail pages
- alternatives, guide, about, and submission pages
- shared header, footer, navigation, theme control, maps, statistics, filters, cards, dialogs, badges, cost simulator, informational panels, empty states, validation, and error text

It also covers user-facing values sourced from the French and German partnership datasets and the alternatives dataset.

Official proper names remain in their official form. This includes universities, law schools, degrees, named programs, tests, organizations, and branded services. URLs, monetary amounts, dates whose format is already intentionally fixed, and source quotations or document titles remain unchanged unless the existing translation model already localizes them.

## Architecture

The implementation extends the existing locale union and per-component copy objects from `fr | en | es` to `fr | en | es | de`. It does not introduce a new translation framework or change routing.

The global language provider continues to own the selected locale, persist it in local storage, and update the document language attribute. The header adds `Deutsch` to the same selector used for the other languages.

Static interface copy receives a `de` entry wherever locale-indexed copy currently exists. Dataset-backed text receives German mappings in the existing translation JSON files. Translation lookup continues through the existing `translateDataText` utility, including recursive handling of supported values and fallback behavior.

## Translation Rules

- German copy must be idiomatic, concise, and suitable for a university information service.
- Formal address uses `Sie` where direct address is necessary.
- Legal and academic terminology must preserve the meaning and certainty level of the French source.
- Warnings such as “to be confirmed,” reliability labels, and eligibility caveats must not be softened.
- German and other official institution names remain unchanged.
- Search must match both original values and their German display translations, following the behavior already implemented for English and Spanish.
- No French, English, or Spanish translation may be removed or rewritten as part of this change.

## User Experience

The language selector presents four choices consistently on desktop and mobile. Selecting German updates the current page immediately without navigation or loss of filters. The choice persists across routes and browser reloads.

Longer German labels must fit existing responsive layouts. Only narrowly scoped spacing or wrapping adjustments may be made where German copy exposes an overflow; the visual design itself remains unchanged.

## Failure and Fallback Behavior

If a dataset value has no German mapping, the existing safe fallback displays the cleaned source value rather than an empty string or runtime error. Automated coverage must nevertheless treat missing required German dataset mappings as a failure so omissions are caught before deployment.

Malformed stored locale values remain ignored. Existing locale behavior and persistence remain unchanged for French, English, and Spanish.

## Testing and Verification

Implementation follows test-first development:

1. Extend translation-verification scripts so they fail while German support or required mappings are absent.
2. Add focused assertions for the locale union, selector, persistence, document `lang`, shared copy, page copy, and dataset coverage.
3. Add or extend browser verification to select `Deutsch`, navigate through every route category, exercise search and representative controls, and confirm translated content.
4. Implement the minimum code and data changes required to pass.
5. Run all translation checks, the full test suite, lint if configured, and a production build.

Acceptance criteria:

- `Deutsch` is available from every page through the global selector.
- Every visible interface string on every route has German copy.
- Required dataset-backed text for both country directories and alternatives has German coverage.
- Proper names remain unchanged.
- German search, persistence, and `lang="de"` work.
- Existing French, English, and Spanish behavior remains intact.
- All automated checks and the production build pass.

## Delivery

After verification, the change will be committed, pushed to the production branch, and the Vercel deployment status checked. No unrelated files or existing user changes will be modified.
