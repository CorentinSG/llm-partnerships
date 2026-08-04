import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

const root = new URL("../", import.meta.url)
const read = (path) => readFileSync(new URL(path, root), "utf8")

for (const path of [
  "src/app/italy/page.tsx",
  "src/components/pages/italy-home-page.tsx",
  "src/components/italy-map.tsx",
]) {
  assert.ok(existsSync(new URL(path, root)), `${path} must exist`)
}

assert.match(read("src/app/italy/page.tsx"), /ItalyHomePage/)
const home = read("src/components/pages/italy-home-page.tsx")
assert.match(home, /getAllItalianPartnerships/)
assert.match(home, /getItalianFilterOptions/)
assert.match(home, /getItalianUniversitiesPoints/)
assert.match(home, /ItalyMap/)
assert.match(home, /applicationNotices/)
assert.match(home, /22 parcours actifs ou qualifi/)

const detailRoute = read("src/app/partnership/[id]/page.tsx")
assert.match(detailRoute, /getItalianPartnershipById/)
assert.match(detailRoute, /["']italy["']/)

const header = read("src/components/site-header.tsx")
assert.match(header, /italyUs/)
assert.match(header, /\{ href: "\/italy", label: t\.italyUs \}/)
for (const label of [
  "Italie–États-Unis",
  "Italy–United States",
  "Italia–Estados Unidos",
  "Italien–USA",
]) {
  assert.ok(header.includes(label), `Missing Italy navigation label: ${label}`)
}

console.log("Italy page structure verified")
