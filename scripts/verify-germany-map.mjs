import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const geojsonPath = path.join(root, "llm-partnerships", "data", "germany.json")
const componentPath = path.join(
  root,
  "llm-partnerships",
  "src",
  "components",
  "germany-map.tsx",
)

assert.ok(existsSync(geojsonPath), "Germany boundary GeoJSON must exist")
assert.ok(existsSync(componentPath), "GermanyMap component must exist")

const geojson = JSON.parse(readFileSync(geojsonPath, "utf8"))
assert.equal(geojson.type, "FeatureCollection")
assert.equal(geojson.features.length, 1, "Germany map needs one national outline")
assert.deepEqual(Object.keys(geojson.features[0].properties), ["name"])
assert.match(geojson.features[0].properties.name, /Germany/i)
assert.match(geojson.features[0].geometry.type, /^(Polygon|MultiPolygon)$/)

const source = readFileSync(componentPath, "utf8")
for (const requiredContract of [
  "export function GermanyMap",
  'from "../../data/germany.json"',
  "geoMercator",
  "fitExtent",
  "usePanZoom",
  "id=\"deFill\"",
  "role=\"button\"",
  "tabIndex={0}",
  "aria-label={accessibleName}",
  "data-focus-ring=\"true\"",
  "onKeyDown",
  "onMouseEnter",
  "const minimumDistance",
  "Math.hypot",
  "selectedGermanUniversity",
  "onSelect(selected ? undefined : p.frenchUniversity)",
  "Carte (Allemagne)",
  "Map (Germany)",
  "Mapa (Alemania)",
]) {
  assert.ok(source.includes(requiredContract), `Missing map contract: ${requiredContract}`)
}

console.log("Germany map structure verified")
