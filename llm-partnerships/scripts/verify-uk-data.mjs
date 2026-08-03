import assert from "node:assert/strict"
import { join } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const jiti = jitiModule(import.meta.url, { alias: { "@": join(projectRoot, "src") } })
const { getAllUkPartnerships, getUkUniversitiesPoints } = jiti(
  join(projectRoot, "src", "lib", "uk-data.ts"),
)

const partnerships = getAllUkPartnerships()
const institutions = getUkUniversitiesPoints()

assert.equal(institutions.length, 4, "The UK directory must contain four institutions")
assert.equal(partnerships.length, 5, "The UK directory must expose five LL.M. pathways")
assert.equal(new Set(partnerships.map(({ id }) => id)).size, 5, "UK pathway IDs must be unique")
assert.equal(
  partnerships.filter(({ partnerUniversity }) => partnerUniversity.includes("Georgetown")).length,
  2,
  "King's–Georgetown must expose both LL.M. degrees",
)
assert.deepEqual(
  new Set(partnerships.map(({ frenchUniversity }) => frenchUniversity)),
  new Set(institutions.map(({ frenchUniversity }) => frenchUniversity)),
  "Every institution must have at least one pathway",
)

for (const institution of institutions) {
  assert.ok(Number.isFinite(institution.coordinates.lat), `${institution.frenchUniversity} latitude is required`)
  assert.ok(Number.isFinite(institution.coordinates.lng), `${institution.frenchUniversity} longitude is required`)
}

for (const partnership of partnerships) {
  assert.match(partnership.officialLink, /^https:\/\//, `${partnership.id} needs an official HTTPS source`)
  assert.ok(["confirmed", "to_confirm"].includes(partnership.reliabilityStatus))
  assert.ok(partnership.sourceNote.length > 30, `${partnership.id} needs a source note`)
  assert.ok(partnership.notes.length > 20, `${partnership.id} needs a user-facing caveat`)
}

const dundee = partnerships.find(({ id }) => id === "dundee-auwcl-exchange")
assert.ok(dundee, "Dundee–AUWCL pathway is required")
assert.match(dundee.shortDescription, /ne délivre pas.*LL\.M|aucun LL\.M/i)
assert.match(dundee.duration, /un semestre/i)
assert.match(dundee.notes, /12 crédits|admission distincte/i)

const bristol = partnerships.find(({ id }) => id === "bristol-cardozo")
assert.match(bristol.tuitionDisplay, /77 602 USD/)
assert.match(bristol.tuitionDisplay, /50 %/)

console.log(`UK dataset verified: ${institutions.length} institutions, ${partnerships.length} pathways`)
