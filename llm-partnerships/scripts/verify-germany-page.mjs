import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptsDirectory, "..")
const pageComponentPath = join(
  projectRoot,
  "src",
  "components",
  "pages",
  "germany-home-page.tsx",
)
const routePath = join(projectRoot, "src", "app", "germany", "page.tsx")
const filtersPanelPath = join(
  projectRoot,
  "src",
  "components",
  "filters",
  "filters-panel.tsx",
)
const detailRoutePath = join(
  projectRoot,
  "src",
  "app",
  "partnership",
  "[id]",
  "page.tsx",
)
const detailPagePath = join(
  projectRoot,
  "src",
  "components",
  "pages",
  "partnership-detail-page.tsx",
)
const costSimulatorPath = join(
  projectRoot,
  "src",
  "components",
  "cost-simulator.tsx",
)
const textUtilsPath = join(projectRoot, "src", "lib", "text-utils.ts")

assert.ok(existsSync(pageComponentPath), "Germany page component must exist")
assert.ok(existsSync(routePath), "Germany route must exist")

const pageComponent = readFileSync(pageComponentPath, "utf8")
const route = readFileSync(routePath, "utf8")
const filtersPanel = readFileSync(filtersPanelPath, "utf8")
const detailRoute = readFileSync(detailRoutePath, "utf8")
const detailPage = readFileSync(detailPagePath, "utf8")
const costSimulator = readFileSync(costSimulatorPath, "utf8")
const textUtils = readFileSync(textUtilsPath, "utf8")

assert.match(pageComponent, /export function GermanyHomePage\(\)/)
assert.match(pageComponent, /const RESULTS_PAGE_SIZE = 12/)
assert.match(pageComponent, /getAllGermanPartnerships\(\)/)
assert.match(pageComponent, /getGermanFilterOptions\(\)/)
assert.match(pageComponent, /getGermanUniversitiesPoints\(\)/)
assert.doesNotMatch(pageComponent, /from ["']@\/lib\/data["']/)
assert.match(pageComponent, /<GermanyMap/)
assert.match(pageComponent, /selectedGermanUniversity=\{filters\.frenchUniversity\}/)
assert.match(pageComponent, /<UsMap/)
assert.match(pageComponent, /<PartnershipCard/)
assert.match(pageComponent, /<CostSimulator/)
assert.match(pageComponent, /originConfig=\{germanyCostSimulatorOrigin\}/)
assert.match(pageComponent, /universityFeesUsd: 0/)
assert.match(pageComponent, /aria-pressed=\{mapMode === "de"\}/)
assert.match(pageComponent, /aria-pressed=\{mapMode === "us"\}/)
assert.match(pageComponent, /originUniversityLabel=\{t\.germanUniversity\}/g)
assert.match(
  pageComponent,
  /Find a U\.S\. LL\.M\. through a German university\./,
)
assert.match(pageComponent, /Trouvez un LL\.M/)
assert.match(pageComponent, /Encuentra un LL\.M estadounidense/)

assert.match(filtersPanel, /originUniversityLabel,?/)
assert.match(filtersPanel, /originUniversityLabel\?: string/)
assert.match(filtersPanel, /label=\{originUniversityLabel \?\? t\.frenchUniversity\}/)

assert.match(
  route,
  /import \{ GermanyHomePage \} from ["']@\/components\/pages\/germany-home-page["']/,
)
assert.match(route, /export const metadata/)
assert.match(route, /return <GermanyHomePage \/>/)

assert.match(detailRoute, /getAnyPartnershipById\(id\)/)
assert.match(detailRoute, /getGermanPartnershipById\(id\)/)
assert.match(detailPage, /origin === "germany" \? "\/germany" : "\/"/)
assert.match(costSimulator, /originConfig\?: CostSimulatorOriginConfig/)
assert.match(
  costSimulator,
  /DEFAULT_FRENCH_UNIVERSITY_FEES_USD = 700/,
)
assert.match(textUtils, /germany-translations\.json/)

console.log("Germany page structure verified")
