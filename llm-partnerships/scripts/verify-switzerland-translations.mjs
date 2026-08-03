import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const path = join(root, "data", "switzerland-translations.json")
assert.ok(existsSync(path), "Swiss translations must exist")
const translations = JSON.parse(readFileSync(path, "utf8"))
const jiti = jitiModule(import.meta.url, { alias: { "@": join(root, "src") } })
const { getAllSwissPartnerships, getSwissUniversitiesPoints } = jiti(join(root, "src", "lib", "switzerland-data.ts"))
const values = new Set()
const names = new Set()
const add = (value) => typeof value === "string" && value.trim() && values.add(value)

for (const university of getSwissUniversitiesPoints()) {
  Object.values(university).forEach(add)
  names.add(university.frenchUniversity)
  names.add(university.frenchFaculty)
}
for (const partnership of getAllSwissPartnerships()) {
  for (const field of ["frenchUniversity", "frenchFaculty", "city", "partnerCountry", "partnerUniversity", "partnerCity", "partnerState", "continent", "programType", "partnershipType", "requiredLevel", "programLanguage", "duration", "shortDescription", "admissionConditions", "availableSeats", "availableSeatsDisplay", "tuition", "tuitionCategory", "tuitionDisplay", "financialAid", "applicationYear", "applicationDeadline", "sourceNote", "notes"]) add(partnership[field])
  partnership.specialties?.forEach(add)
  partnership.missingInformation?.forEach(add)
  partnership.languageTests?.forEach((test) => { add(test.test); add(test.minimumScore); add(test.details) })
  names.add(partnership.frenchUniversity)
  names.add(partnership.frenchFaculty)
  names.add(partnership.partnerUniversity)
}

for (const language of ["en", "es", "de", "it"]) {
  assert.equal(typeof translations[language], "object", `${language} translations must exist`)
  const missing = [...values].filter((value) => !translations[language][value]?.trim())
  assert.deepEqual(missing, [], `Missing Swiss ${language} translations:\n${missing.join("\n")}`)
  for (const name of names) assert.equal(translations[language][name], name, `Official name changed in ${language}: ${name}`)
}

assert.equal(translations.en.Suisse, "Switzerland")
assert.equal(translations.es.Suisse, "Suiza")
assert.equal(translations.de.Suisse, "Schweiz")
assert.equal(translations.it.Suisse, "Svizzera")
console.log(`Swiss translations verified: ${values.size} values mapped in EN, ES, DE and IT`)
