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

assert.ok(existsSync(pageComponentPath), "Germany page component must exist")
assert.ok(existsSync(routePath), "Germany route must exist")

const pageComponent = readFileSync(pageComponentPath, "utf8")
const route = readFileSync(routePath, "utf8")
const filtersPanel = readFileSync(filtersPanelPath, "utf8")

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

console.log("Germany page structure verified")
