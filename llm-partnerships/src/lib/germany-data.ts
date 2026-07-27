import databaseRaw from "../../data/germany-database.json"

import type { PartnershipsDatabase } from "@/lib/database-schema"
import type { FrenchUniversityPoint, Partnership } from "@/lib/types"
import { cleanText } from "@/lib/text-utils"

const germanyDatabase = databaseRaw as PartnershipsDatabase

function inferSeats(
  availableSeatsMin: number | null,
  availableSeatsMax: number | null,
  availableSeatsDisplay: string,
  unknownValue: string
) {
  if (
    availableSeatsDisplay &&
    availableSeatsDisplay.toLowerCase().includes("pas") &&
    availableSeatsDisplay.toLowerCase().includes("limite")
  ) {
    return "pas de limite"
  }
  if (availableSeatsMin == null && availableSeatsMax == null) return unknownValue
  const min = availableSeatsMin ?? availableSeatsMax
  const max = availableSeatsMax ?? availableSeatsMin
  if (min == null || max == null) return unknownValue
  if (min === 1 && max === 1) return "1"
  if (min === 2 && max === 2) return "2"
  if (min >= 3 || max >= 3) return "3+"
  if (min === max) return String(min)
  return "3+"
}

function mapTuitionCategory(category: string, unknownValue: string) {
  const map: Record<string, string> = {
    no_tuition: "sans frais",
    fixed_fee: "frais rÃ©duits",
    reduced_tuition: "frais rÃ©duits",
    scholarship_possible: "bourse possible",
    full_or_unknown: unknownValue,
    to_confirm: unknownValue
  }
  return map[category] || unknownValue
}

function normalizeRequiredLevel(value: string, unknownValue: string) {
  const v = cleanText(value).trim()
  if (!v) return unknownValue
  const n = v.toLowerCase()
  if (n.includes("non communiqu")) return unknownValue
  if (n.includes("accessible dÃ¨s m1") || n.includes("accessible des m1")) return "M1"
  if (n.includes("m1 ou m2")) return "M1 ou M2"
  if (n.includes("4 annÃ©es") || n.includes("4 annees")) return "M1 ou M2"
  if (
    n === "m2" ||
    n.includes("m2 (") ||
    n.includes("fin de master") ||
    n.includes("master 2 de droit") ||
    n === "master 2" ||
    n === "master 2 de droit" ||
    n.includes("master juriste trilingue")
  ) {
    return "M2"
  }
  if (n === "m1") return "M1"
  if (n === "l3") return "L3"
  return v
}

function mapApplicationProcess(
  value: string,
  admissionConditions: string,
  unknownValue: string
): Partnership["applicationProcess"] {
  if (value === "internal") return "internal"
  if (value === "lsac") return "lsac"
  if (value === "non_communique") return unknownValue as Partnership["applicationProcess"]

  const text = admissionConditions.toLowerCase()
  if (text.includes("lsac")) return "lsac"
  return unknownValue as Partnership["applicationProcess"]
}

