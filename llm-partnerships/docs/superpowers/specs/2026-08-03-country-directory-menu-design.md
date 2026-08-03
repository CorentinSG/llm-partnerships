# Country directory menu design

## Goal

Replace the five always-visible country-directory links in the global header with one compact country selector. Keep every directory page, URL, and all unrelated navigation unchanged.

## Approved interaction

- The desktop header exposes one trigger labelled with the localized equivalent of `Pays`, followed by the active directory name and a downward chevron.
- Opening the trigger shows France–United States, Germany–United States, Italy–United States, United Kingdom–United States, and Switzerland–United States.
- The active directory is visually marked and announced to assistive technology.
- Selecting an entry navigates to its existing URL and closes the menu.
- On pages that are not country directories, the trigger keeps the neutral `Pays` label rather than implying that France is active.
- The mobile sheet contains the same selector instead of five separate country links. It is presented as a full-width, clearly labelled control near the top of the sheet so it can be reached comfortably with one hand. The remaining sheet links and language selector stay unchanged.

## Routes

| Directory | Route |
| --- | --- |
| France–United States | `/` |
| Germany–United States | `/germany` |
| Italy–United States | `/italy` |
| United Kingdom–United States | `/uk` |
| Switzerland–United States | `/switzerland` |

Nested partnership detail routes are not treated as a selected country because their origin is not available to the header. Their back links continue to identify the relevant directory.

## Component design

- Add a small `CountryDirectoryMenu` client component inside `site-header.tsx` or as a focused sibling file if the header becomes harder to scan.
- Reuse the project's existing Radix-based UI primitives and visual tokens. Do not introduce a second component system or alter the header's height, typography, theme controls, or breakpoint.
- Use `usePathname` to resolve the active top-level directory and `useRouter` to navigate after selection.
- Provide a compact desktop presentation and a full-width mobile presentation from the same route and translation data.

## Mobile optimization

- The selector trigger spans the usable width of the mobile sheet and has a minimum height of 44px.
- Long labels such as United Kingdom–United States remain readable without overlapping the chevron, clipping, or forcing horizontal page scrolling.
- The opened list stays inside the visual viewport, uses collision-aware positioning, and becomes internally scrollable if the available height is unusually short.
- Each country option has a minimum 44px touch target with sufficient spacing for reliable thumb interaction.
- Selecting a country closes both the selector and, when navigation completes, the surrounding mobile sheet.
- Focus remains visible for keyboard and switch-device users; Escape closes only the current open layer first.
- The layout is verified at widths of 320px, 360px, 390px, 768px, 1024px, 1440px, and 1680px in both light and dark themes.
- No option depends on hover, and the active country uses both a check mark and accessible state text.

## Localization

Add localized labels for `Pays` / `Country` / `País` / `Land` / `Paese`. Existing localized country-pair names remain the option labels. The accessible name combines the selector label and active directory when one is active.

## Accessibility and behavior

- The trigger is reachable by keyboard and exposes its expanded state.
- Arrow-key navigation, Enter/Space selection, Escape closing, and focus return are supplied by the existing accessible primitive.
- The active option is identifiable without relying on color alone.
- Touch targets remain at least 44px high on mobile.
- The menu must not introduce horizontal overflow between 320px and 1680px.

## Testing

- Update the directory-navigation integration test before implementation so it expects one selector rather than five separate header links.
- Verify all five options and URLs in French, English, Spanish, German, and Italian.
- Verify the active country on each directory route.
- Verify navigation from France to Germany and back.
- Verify desktop and mobile presentations, keyboard opening/selection, sheet closure after navigation, long-label rendering, and absence of horizontal overflow down to 320px.
- Run the existing locale, directory, browser, and production-build checks to catch regressions.

## Scope boundaries

No directory content, partnership data, URL, metadata, footer, language behavior, theme behavior, or non-country navigation is changed. Deployment follows the existing GitHub `master` and Vercel production workflow after verification.
