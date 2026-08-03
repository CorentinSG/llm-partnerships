import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import jitiModule from "jiti"

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptsDirectory, "..")
const repositoryRoot = join(projectRoot, "..")
const require = createRequire(import.meta.url)
const jiti = jitiModule(import.meta.url, {
  alias: { "@": join(projectRoot, "src") },
})

const costModule = jiti(join(projectRoot, "src", "lib", "us-cost-estimates.ts"))
const germanData = jiti(join(projectRoot, "src", "lib", "germany-data.ts"))
const italianData = jiti(join(projectRoot, "src", "lib", "italy-data.ts"))
const ukData = jiti(join(projectRoot, "src", "lib", "uk-data.ts"))
const frenchData = jiti(join(projectRoot, "src", "lib", "data.ts"))
const textModule = jiti(join(projectRoot, "src", "lib", "text-utils.ts"))

assert.equal(
  typeof costModule.getPartnershipCostResolutions,
  "function",
  "the simulator must expose one cost resolution per passed partnership",
)
assert.equal(
  existsSync(join(projectRoot, "src", "lib", "tuition-offers.ts")),
  true,
  "tuition offer inference must live in a directly regression-testable module",
)
const simulatorModule = jiti(
  join(projectRoot, "src", "lib", "tuition-offers.ts"),
)
assert.equal(
  typeof simulatorModule.inferOfferOptions,
  "function",
  "tuition offer inference must be directly regression-testable",
)

const germanPartnerships = germanData.getAllGermanPartnerships()
const germanResolutions =
  costModule.getPartnershipCostResolutions(germanPartnerships)
assert.equal(germanResolutions.length, 16)
assert.deepEqual(
  germanResolutions.map((resolution) => resolution.partnership.id).sort(),
  germanPartnerships.map((partnership) => partnership.id).sort(),
  "the union of German simulator options must equal all 16 German IDs",
)
assert.equal(
  new Set(germanResolutions.map((resolution) => resolution.partnership.id)).size,
  16,
  "every German partnership must appear exactly once",
)
assert.ok(
  germanResolutions.every(
    (resolution) =>
      resolution.status === "supported" ||
      resolution.status === "unsupported",
  ),
  "every German partnership must have an explicit estimate status",
)
assert.equal(
  germanResolutions.find(
    (resolution) =>
      resolution.partnership.id ===
      "augsburg-george-washington-exchange-credit",
  )?.estimate?.id,
  "washington-dc-georgetown",
  "Washington, D.C. must normalize to the Washington, DC estimate",
)
assert.equal(
  germanResolutions.some(
    (resolution) => resolution.displayCity.startsWith("New York"),
  ),
  false,
  "German simulator cities must be derived from German partnerships",
)
assert.equal(
  germanResolutions.find(
    (resolution) =>
      resolution.partnership.id === "fu-berlin-uconn-dual-degree",
  )?.status,
  "unsupported",
  "destinations without a cost estimate must remain visible as unsupported",
)

const frenchPartnerships = frenchData.getAllPartnerships()
const frenchResolutions =
  costModule.getPartnershipCostResolutions(frenchPartnerships)
assert.equal(frenchPartnerships.length, 42)
assert.equal(frenchResolutions.length, 42)
assert.deepEqual(
  frenchResolutions.map((resolution) => resolution.partnership.id).sort(),
  frenchPartnerships.map((partnership) => partnership.id).sort(),
  "French simulator behavior must retain all 42 records/options",
)

const italianPartnerships = italianData.getAllItalianPartnerships()
const italianResolutions =
  costModule.getPartnershipCostResolutions(italianPartnerships)
assert.equal(italianPartnerships.length, 12)
assert.equal(italianResolutions.length, 12)
assert.deepEqual(
  italianResolutions.map((resolution) => resolution.partnership.id).sort(),
  italianPartnerships.map((partnership) => partnership.id).sort(),
  "Italian simulator behavior must include all 12 records/options",
)

