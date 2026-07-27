import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"
import database from "../data/germany-database.json" with { type: "json" }
import frenchDatabase from "../data/database.json" with { type: "json" }

const jiti = jitiModule(import.meta.url, {
  alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
})

assert.equal(database.frenchUniversities.length, 8, "expected 8 German faculties")
assert.equal(database.partnerships.length, 16, "expected 16 German pathways")

const universityIds = database.frenchUniversities.map(({ id }) => id)
const partnershipIds = database.partnerships.map(({ id }) => id)
assert.equal(new Set(universityIds).size, universityIds.length, "duplicate university id")
assert.equal(new Set(partnershipIds).size, partnershipIds.length, "duplicate partnership id")

const statuses = new Set(["confirmed", "to_confirm", "incomplete"])
const applicationProcesses = new Set(["internal", "lsac", "non_communique"])
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
  "partnerUniversity",
  "programType",
  "partnershipType",
  "shortDescription",
  "availableSeatsDisplay",
  "tuitionDisplay",
  "financialAid",
  "applicationDeadline",
  "tuitionCategory",
  "sourceNote",
  "notes",
]

for (const university of database.frenchUniversities) {
  assert.ok(statuses.has(university.dataStatus), `invalid university data status: ${university.id}`)
  const universityPathways = database.partnerships.filter(
    ({ frenchUniversityId }) => frenchUniversityId === university.id,
  )
  if (
    universityPathways.length > 0 &&
    universityPathways.every(({ reliabilityStatus }) => reliabilityStatus === "confirmed")
  ) {
    assert.equal(
      university.dataStatus,
      "confirmed",
      `university status must match its confirmed pathways: ${university.id}`,
    )
  }
}

for (const partnership of database.partnerships) {
  assert.ok(universityIds.includes(partnership.frenchUniversityId), `unknown university: ${partnership.id}`)
  assert.ok(statuses.has(partnership.reliabilityStatus), `invalid reliability: ${partnership.id}`)
  assert.ok(
    applicationProcesses.has(partnership.applicationProcess),
    `invalid application process: ${partnership.id}`,
  )

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

const {
  getAllGermanPartnerships,
  getGermanFilterOptions,
  getGermanPartnershipById,
  getGermanUniversitiesPoints,
} = await jiti.import("../src/lib/germany-data.ts")
const { getAllPartnerships, getAnyPartnershipById, getPartnershipById } = await jiti.import("../src/lib/data.ts")

const germanPartnerships = getAllGermanPartnerships()
assert.equal(germanPartnerships.length, 16, "German loader must expose all 16 pathways")

const germanPathway = getGermanPartnershipById("humboldt-berlin-minnesota-llm")
assert.equal(germanPathway?.partnerUniversity, "University of Minnesota Law School")
assert.equal(germanPathway?.availableSeats, "2", "German loader must normalize seats")
assert.equal(
  germanPathway?.tuitionCategory,
  database.unknownValue,
  "German loader must normalize tuition categories",
)
assert.equal(getGermanPartnershipById("missing-pathway"), undefined)

const germanPoints = getGermanUniversitiesPoints()
assert.equal(germanPoints.length, 8, "German loader must expose all 8 faculties as map points")
const augsburg = database.frenchUniversities.find(({ id }) => id === "augsburg")
assert.ok(augsburg, "expected Augsburg in the raw German database")
assert.deepEqual(germanPoints.find(({ frenchUniversity }) => frenchUniversity === augsburg.name), {
  frenchUniversity: augsburg.name,
  frenchFaculty: augsburg.faculty,
  city: augsburg.city,
  coordinates: augsburg.coordinates,
})

const germanFilters = getGermanFilterOptions()
assert.ok(germanFilters.frenchUniversities.includes(augsburg.name))
assert.ok(germanFilters.partnerUniversities.includes("University of Minnesota Law School"))

assert.equal(
  getAllPartnerships().length,
  frenchDatabase.partnerships.length,
  "French list API must remain French-only",
)
assert.equal(
  getAnyPartnershipById("humboldt-berlin-minnesota-llm")?.partnerUniversity,
  "University of Minnesota Law School",
  "combined lookup must resolve a German pathway",
)
const frenchPathway = getAllPartnerships()[0]
assert.equal(getAnyPartnershipById(frenchPathway.id)?.id, getPartnershipById(frenchPathway.id)?.id)
assert.equal(getAnyPartnershipById("missing-pathway"), undefined)

console.log("German dataset verified: 8 faculties, 16 pathways")
