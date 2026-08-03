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

const expectedIds = new Set([
  "qmul-william-mary",
  "kcl-georgetown-dual",
  "kcl-ctls-georgetown",
  "greenwich-mitchell-hamline",
  "middlesex-case-western",
  "bristol-cardozo",
])

assert.equal(institutions.length, 5, "The UK directory must contain five institutions")
assert.equal(partnerships.length, 6, "The UK directory must expose six active LL.M. pathways")
assert.deepEqual(new Set(partnerships.map(({ id }) => id)), expectedIds)
assert.equal(partnerships.some(({ id }) => /dundee|hull/i.test(id)), false)
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

const qmul = partnerships.find(({ id }) => id === "qmul-william-mary")
assert.match(qmul.financialAid, /billet|tuition|logement|allocation/i)

const kclDual = partnerships.find(({ id }) => id === "kcl-georgetown-dual")
assert.match(kclDual.notes, /New York Bar/i)

const ctls = partnerships.find(({ id }) => id === "kcl-ctls-georgetown")
assert.match(ctls.tuitionDisplay, /50 %/)

const greenwich = partnerships.find(({ id }) => id === "greenwich-mitchell-hamline")
assert.match(greenwich.financialAid, /50 %/)

const middlesex = partnerships.find(({ id }) => id === "middlesex-case-western")
assert.match(middlesex.availableSeatsDisplay, /deux/i)

const bristol = partnerships.find(({ id }) => id === "bristol-cardozo")
assert.match(bristol.tuitionDisplay, /77 602 USD/)
assert.match(bristol.tuitionDisplay, /50 %/)
assert.match(bristol.sourceNote, /Bristol.*Cardozo/i)

console.log(`UK dataset verified: ${institutions.length} institutions, ${partnerships.length} pathways`)
