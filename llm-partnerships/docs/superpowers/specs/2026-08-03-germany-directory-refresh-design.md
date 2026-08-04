# Germany–U.S. LL.M. Directory Refresh Design

## Objective

Replace the current partial German directory with the materially more complete research supplied in the Google Sheet, without changing the France, Italy, UK, or Switzerland directories.

## Publication rule

- Use the `Partnerschaften` tab as the canonical research input and the `Ausgeschlossene Abkommen` and `Analysen` tabs as exclusion and interpretation controls.
- Publish rows whose pathway is active and whose reliability score is at least 4.
- Do not publish DE-US-011 (expired cohort), DE-US-019 (one-sided evidence, score 3), or DE-US-020 (undocumented/stale, score 2) as current opportunities.
- Split aggregate rows by U.S. law school because each website card, map destination, filter option, and cost-simulator option represents one destination. This yields 27 cards across 13 German faculties from 17 qualifying sheet rows.
- Preserve dated or conditional terms as dated or conditional. Never turn a nomination, historical discount, exchange waiver, or possible credit transfer into guaranteed LL.M. admission or free LL.M. tuition.

## User experience

The Germany page keeps the existing country-directory layout, search, filters, maps, pagination, detail pages, and cost simulator. Its hero copy states the new scope. A permanently visible warning panel explains that U.S.-bar eligibility is not guaranteed, nominations do not guarantee admission or funding, exchange tuition waivers may cover only the exchange semester, and older figures must be rechecked with both institutions.

The German map adds the newly represented faculties. Aggregate partnerships are separate cards but share their German university map marker. The U.S. map and simulator receive one destination per card.

## Data and translation model

French remains the canonical data language. Every new user-visible canonical string is mapped in `germany-translations.json` for English, Spanish, German, and Italian. Official institution names and test names remain unchanged. The source ledger records the supplied sheet, selection rule, excluded IDs, row-to-card expansion, and verification date.

## Verification

Automated checks must enforce 13 faculties, 27 unique pathways, the required new IDs, the three excluded IDs, valid official HTTPS sources, full five-language coverage, unchanged counts for other countries, mobile-safe layout, map accessibility, pagination, search, filters, detail routing, and cost-simulator inclusion.
