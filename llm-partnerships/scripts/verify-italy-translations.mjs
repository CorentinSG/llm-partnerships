import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const translationsPath = join(projectRoot, "data", "italy-translations.json")
assert.ok(existsSync(translationsPath), "Italy EN/ES/DE data translations must exist")

const jiti = jitiModule(import.meta.url, { alias: { "@": join(projectRoot, "src") } })
const { getAllItalianPartnerships, getItalianUniversitiesPoints } = jiti(
  join(projectRoot, "src", "lib", "italy-data.ts"),
)
const translations = JSON.parse(readFileSync(translationsPath, "utf8"))
const values = new Set()
const add = (value) => typeof value === "string" && value.trim() && values.add(value)

for (const university of getItalianUniversitiesPoints()) {
  add(university.frenchUniversity)
  add(university.frenchFaculty)
  add(university.city)
}
for (const partnership of getAllItalianPartnerships()) {
  for (const field of [
    "frenchUniversity", "frenchFaculty", "city", "partnerCountry",
    "partnerUniversity", "partnerCity", "partnerState", "continent",
    "programType", "partnershipType", "requiredLevel", "programLanguage",
    "duration", "shortDescription", "admissionConditions", "availableSeats",
    "availableSeatsDisplay", "tuition", "tuitionCategory", "tuitionDisplay",
    "financialAid", "applicationYear", "applicationDeadline", "sourceNote", "notes",
  ]) add(partnership[field])
  for (const value of partnership.specialties || []) add(value)
  for (const value of partnership.missingInformation || []) add(value)
  for (const test of partnership.languageTests || []) {
    add(test.test); add(test.minimumScore); add(test.details)
  }
  for (const attachment of partnership.attachments || []) {
    add(attachment.label); add(attachment.note)
  }
}

for (const language of ["en", "es", "de", "it"]) {
  assert.equal(typeof translations[language], "object", `Italy ${language} translations must be an object`)
  const missing = [...values].filter((value) => !translations[language][value]?.trim())
  assert.deepEqual(missing, [], `Missing Italy ${language} translations:\n${missing.join("\n")}`)
}

for (const university of getItalianUniversitiesPoints()) {
  for (const language of ["en", "es", "de", "it"]) {
    assert.equal(
      translations[language][university.frenchUniversity],
      university.frenchUniversity,
      `Italian institution names must remain unchanged in ${language}`,
    )
  }
}

assert.equal(translations.en["États-Unis"], "United States")
assert.equal(translations.es["États-Unis"], "Estados Unidos")
assert.equal(translations.de["États-Unis"], "Vereinigte Staaten")
assert.equal(translations.en["Amérique du Nord"], "North America")
assert.equal(translations.es["Amérique du Nord"], "América del Norte")
assert.equal(translations.de["Amérique du Nord"], "Nordamerika")

const noFee = "« No Fee » signifie aucun frais de scolarité supplémentaire à Fordham, et non un LL.M. gratuit."
assert.match(translations.en[noFee], /no additional tuition fees.*not.*free LL\.M/i)
assert.match(translations.es[noFee], /(?:sin|no hay) tasas de matrícula adicionales.*no.*LL\.M.*gratuito/i)
assert.match(translations.de[noFee], /keine zusätzlichen Studiengebühren.*nicht.*kostenlosen LL\.M/i)

const cardozo = "L’accord ne garantit ni l’admission, ni le taux maximal de bourse, ni l’éligibilité au New York Bar."
for (const language of ["en", "es", "de"]) {
  assert.match(translations[language][cardozo], /Cardozo|admi|Zulassung/i)
  assert.match(translations[language][cardozo], /New York Bar|Colegio de Abogados de Nueva York|New Yorker Anwaltsprüfung/i)
}

console.log(`Italy translations verified: ${values.size} values mapped in EN, ES, DE and IT`)