const germanPartnerships: Partnership[] = germanyDatabase.partnerships.map((partnership) => {
  const university = germanyDatabase.frenchUniversities.find(
    (candidate) => candidate.id === partnership.frenchUniversityId
  )
  const unknown = germanyDatabase.unknownValue || "Non communiquÃ©"
  const partnershipType =
    partnership.partnershipType && germanyDatabase.partnershipTypes?.[partnership.partnershipType]
      ? germanyDatabase.partnershipTypes[partnership.partnershipType]
      : partnership.partnershipType || undefined

  return {
    id: partnership.id,
    frenchUniversity: university?.name || partnership.frenchUniversity,
    frenchFaculty: university?.faculty || unknown,
    city: university?.city || unknown,
    coordinates: university?.coordinates || { lat: 51.1657, lng: 10.4515 },
    partnerCountry: partnership.partnerCountry || unknown,
    partnerUniversity: partnership.partnerUniversity || unknown,
    partnerCity: partnership.partnerCity || undefined,
    partnerState: partnership.partnerState || undefined,
    partnerCoordinates: partnership.partnerCoordinates || undefined,
    continent: partnership.continent || unknown,
    programType: partnership.programType || unknown,
    partnershipType,
    specialties: partnership.specialties?.length ? partnership.specialties : [unknown],
    requiredLevel: normalizeRequiredLevel(partnership.requiredLevel || unknown, unknown),
    programLanguage: partnership.programLanguage || unknown,
    duration: partnership.duration || unknown,
    applicationProcess: mapApplicationProcess(
      partnership.applicationProcess,
      partnership.admissionConditions,
      unknown
    ),
    officialLink: partnership.officialLink || "",
    attachments: partnership.attachments || [],
    shortDescription: partnership.shortDescription || unknown,
    admissionConditions: partnership.admissionConditions || unknown,
    languageTests:
      partnership.languageTests?.length > 0
        ? partnership.languageTests.map((test) => ({
            test: test.test,
            minimumScore: test.minimumScore,
            details: test.details
          }))
        : [{ test: unknown, minimumScore: unknown }],
    availableSeats: inferSeats(
      partnership.availableSeatsMin,
      partnership.availableSeatsMax,
      partnership.availableSeatsDisplay,
      unknown
    ),
    availableSeatsDisplay: partnership.availableSeatsDisplay,
    availableSeatsMin: partnership.availableSeatsMin,
    availableSeatsMax: partnership.availableSeatsMax,
    tuition: partnership.tuitionDisplay || unknown,
    tuitionCategory: mapTuitionCategory(partnership.tuitionCategory, unknown) as Partnership["tuitionCategory"],
    tuitionDisplay: partnership.tuitionDisplay,
    financialAid: partnership.financialAid || unknown,
    applicationYear: partnership.applicationYear || unknown,
    applicationDeadline: partnership.applicationDeadline || unknown,
    sourceType: partnership.sourceType,
    sourceNote: partnership.sourceNote,
    reliabilityStatus: partnership.reliabilityStatus,
    missingInformation: partnership.missingInformation || [],
    notes: partnership.notes || ""
  }
})

export function getAllGermanPartnerships(): Partnership[] {
  return germanPartnerships
}

export function getGermanPartnershipById(id: string): Partnership | undefined {
  return germanPartnerships.find((partnership) => partnership.id === id)
}

export function getGermanUniversitiesPoints(): FrenchUniversityPoint[] {
  return germanyDatabase.frenchUniversities.map((university) => ({
    frenchUniversity: university.name,
    frenchFaculty: university.faculty,
    city: university.city,
    coordinates: university.coordinates
  }))
}

export function getGermanFilterOptions() {
  const uniq = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

  return {
    frenchUniversities: uniq(getGermanUniversitiesPoints().map((university) => university.frenchUniversity)),
    partnerCountries: uniq(germanPartnerships.map((partnership) => partnership.partnerCountry)),
    partnerStates: uniq(
      germanPartnerships
        .map((partnership) => partnership.partnerState || "")
        .filter((state) => Boolean(state))
    ),
    continents: uniq(germanPartnerships.map((partnership) => partnership.continent)),
    partnerUniversities: uniq(germanPartnerships.map((partnership) => partnership.partnerUniversity)),
    programTypes: uniq(germanPartnerships.map((partnership) => partnership.programType)),
    partnershipTypes: uniq(
      germanPartnerships.map((partnership) => partnership.partnershipType || germanyDatabase.unknownValue)
    ),
    specialties: uniq(germanPartnerships.flatMap((partnership) => partnership.specialties || [])),
    requiredLevels: uniq(germanPartnerships.map((partnership) => String(partnership.requiredLevel))),
    programLanguages: uniq(germanPartnerships.map((partnership) => partnership.programLanguage)),
    languageTests: uniq(
      germanPartnerships.flatMap((partnership) => (partnership.languageTests || []).map((test) => test.test))
    ),
    tuitionCategories: uniq(
      germanPartnerships.map((partnership) => partnership.tuitionCategory || germanyDatabase.unknownValue)
    ),
    seats: uniq(germanPartnerships.map((partnership) => String(partnership.availableSeats))),
    reliabilityStatuses: uniq(germanPartnerships.map((partnership) => partnership.reliabilityStatus))
  }
}
