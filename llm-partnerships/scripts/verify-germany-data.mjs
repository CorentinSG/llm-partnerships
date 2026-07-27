import assert from "node:assert/strict"
import database from "../data/germany-database.json" with { type: "json" }

assert.equal(database.frenchUniversities.length, 8, "expected 8 German faculties")
assert.equal(database.partnerships.length, 16, "expected 16 German pathways")

const universityIds = database.frenchUniversities.map(({ id }) => id)
const partnershipIds = database.partnerships.map(({ id }) => id)
assert.equal(new Set(universityIds).size, universityIds.length, "duplicate university id")
assert.equal(new Set(partnershipIds).size, partnershipIds.length, "duplicate partnership id")

const statuses = new Set(["confirmed", "to_confirm", "incomplete"])
for (const partnership of database.partnerships) {
  assert.ok(universityIds.includes(partnership.frenchUniversityId), `unknown university: ${partnership.id}`)
  assert.ok(partnership.officialLink.startsWith("https://"), `missing official HTTPS source: ${partnership.id}`)
  assert.ok(statuses.has(partnership.reliabilityStatus), `invalid reliability: ${partnership.id}`)
}

console.log("German dataset verified: 8 faculties, 16 pathways")
