import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const load = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"))

const database = load("data/database.json")
const alternatives = load("data/alternatives.json")
const translations = load("data/text-translations.json")
const ignoredKeys = new Set([
  "id",
  "url",
  "sourceUrl",
  "officialUrl",
  "applicationUrl",
  "attachmentUrl",
  "frenchUniversity",
  "partnerUniversity",
  "degree",
  "test",
  "name",
])
const values = new Set()

function collect(value, key = "") {
  if (ignoredKeys.has(key)) return
  if (typeof value === "string") {
    const clean = value.trim()
    if (clean && !/^https?:\/\//.test(clean) && clean !== "fr") values.add(clean)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collect(item, key))
    return
  }
  if (value && typeof value === "object") {
    for (const [childKey, child] of Object.entries(value)) {
      collect(child, childKey)
    }
  }
}

collect(database)
collect(alternatives)

assert.equal(
  typeof translations.de,
  "object",
  "German data translations must exist",
)
const missing = [...values].filter(
  (value) =>
    typeof translations.de[value] !== "string" ||
    !translations.de[value].trim(),
)
assert.deepEqual(
  missing,
  [],
  `Missing German data translations:\n${missing.join("\n")}`,
)

console.log(`General German data translations verified: ${values.size} values`)
