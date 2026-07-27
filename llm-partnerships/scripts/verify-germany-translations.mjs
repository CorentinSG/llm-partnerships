import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptsDirectory, "..")
const translationsPath = join(projectRoot, "data", "germany-translations.json")

assert.ok(
  existsSync(translationsPath),
  "Germany EN/ES data translations must exist",
)

const jiti = jitiModule(import.meta.url, {
  alias: { "@": join(projectRoot, "src") },
})
const { getAllGermanPartnerships, getGermanUniversitiesPoints } = jiti(
  join(projectRoot, "src", "lib", "germany-data.ts"),
)
const translations = JSON.parse(readFileSync(translationsPath, "utf8"))

const values = new Set()
const add = (value) => {
  if (typeof value === "string" && value.trim()) values.add(value)
}

for (const university of getGermanUniversitiesPoints()) {
  add(university.frenchUniversity)
  add(university.frenchFaculty)
  add(university.city)
}

for (const partnership of getAllGermanPartnerships()) {
  for (const field of [
    "frenchUniversity",
    "frenchFaculty",
    "city",
    "partnerCountry",
    "partnerUniversity",
    "partnerCity",
    "partnerState",
    "continent",
    "programType",
    "partnershipType",
    "requiredLevel",
    "programLanguage",
    "duration",
    "shortDescription",
    "admissionConditions",
    "availableSeats",
    "availableSeatsDisplay",
    "tuition",
    "tuitionCategory",
    "tuitionDisplay",
    "financialAid",
    "applicationYear",
    "applicationDeadline",
    "sourceNote",
    "notes",
  ]) {
    add(partnership[field])
  }

  for (const value of partnership.specialties || []) add(value)
  for (const value of partnership.missingInformation || []) add(value)
  for (const test of partnership.languageTests || []) {
    add(test.test)
    add(test.minimumScore)
    add(test.details)
  }
  for (const attachment of partnership.attachments || []) {
    add(attachment.label)
    add(attachment.note)
  }
}

for (const language of ["en", "es"]) {
  assert.equal(
    typeof translations[language],
    "object",
    `Germany ${language} translations must be an object`,
  )
  const missing = [...values].filter(
    (value) =>
      typeof translations[language][value] !== "string" ||
      !translations[language][value].trim(),
  )
  assert.deepEqual(
    missing,
    [],
    `Missing Germany ${language} translations:\n${missing.join("\n")}`,
  )
}

assert.equal(translations.en["États-Unis"], "United States")
assert.equal(translations.es["États-Unis"], "Estados Unidos")
assert.equal(translations.en["Amérique du Nord"], "North America")
assert.equal(translations.es["Amérique du Nord"], "América del Norte")

console.log(
  `Germany translations verified: ${values.size} values mapped in EN and ES`,
)
