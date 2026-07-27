import assert from "node:assert/strict"
import database from "../data/germany-database.json" with { type: "json" }

assert.equal(database.frenchUniversities.length, 8, "expected 8 German faculties")
assert.equal(database.partnerships.length, 16, "expected 16 German pathways")

const universityIds = database.frenchUniversities.map(({ id }) => id)
const partnershipIds = database.partnerships.map(({ id }) => id)
assert.equal(new Set(universityIds).size, universityIds.length, "duplicate university id")
assert.equal(new Set(partnershipIds).size, partnershipIds.length, "duplicate partnership id")

const statuses = new Set(["confirmed", "to_confirm", "incomplete"])
const officialHosts = new Set([
  "law.vanderbilt.edu",
  "www.jura.fu-berlin.de",
  "www.jura.hhu.de",
  "www.jura.uni-freiburg.de",
  "www.rewi.hu-berlin.de",
  "www.uni-augsburg.de",
  "www.uni-mannheim.de",
  "www.uni-muenster.de",
  "www.uni-regensburg.de",
])
const requiredStringFields = [
  "programType",
  "partnershipType",
  "shortDescription",
  "availableSeatsDisplay",
  "tuitionDisplay",
  "financialAid",
  "applicationDeadline",
  "sourceNote",
  "notes",
]

for (const partnership of database.partnerships) {
  assert.ok(universityIds.includes(partnership.frenchUniversityId), `unknown university: ${partnership.id}`)
  assert.ok(statuses.has(partnership.reliabilityStatus), `invalid reliability: ${partnership.id}`)

  for (const field of requiredStringFields) {
    assert.equal(typeof partnership[field], "string", `${field} must be a string: ${partnership.id}`)
    assert.ok(partnership[field].trim(), `${field} must not be empty: ${partnership.id}`)
  }
  assert.ok(Array.isArray(partnership.missingInformation), `missingInformation must be an array: ${partnership.id}`)
  assert.ok(
    partnership.missingInformation.every((item) => typeof item === "string" && item.trim()),
    `missingInformation must contain non-empty strings: ${partnership.id}`,
  )

  assert.equal(typeof partnership.officialLink, "string", `officialLink must be a string: ${partnership.id}`)
  let officialUrl
  assert.doesNotThrow(
    () => {
      officialUrl = new URL(partnership.officialLink)
    },
    `invalid official source URL: ${partnership.id}`,
  )
  assert.equal(officialUrl.protocol, "https:", `official source must use HTTPS: ${partnership.id}`)
  assert.ok(officialUrl.hostname, `official source must have a host: ${partnership.id}`)
  assert.ok(officialHosts.has(officialUrl.hostname), `unapproved official source host: ${partnership.id}`)
}

const getPartnership = (id) => {
  const partnership = database.partnerships.find((candidate) => candidate.id === id)
  assert.ok(partnership, `missing expected pathway: ${id}`)
  return partnership
}

const muenster = getPartnership("muenster-uconn-pathway")
assert.equal(muenster.availableSeatsMax, 4, "Münster source publishes up to 4 nominations")
assert.match(muenster.availableSeatsDisplay, /\b4\b/, "Münster seat display must show 4 nominations")
assert.match(muenster.applicationDeadline, /30 août 2026/, "Münster deadline must be dated 30 August 2026")
assert.match(muenster.sourceNote, /26 juillet 2026/, "Münster source verification must be dated")
assert.doesNotMatch(JSON.stringify(muenster), /sept nominations|7 nominations/i, "stale Münster quota")

const humboldt = getPartnership("humboldt-berlin-minnesota-llm")
assert.equal(humboldt.availableSeatsMin, 2, "Humboldt–Minnesota publishes 2 places")
assert.equal(humboldt.availableSeatsMax, 2, "Humboldt–Minnesota publishes 2 places")
assert.match(humboldt.applicationDeadline, /31 janvier.*août/i, "Humboldt deadline must show January 31 for August")
assert.match(humboldt.requiredLevel, /Prädikat/, "Humboldt requires the first exam with distinction")
assert.match(humboldt.duration, /année académique.*août.*mai/i, "Humboldt LL.M. is an August–May academic year")
assert.match(humboldt.programType, /sur campus/i, "Humboldt LL.M. must be identified as on-campus")
assert.equal(
  humboldt.languageTests.find(({ test }) => test === "TOEFL iBT")?.minimumScore,
  "80",
  "Humboldt TOEFL minimum is 80",
)
assert.equal(
  humboldt.languageTests.find(({ test }) => test === "IELTS")?.minimumScore,
  "6,5",
  "Humboldt IELTS minimum is 6.5",
)
assert.equal(humboldt.reliabilityStatus, "confirmed", "Humboldt current official terms are confirmed")
assert.ok(
  humboldt.missingInformation.every((item) => /tuition|frais de scolarité/i.test(item)),
  "Humboldt missing information must be limited to tuition",
)

const mannheim = getPartnership("mannheim-uconn-llm-pathway")
assert.equal(mannheim.reliabilityStatus, "to_confirm", "Mannheim–UConn current operations are unverified")
assert.match(mannheim.sourceNote, /5 février 2024/, "Mannheim evidence date must be explicit")
assert.match(mannheim.sourceNote, /historique/i, "Mannheim evidence must be labelled historical")
assert.match(
  mannheim.sourceNote,
  /modalités opérationnelles actuelles non vérifiées/i,
  "Mannheim current operational terms must be marked unverified",
)

for (const augsburg of database.partnerships.filter(({ frenchUniversityId }) => frenchUniversityId === "augsburg")) {
  assert.match(augsburg.applicationDeadline, /30 novembre 2026/, `Augsburg deadline must be dated: ${augsburg.id}`)
}

console.log("German dataset verified: 8 faculties, 16 pathways")
