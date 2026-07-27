import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

const textUtils = read("src/lib/text-utils.ts")
const provider = read("src/components/language-provider.tsx")
const header = read("src/components/site-header.tsx")

assert.match(textUtils, /"fr"\s*\|\s*"en"\s*\|\s*"es"\s*\|\s*"de"/)
assert.match(provider, /stored === "de"/)
assert.match(header, /de:\s*"DE"/)
assert.match(header, /de:\s*"Deutsch"/)
assert.match(header, /\["fr",\s*"en",\s*"es",\s*"de"\]/)

const localizedFiles = [
  "src/app/about/page.tsx",
  "src/app/guide/page.tsx",
  "src/app/not-found.tsx",
  "src/components/alternative-card.tsx",
  "src/components/cost-simulator.tsx",
  "src/components/filters/filters-panel.tsx",
  "src/components/filters/multi-select-filter.tsx",
  "src/components/founder-faq.tsx",
  "src/components/france-map.tsx",
  "src/components/germany-map.tsx",
  "src/components/pages/alternatives-page.tsx",
  "src/components/pages/germany-home-page.tsx",
  "src/components/pages/home-page.tsx",
  "src/components/pages/partnership-detail-page.tsx",
  "src/components/pages/submit-information-form.tsx",
  "src/components/partnership-card.tsx",
  "src/components/partnership-dialog.tsx",
  "src/components/site-footer.tsx",
  "src/components/stats-bar.tsx",
  "src/components/theme-toggle.tsx",
  "src/components/tuition-badges.tsx",
  "src/components/us-lawyer-path.tsx",
  "src/components/us-map.tsx",
  "src/lib/partnership-details-copy.ts",
  "src/lib/tuition-offers.ts",
]

for (const path of localizedFiles) {
  assert.match(read(path), /\bde\s*:/, `${path} must contain German copy`)
}

console.log("German locale plumbing verified")
