import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const translationsPath = join(projectRoot, "data", "uk-translations.json")
assert.ok(existsSync(translationsPath), "UK EN/ES/DE/IT data translations must exist")

const jiti = jitiModule(import.meta.url, { alias: { "@": join(projectRoot, "src") } })
const { getAllUkPartnerships, getUkUniversitiesPoints } = jiti(
  join(projectRoot, "src", "lib", "uk-data.ts"),
)
const translations = JSON.parse(readFileSync(translationsPath, "utf8"))
const values = new Set()
const officialNames = new Set()
const add = (value) => typeof value === "string" && value.trim() && values.add(value)

for (const university of getUkUniversitiesPoints()) {
  for (const value of Object.values(university)) add(value)
  officialNames.add(university.frenchUniversity)
  officialNames.add(university.frenchFaculty)
}
for (const partnership of getAllUkPartnerships()) {
  for (const field of [
    "frenchUniversity", "frenchFaculty", "city", "partnerCountry", "partnerUniversity",
    "partnerCity", "partnerState", "continent", "programType", "partnershipType",
    "requiredLevel", "programLanguage", "duration", "shortDescription", "admissionConditions",
    "availableSeats", "availableSeatsDisplay", "tuition", "tuitionCategory", "tuitionDisplay",
    "financialAid", "applicationYear", "applicationDeadline", "sourceNote", "notes",
  ]) add(partnership[field])
  officialNames.add(partnership.frenchUniversity)
  officialNames.add(partnership.frenchFaculty)
  officialNames.add(partnership.partnerUniversity)
  for (const value of partnership.specialties || []) add(value)
  for (const value of partnership.missingInformation || []) add(value)
  for (const test of partnership.languageTests || []) {
    add(test.test)
    add(test.minimumScore)
  }
}

for (const language of ["en", "es", "de", "it"]) {
  assert.equal(typeof translations[language], "object", `UK ${language} translations must be an object`)
  const missing = [...values].filter((value) => !translations[language][value]?.trim())
  assert.deepEqual(missing, [], `Missing UK ${language} translations:\n${missing.join("\n")}`)
  for (const name of officialNames) {
    assert.equal(translations[language][name], name, `Official name must remain unchanged in ${language}: ${name}`)
  }
}

assert.equal(translations.en["Royaume-Uni"], "United Kingdom")
assert.equal(translations.es["Royaume-Uni"], "Reino Unido")
assert.equal(translations.de["Royaume-Uni"], "Vereinigtes Königreich")
assert.equal(translations.it["Royaume-Uni"], "Regno Unito")

const exchangeWarning = "L'échange seul ne confère aucun LL.M. Une admission distincte au LL.M. complet est nécessaire, avec jusqu'à 12 crédits transférables."
assert.match(translations.en[exchangeWarning], /does not award.*LL\.M.*separate admission/i)
assert.match(translations.es[exchangeWarning], /no otorga.*LL\.M.*admisión independiente/i)
assert.match(translations.de[exchangeWarning], /verleiht keinen LL\.M.*separate Zulassung/i)
assert.match(translations.it[exchangeWarning], /non conferisce.*LL\.M.*ammissione separata/i)

console.log(`UK translations verified: ${values.size} values mapped in EN, ES, DE and IT`)
