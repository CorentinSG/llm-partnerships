import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

const databaseUrl = new URL("../data/italy-database.json", import.meta.url)
assert.ok(existsSync(databaseUrl), "Italy database must exist")

const database = JSON.parse(readFileSync(databaseUrl, "utf8"))
assert.equal(database.partnerships.length, 12, "Italy must publish 12 pathways")
assert.equal(database.frenchUniversities.length, 5, "Italy must publish 5 institutions")
assert.equal(
  new Set(database.partnerships.map((item) => item.id)).size,
  12,
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
  "trento-washu",
  "trento-cincinnati",
  "lum-indiana-maurer",
  "roma-tre-cardozo",
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

const romaTre = database.partnerships.find((item) => item.id === "roma-tre-cardozo")
assert.equal(romaTre.reliabilityStatus, "to_confirm")
assert.match(romaTre.sourceNote, /2026.?2027|actualisation|annuelle/i)

for (const id of ["luiss-fordham", "luiss-american-wcl"]) {
  const item = database.partnerships.find((candidate) => candidate.id === id)
  assert.equal(item.tuitionCategory, "no_tuition")
  assert.match(item.tuitionDisplay, /LUISS|italienne/i)
  assert.match(item.tuitionDisplay, /séjour|logement|vie/i)
}

console.log("Italy dataset verified: 5 institutions, 12 pathways")
