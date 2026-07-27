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

const semanticSentinels = {
  "Bourse partielle dépendant des ressources de Suffolk et du nombre de participants; très probable si deux candidats admissibles au plus, mais non garantie.": {
    en: "Partial scholarship dependent on Suffolk's available funding and the number of participants; very likely when there are at most two eligible candidates, but not guaranteed.",
    es: "Beca parcial sujeta a los fondos disponibles de Suffolk y al número de participantes; muy probable cuando haya como máximo dos candidatos elegibles, pero no garantizada.",
  },
  "Échange créditable vers un LL.M.": {
    en: "Creditable exchange toward an LL.M.",
    es: "Intercambio con créditos computables para un LL.M.",
  },
  "Échange sans frais de scolarité à Chicago-Kent dont les crédits peuvent contribuer à un LL.M. ultérieur; aucun LL.M. n’est délivré par le semestre seul.": {
    en: "Tuition-free exchange at Chicago-Kent whose academic credits can count toward a later LL.M.; the exchange semester alone does not award an LL.M.",
    es: "Intercambio sin tasas de matrícula en Chicago-Kent cuyos créditos académicos pueden computarse para un LL.M. posterior; el semestre de intercambio por sí solo no otorga un LL.M.",
  },
  "Première épreuve juridique avec mention (Erste Juristische Prüfung mit Prädikat)": {
    en: "First State Examination in Law with honors (Erste Juristische Prüfung mit Prädikat)",
    es: "Primer examen estatal de Derecho con mención de honor (Erste Juristische Prüfung mit Prädikat)",
  },
  "Nomination ou parcours LL.M. facilité, sans admission garantie": {
    en: "Nomination or facilitated LL.M. pathway, without guaranteed admission",
    es: "Nominación o vía facilitada hacia un LL.M., sin admisión garantizada",
  },
  "À partir du 5e semestre": {
    en: "From the fifth semester onward",
    es: "A partir del quinto semestre",
  },
  "Le maximum de deux places est un plafond, non une garantie de deux admissions. La remise est entièrement discrétionnaire.": {
    en: "The maximum of two places is a cap, not a guarantee of two admissions. The discount is entirely discretionary.",
    es: "El máximo de dos plazas es un límite, no una garantía de dos admisiones. El descuento queda enteramente a discreción de la universidad.",
  },
  "Une nomination crée une éligibilité à la bourse, pas un droit à 50 % ni une garantie d’admission.": {
    en: "A nomination creates eligibility for the scholarship, not an entitlement to 50% or a guarantee of admission.",
    es: "Una nominación da derecho a optar a la beca, no a recibir un 50 % ni garantiza la admisión.",
  },
}

for (const [source, expected] of Object.entries(semanticSentinels)) {
  assert.equal(translations.en[source], expected.en, `English semantic sentinel: ${source}`)
  assert.equal(translations.es[source], expected.es, `Spanish semantic sentinel: ${source}`)
}

assert.match(
  translations.en[
    "Remise décidée par UConn: jusqu’à 30 % historiquement pour les profils remplissant les critères; 5 à 20 % possible dans certains dossiers moins bien classés."
  ],
  /historically.*5% to 20% may be available/i,
)
assert.match(
  translations.es[
    "Remise décidée par UConn: jusqu’à 30 % historiquement pour les profils remplissant les critères; 5 à 20 % possible dans certains dossiers moins bien classés."
  ],
  /históricamente.*puede concederse entre un 5 % y un 20 %/i,
)
assert.match(
  translations.en[
    "Les personnes nommées sont éligibles à une bourse UConn allant jusqu’à 50 %."
  ],
  /eligible.*up to 50%/i,
)
assert.match(
  translations.es[
    "Les personnes nommées sont éligibles à une bourse UConn allant jusqu’à 50 %."
  ],
  /pueden optar.*hasta el 50 %/i,
)
assert.match(
  translations.en[
    "Aucune aide financière actuelle propre à Mannheim n’est établie par l’annonce historique."
  ],
  /historical announcement does not establish any current/i,
)
assert.match(
  translations.es[
    "Aucune aide financière actuelle propre à Mannheim n’est établie par l’annonce historique."
  ],
  /anuncio histórico no acredita ninguna ayuda financiera actual/i,
)

console.log(
  `Germany translations verified: ${values.size} values mapped in EN and ES`,
)
