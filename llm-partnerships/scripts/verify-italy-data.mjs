import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

const databaseUrl = new URL("../data/italy-database.json", import.meta.url)
assert.ok(existsSync(databaseUrl), "Italy database must exist")

const database = JSON.parse(readFileSync(databaseUrl, "utf8"))
assert.equal(database.partnerships.length, 22, "Italy must publish 22 pathways")
assert.equal(database.frenchUniversities.length, 11, "Italy must publish 11 institutions")
assert.equal(
  new Set(database.partnerships.map((item) => item.id)).size,
  22,
  "Italy pathway IDs must be unique",
)

const expectedIds = [
  "luiss-fordham",
  "luiss-temple",
  "luiss-uc-law-sf",
  "luiss-american-wcl",
  "luiss-suffolk",
  "cattolica-fordham",
  "cattolica-boston-college",
  "cattolica-berkeley",
  "bocconi-fordham",
  "bocconi-indiana-maurer",
  "bocconi-temple",
  "genova-loyola-students",
  "genova-loyola-graduates",
  "genova-illinois",
  "trento-washu",
  "trento-cincinnati",
  "parma-widener",
  "lum-indiana-maurer",
  "firenze-boston-university",
  "bologna-uc-law-sf",
  "roma-tre-uc-law-sf",
  "napoli-federico-ii-loyola",
]
assert.deepEqual(
  database.partnerships.map((item) => item.id).sort(),
  expectedIds.sort(),
)

for (const item of database.partnerships) {
  assert.match(item.officialLink, /^https:\/\//, `${item.id}: official URL`)
  assert.ok(item.sourceNote?.trim(), `${item.id}: source note`)
  assert.ok(item.shortDescription?.trim(), `${item.id}: description`)
  assert.ok(item.tuitionDisplay?.trim(), `${item.id}: tuition display`)
  assert.ok(
    ["confirmed", "to_confirm", "incomplete"].includes(item.reliabilityStatus),
    `${item.id}: reliability status`,
  )
}

assert.equal(database.partnerships.some((item) => item.id === "roma-tre-cardozo"), false)
for (const id of ["luiss-temple", "luiss-suffolk", "bologna-uc-law-sf", "roma-tre-uc-law-sf"]) {
  const item = database.partnerships.find((candidate) => candidate.id === id)
  assert.equal(item?.reliabilityStatus, "to_confirm", `${id}: qualification must remain visible`)
}

const parma = database.partnerships.find((item) => item.id === "parma-widener")
assert.match(parma?.tuitionDisplay || "", /11.?050|6.?500/i)
assert.match(parma?.notes || "", /Delaware|barreau/i)

const trento = database.partnerships.find((item) => item.id === "trento-washu")
assert.match(trento?.notes || "", /77|New York Bar/i)

for (const id of ["luiss-fordham", "luiss-american-wcl"]) {
  const item = database.partnerships.find((candidate) => candidate.id === id)
  assert.equal(item.tuitionCategory, "no_tuition")
  assert.match(item.tuitionDisplay, /LUISS|italienne/i)
  assert.match(item.tuitionDisplay, /séjour|logement|vie/i)
}

console.log("Italy dataset verified: 11 institutions, 22 pathways")
