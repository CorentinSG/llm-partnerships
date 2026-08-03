# Italy–United States LL.M. Directory Design

## Goal

Add a distinct Italy–United States LL.M. directory that matches the existing France–United States and Germany–United States sections in clarity, functionality, visual design, evidence standards, and multilingual coverage. Existing sections and data remain unchanged except for the navigation and site-wide description required to expose the new directory.

## Source Baseline

The supplied Word document, `Partenariats LL.M. entre universités italiennes et américaines.docx`, is the research baseline. It identifies twelve pathways involving five Italian institutions:

- LUISS Guido Carli: Fordham, Temple, UC Law San Francisco, American University Washington College of Law, and Suffolk
- Università Cattolica del Sacro Cuore: Fordham, Boston College, and UC Berkeley
- Università di Trento: Washington University in St. Louis and University of Cincinnati
- Università LUM Giuseppe Degennaro: Indiana University Maurer School of Law
- Università degli Studi Roma Tre: Cardozo School of Law

Eleven pathways are treated as active and directly publishable. Roma Tre–Cardozo is included with a visible `probably active / annual confirmation pending` qualification because the institutional agreement is documented but no public 2026–2027 annual call was identified in the supplied research.

The document is not accepted blindly. Every public record must be checked against current official pages or official university publications. Search-engine snippets, aggregators, commercial directories, and unsourced summaries cannot establish a fact. If a supplied value cannot be independently confirmed, it retains an explicit qualification or is displayed as not disclosed.

## User Experience

The directory lives at `/italy`. It follows the established country-directory experience:

- country-specific hero and description
- Italy and United States map views
- global search over original and translated data
- filters for Italian institution, U.S. partner, location, program structure, tuition category, language tests, reliability, bar-exam relevance, and other supported fields
- partnership cards and detailed partnership routes
- annual cost simulator using Italy-specific origin costs and the existing U.S. cost model
- reliability explanations, source links, missing-information labels, and cautious wording
- responsive desktop, tablet, and mobile behavior

The global header gains an `Italy–United States` destination in all four interface languages. The home/about/footer descriptions are adjusted only where they currently describe the platform as containing two country directories.

## Data Model

Italy data is isolated in dedicated files and adapters, following the Germany section rather than mixing country records into the France dataset:

- `data/italy-database.json`: normalized partnership records
- `data/italy.json`: Italian institution map points
- `data/italy-translations.json`: English, Spanish, and German translations for Italian-directory values
- `src/lib/italy-data.ts`: typed accessors and directory helpers
- `src/components/pages/italy-home-page.tsx`: Italy-specific directory page
- `src/components/italy-map.tsx`: Italian institution map

The twelve records use the existing `Partnership` interface wherever possible. Italy-specific source concepts are mapped as follows:

- Italian university and law faculty use the existing home-institution fields
- fifth-year, 4+1, two-summer, integrated double-degree, and scholarship arrangements use explicit program and partnership types
- published standard U.S. tuition, actual partner tuition, Italian tuition obligations, mandatory fees, and estimated total cost remain distinct in descriptions and simulator inputs
- `No Fee` is represented as no additional partner-university tuition, never as a free LL.M.
- seats distinguish published competitive places, scholarship places, and unguaranteed additional admissions
- bar-exam references never imply guaranteed eligibility and preserve state-specific and curriculum-specific conditions
- academic year, access date, and source age are retained in reliability notes

Stable institutional facts and annual values are kept conceptually separate in each record through explicit year labels and source notes, even though the public adapter continues to expose the common `Partnership` shape.

## Evidence and Reliability Rules

Each record must contain at least one official source URL supporting the existence and structure of the pathway. Financial, language, deadline, place, and bar-exam claims require official support or an explicit qualification.

Reliability states follow the existing site:

- `confirmed`: current official evidence supports the key claims
- `to_confirm`: the agreement is official but at least one material annual fact is old, incomplete, or awaiting renewal
- `incomplete`: insufficient evidence for safe comparison

Roma Tre–Cardozo is `to_confirm`. Its page must state that the agreement and scholarship structure are official while the 2026–2027 call, current numeric English thresholds, and exact number of scholarships require annual confirmation.

The implementation may add further Italy–United States pathways found through official research only when they satisfy the same inclusion rule: an Italian-enrolled student can actually obtain a U.S. LL.M. through an institutional pathway. Semester exchanges, summer schools without an LL.M., research agreements, undergraduate programs, one-way U.S.-to-Italy LL.M.s, and JD-only programs are excluded.

## Translation

The complete Italy section is available in French, English, Spanish, and German through the existing global language control. This includes page copy, maps, filters, cards, detailed records, simulator text, reliability notes, and dataset-backed values.

Official names remain unchanged, including universities, law schools, degrees, named programs, tests, organizations, and branded services. Translations preserve amounts, percentages, deadlines, thresholds, uncertainty, and non-guarantee language.

## Navigation and Responsive Design

Desktop navigation adds the Italy directory alongside France and Germany without removing existing destinations. If four language choices and three country destinations exceed available width, the header breakpoint or grouping may be adjusted narrowly while preserving the current visual system.

Mobile navigation exposes all three country directories and the four-language selector in the existing sheet. German, Italian-directory, and long university labels must wrap without clipping or horizontal overflow.

## Failure and Fallback Behavior

- Missing translated data falls back to cleaned source text at runtime, but translation verification fails before deployment.
- Missing annual facts display `not disclosed` or a qualified note rather than a fabricated estimate.
- Broken or missing official sources fail data verification.
- A program lacking sufficient evidence is excluded from the main dataset rather than silently downgraded into a misleading card.
- Search includes original and localized values so a query works in the active interface language.

## Testing and Verification

Implementation is test-first and must add:

- a dataset contract verifying exactly twelve approved baseline pathways, five Italian institutions, unique IDs, required fields, source URLs, reliability states, and financial invariants
- a translation contract requiring complete English, Spanish, and German mappings while preserving official institution names
- integration checks for header navigation, `/italy`, Italian and U.S. map filters, search, cards, detail routes, simulator, reliability explanations, and return navigation
- mobile checks for navigation, language selection, wrapping, and overflow
- regression checks proving the France and Germany directories retain their current counts and routes
- TypeScript validation and a production build

The design verification must exercise representative records from LUISS, Cattolica, Trento, LUM, and Roma Tre, including at least one no-additional-partner-fee record, one 50% discount, one scholarship range, one conditional bar pathway, and the `to_confirm` Roma Tre record.

## Acceptance Criteria

- `/italy` is a separate, discoverable directory matching the established country-section experience.
- Twelve baseline pathways appear, including Roma Tre–Cardozo with its visible qualification.
- Every material public claim is supported by an official source or clearly marked as unconfirmed/not disclosed.
- Standard U.S. tuition, actual partner tuition, Italian tuition, fees, and living costs are not conflated.
- All Italy content works in French, English, Spanish, and German.
- Existing France and Germany pages, data, translations, and routes remain intact.
- All data, translation, integration, responsive, regression, TypeScript, and production-build checks pass.
- The completed branch is pushed to `master` and the Vercel production deployment is confirmed successful.
