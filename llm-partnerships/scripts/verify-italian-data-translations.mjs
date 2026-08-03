import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import jitiModule from "jiti"

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const jiti = jitiModule(import.meta.url, { alias: { "@": join(projectRoot, "src") } })
const french = jiti(join(projectRoot, "src", "lib", "data.ts"))
const german = jiti(join(projectRoot, "src", "lib", "germany-data.ts"))
const italian = jiti(join(projectRoot, "src", "lib", "italy-data.ts"))

const dictionaries = [
  JSON.parse(readFileSync(join(projectRoot, "data", "text-translations.json"), "utf8")),
  JSON.parse(readFileSync(join(projectRoot, "data", "germany-translations.json"), "utf8")),
  JSON.parse(readFileSync(join(projectRoot, "data", "italy-translations.json"), "utf8")),
]
for (const dictionary of dictionaries) {
  assert.equal(typeof dictionary.it, "object", "Every data dictionary must expose an it object")
}

const fields = [
  "frenchUniversity", "frenchFaculty", "city", "partnerCountry", "partnerUniversity",
  "partnerCity", "partnerState", "continent", "programType", "partnershipType",
  "requiredLevel", "programLanguage", "duration", "shortDescription", "admissionConditions",
  "availableSeats", "availableSeatsDisplay", "tuition", "tuitionCategory", "tuitionDisplay",
  "financialAid", "applicationYear", "applicationDeadline", "sourceNote", "notes",
]
const values = new Set()
const officialNames = new Set()
const add = (value) => typeof value === "string" && value.trim() && values.add(value)
for (const partnership of [
  ...french.getAllPartnerships(),
  ...german.getAllGermanPartnerships(),
  ...italian.getAllItalianPartnerships(),
]) {
  for (const field of fields) add(partnership[field])
  officialNames.add(partnership.frenchUniversity)
  officialNames.add(partnership.partnerUniversity)
  for (const value of partnership.specialties || []) add(value)
  for (const value of partnership.missingInformation || []) add(value)
  for (const test of partnership.languageTests || []) {
    add(test.test); add(test.minimumScore); add(test.details)
    officialNames.add(test.test)
  }
  for (const attachment of partnership.attachments || []) {
    add(attachment.label); add(attachment.note)
  }
}

const lookup = (value) => dictionaries.find((dictionary) => dictionary.it?.[value])?.it[value]
const missing = [...values].filter((value) => !lookup(value)?.trim())
assert.deepEqual(missing, [], `Missing Italian data translations:\n${missing.join("\n")}`)

for (const name of officialNames) {
  if (name === "Non communiqué") continue
  assert.equal(lookup(name), name, `Official name must remain unchanged: ${name}`)
}
assert.equal(lookup("États-Unis"), "Stati Uniti")
assert.equal(lookup("Amérique du Nord"), "America del Nord")
assert.equal(lookup("Non communiqué"), "Non comunicato")

const fordhamNoFee = "« No Fee » signifie aucun frais de scolarité supplémentaire à Fordham, et non un LL.M. gratuit."
assert.match(lookup(fordhamNoFee), /nessuna tassa universitaria aggiuntiva.*non.*LL\.M.*gratuito/i)
const barWarning = "L’accord ne garantit ni l’admission, ni le taux maximal de bourse, ni l’éligibilité au New York Bar."
assert.match(lookup(barWarning), /non garantisce.*ammissione.*New York Bar/i)

console.log(`Italian data translations verified: ${values.size} values across three directories`)