const ukPartnerships = ukData.getAllUkPartnerships()
const ukResolutions = costModule.getPartnershipCostResolutions(ukPartnerships)
assert.equal(ukPartnerships.length, 6)
assert.equal(ukResolutions.length, 6)
assert.deepEqual(
  ukResolutions.map((resolution) => resolution.partnership.id).sort(),
  ukPartnerships.map((partnership) => partnership.id).sort(),
  "UK simulator behavior must include all 6 records/options",
)

for (const id of [
  "augsburg-george-washington-exchange-credit",
  "augsburg-pittsburgh-exchange-credit",
  "duesseldorf-suffolk-exchange-credit",
]) {
  const partnership = germanPartnerships.find((candidate) => candidate.id === id)
  const resolution = germanResolutions.find(
    (candidate) => candidate.partnership.id === id,
  )
  assert.ok(partnership, `missing exchange fixture ${id}`)
  assert.ok(resolution?.estimate, `exchange fixture lacks a cost estimate ${id}`)
  const normalTuition = costModule
    .getEstimateSummary(resolution.estimate)
    .tuitionUsd
  const offers = simulatorModule.inferOfferOptions(
    partnership,
    normalTuition,
    "en",
  )
  assert.ok(normalTuition > 0)
  assert.deepEqual(
    offers.map((offer) => offer.id),
    ["public"],
    `${id} exchange-only waiver must not create a $0 annual LL.M. offer`,
  )
  assert.ok(offers.every((offer) => offer.tuitionUsd > 0))
  assert.equal(offers[0].note, "Normal public price")
}

const conditionalPartnership = germanPartnerships.find(
  (partnership) =>
    partnership.id === "duesseldorf-suffolk-graduate-scholarship",
)
const conditionalResolution = germanResolutions.find(
  (resolution) =>
    resolution.partnership.id ===
    "duesseldorf-suffolk-graduate-scholarship",
)
assert.ok(conditionalPartnership && conditionalResolution?.estimate)
const conditionalOffers = simulatorModule.inferOfferOptions(
  conditionalPartnership,
  costModule.getEstimateSummary(conditionalResolution.estimate).tuitionUsd,
  "en",
)
assert.equal(conditionalOffers[0].id, "public")
assert.ok(conditionalOffers.length > 1)
assert.ok(
  conditionalOffers
    .slice(1)
    .every((offer) => offer.label.startsWith("Scenario — ")),
  "conditional and historical benefits must be clearly labeled scenarios",
)

const frenchTranslations = require(
  join(projectRoot, "data", "text-translations.json"),
)
const germanTranslations = require(
  join(projectRoot, "data", "germany-translations.json"),
)
for (const language of ["en", "es"]) {
  const collisions = Object.keys(frenchTranslations[language]).filter(
    (source) => source in germanTranslations[language],
  )
  for (const source of collisions) {
    assert.equal(
      germanTranslations[language][source],
      frenchTranslations[language][source],
      `Germany dictionary must not override French ${language} translation for ${source}`,
    )
  }
}
assert.equal(
  textModule.translateDataText("Non communiqué", "en"),
  "Not communicated",
  "existing French translations must remain unchanged",
)

const aboutPage = readFileSync(
  join(projectRoot, "src", "app", "about", "page.tsx"),
  "utf8",
)
for (const sentence of [
  "La section France–États-Unis est consacrée aux partenariats",
  "The France–U.S. section covers partnerships",
  "La sección Francia–Estados Unidos está dedicada a los convenios",
]) {
  assert.match(aboutPage, new RegExp(sentence))
}
assert.doesNotMatch(aboutPage, /Current scope: partnerships between French/)
assert.doesNotMatch(aboutPage, /Périmètre actuel : le site est consacré/)
assert.doesNotMatch(aboutPage, /Alcance actual: convenios entre universidades francesas/)

const rootGitignore = readFileSync(join(repositoryRoot, ".gitignore"), "utf8")
assert.match(rootGitignore, /^\/\.next\/$/m)

console.log(
  "Final data regressions verified: 42 French, 16 German, 12 Italian, and 6 UK simulator options",
)
