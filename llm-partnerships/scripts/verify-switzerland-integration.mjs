import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const paths = {
  page: join(root, "src", "components", "pages", "switzerland-home-page.tsx"),
  route: join(root, "src", "app", "switzerland", "page.tsx"),
  map: join(root, "src", "components", "switzerland-map.tsx"),
  geo: join(root, "data", "switzerland.json"),
  header: join(root, "src", "components", "site-header.tsx"),
  details: join(root, "src", "components", "pages", "partnership-detail-page.tsx"),
  detailRoute: join(root, "src", "app", "partnership", "[id]", "page.tsx"),
  about: join(root, "src", "app", "about", "page.tsx"),
  layout: join(root, "src", "app", "layout.tsx"),
}
for (const [name, path] of Object.entries(paths)) assert.ok(existsSync(path), `Swiss ${name} file must exist`)

const page = readFileSync(paths.page, "utf8")
const route = readFileSync(paths.route, "utf8")
const map = readFileSync(paths.map, "utf8")
const header = readFileSync(paths.header, "utf8")
const details = readFileSync(paths.details, "utf8")
const detailRoute = readFileSync(paths.detailRoute, "utf8")
const about = readFileSync(paths.about, "utf8")
const layout = readFileSync(paths.layout, "utf8")

assert.match(page, /export function SwitzerlandHomePage\(\)/)
assert.match(page, /getAllSwissPartnerships\(\)/)
assert.match(page, /<SwitzerlandMap/)
assert.match(page, /<UsMap/)
assert.match(page, /<CostSimulator/)
for (const phrase of ["7 partenariats", "7 partnerships", "7 convenios", "7 Partnerschaften", "7 partnership"]) assert.match(page, new RegExp(phrase))
assert.match(route, /SwitzerlandHomePage/)
assert.match(map, /Switzerland|Suisse|Schweiz|Svizzera/)
assert.match(header, /switzerlandUs/)
assert.match(header, /href: "\/switzerland"/)
assert.match(details, /"switzerland"/)
assert.match(detailRoute, /getSwissPartnershipById/)
assert.match(about, /cinq annuaires distincts/)
assert.match(about, /five separate LL\.M partnership directories/)
assert.match(layout, /Cinq annuaires distincts/)
console.log("Swiss page structure and routing verified")
