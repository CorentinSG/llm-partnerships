import assert from "node:assert/strict"
import { join } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const jiti = jitiModule(import.meta.url, { alias: { "@": join(root, "src") } })
const { getAllSwissPartnerships, getSwissUniversitiesPoints } = jiti(
  join(root, "src", "lib", "switzerland-data.ts"),
)

const partnerships = getAllSwissPartnerships()
const institutions = getSwissUniversitiesPoints()

assert.equal(institutions.length, 4, "Swiss directory must contain four institutions")
assert.equal(partnerships.length, 6, "Swiss directory must expose six publishable pathways")
assert.equal(new Set(partnerships.map(({ id }) => id)).size, 6, "Swiss IDs must be unique")
assert.deepEqual(
  new Set(partnerships.map(({ frenchUniversity }) => frenchUniversity)),
  new Set(institutions.map(({ frenchUniversity }) => frenchUniversity)),
  "Every Swiss institution must have a pathway",
)

for (const item of partnerships) {
  assert.match(item.officialLink, /^https:\/\//, `${item.id} needs an official HTTPS source`)
  assert.equal(item.reliabilityStatus, "confirmed", `${item.id} must meet the publication threshold`)
  assert.ok(item.sourceNote.length > 40, `${item.id} needs a source note`)
  assert.ok(item.notes.length > 30, `${item.id} needs a clear caveat`)
}

const berkeley = partnerships.find(({ id }) => id === "uzh-berkeley")
assert.match(berkeley.notes, /New York|executive/i)
assert.match(berkeley.notes, /Californie|California/i)

const cardozo = partnerships.find(({ id }) => id === "uzh-cardozo")
assert.match(cardozo.tuitionDisplay, /50 %/)
assert.match(cardozo.availableSeatsDisplay, /15/)

const fletcher = partnerships.find(({ id }) => id === "hsg-fletcher")
assert.match(fletcher.notes, /ne vise pas.*barreau|not intended.*bar/i)

const georgetown = partnerships.find(({ id }) => id === "ihei-georgetown")
assert.match(georgetown.notes, /aucun avantage.*Suisse|no advantage.*Swiss/i)

console.log(`Swiss dataset verified: ${institutions.length} institutions, ${partnerships.length} pathways`)

