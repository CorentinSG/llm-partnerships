import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const paths = {
  page: join(root, "src", "components", "pages", "uk-home-page.tsx"),
  route: join(root, "src", "app", "uk", "page.tsx"),
  map: join(root, "src", "components", "uk-map.tsx"),
  geo: join(root, "data", "uk.json"),
  header: join(root, "src", "components", "site-header.tsx"),
  details: join(root, "src", "components", "pages", "partnership-detail-page.tsx"),
  detailRoute: join(root, "src", "app", "partnership", "[id]", "page.tsx"),
  about: join(root, "src", "app", "about", "page.tsx"),
  layout: join(root, "src", "app", "layout.tsx"),
}

for (const [name, path] of Object.entries(paths)) {
  assert.ok(existsSync(path), `UK ${name} file must exist`)
}

const page = readFileSync(paths.page, "utf8")
const route = readFileSync(paths.route, "utf8")
const map = readFileSync(paths.map, "utf8")
const header = readFileSync(paths.header, "utf8")
const details = readFileSync(paths.details, "utf8")
const detailRoute = readFileSync(paths.detailRoute, "utf8")
const about = readFileSync(paths.about, "utf8")
const layout = readFileSync(paths.layout, "utf8")

assert.match(page, /export function UkHomePage\(\)/)
assert.match(page, /getAllUkPartnerships\(\)/)
assert.match(page, /getUkFilterOptions\(\)/)
assert.match(page, /getUkUniversitiesPoints\(\)/)
assert.match(page, /<UkMap/)
assert.match(page, /<UsMap/)
assert.match(page, /<PartnershipCard/)
assert.match(page, /<CostSimulator/)
assert.match(page, /originUniversityLabel=\{t\.ukUniversity\}/)
assert.match(page, /4 partenariats.*5 parcours/s)
assert.match(page, /4 partnerships.*5 pathways/s)
assert.match(page, /4 Partnerschaften.*5 Studienwege/s)
assert.match(page, /4 partnership.*5 percorsi/s)
assert.match(page, /4 convenios.*5 itinerarios/s)

assert.match(route, /UkHomePage/)
assert.match(route, /metadata/)
assert.match(map, /Map \(United Kingdom\)/)
assert.match(map, /Carte du Royaume-Uni/)
assert.match(map, /Karte.*Vereinigtes Königreich/s)

for (const label of ["ukUs", 'href="/uk"']) assert.match(header, new RegExp(label))
assert.match(details, /"france" \| "germany" \| "italy" \| "uk"/)
assert.match(details, /origin === "uk" \? "\/uk"/)
assert.match(detailRoute, /getUkPartnershipById/)
assert.match(detailRoute, /\? "uk"/)

assert.match(about, /quatre annuaires distincts/)
assert.match(about, /four separate LL\.M partnership directories/)
assert.match(about, /cuatro directorios distintos/)
assert.match(about, /vier separate LL\.M.-Partnerschaftsverzeichnisse/)
assert.match(about, /quattro directory distinte/)
assert.match(layout, /Quatre annuaires distincts/)
assert.match(layout, /Royaume-Uni–États-Unis/)

console.log("UK page structure and routing verified")
