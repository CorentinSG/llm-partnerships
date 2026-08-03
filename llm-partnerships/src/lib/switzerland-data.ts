import databaseRaw from "../../data/switzerland-database.json"

import type { PartnershipsDatabase } from "@/lib/database-schema"
import type { FrenchUniversityPoint, Partnership, TuitionCategory } from "@/lib/types"

const database = databaseRaw as PartnershipsDatabase

function seats(minimum: number | null, maximum: number | null) {
  if (minimum == null && maximum == null) return database.unknownValue
  const value = minimum ?? maximum
  if (value === 1) return "1"
  if (value === 2) return "2"
  return "3+"
}

function tuitionCategory(category: string): TuitionCategory {
  if (category === "reduced_tuition") return "frais réduits"
  if (category === "scholarship_possible") return "bourse possible"
  return "Non communiqué"
}

const partnerships: Partnership[] = database.partnerships.map((item) => {
  const institution = database.frenchUniversities.find(({ id }) => id === item.frenchUniversityId)
  return {
    id: item.id,
    frenchUniversity: institution?.name || item.frenchUniversity,
    frenchFaculty: institution?.faculty || database.unknownValue,
    city: institution?.city || database.unknownValue,
    coordinates: institution?.coordinates || { lat: 46.8, lng: 8.2 },
    partnerCountry: item.partnerCountry,
    partnerUniversity: item.partnerUniversity,
    partnerCity: item.partnerCity,
    partnerState: item.partnerState,
    partnerCoordinates: item.partnerCoordinates,
    continent: item.continent,
    programType: item.programType,
    partnershipType: item.partnershipType ? database.partnershipTypes[item.partnershipType] : undefined,
    tuitionBenefitScope: item.tuitionCategory === "reduced_tuition" ? "llm" : item.tuitionCategory === "scholarship_possible" ? "conditional_llm" : "unknown",
    specialties: item.specialties,
    requiredLevel: item.requiredLevel,
    applicationYear: item.applicationYear,
    programLanguage: item.programLanguage,
    duration: item.duration,
    applicationProcess: item.applicationProcess === "internal" ? "internal" : item.applicationProcess === "lsac" ? "lsac" : database.unknownValue as Partnership["applicationProcess"],
    officialLink: item.officialLink,
    attachments: item.attachments || [],
    shortDescription: item.shortDescription,
    admissionConditions: item.admissionConditions,
    languageTests: item.languageTests,
    availableSeats: seats(item.availableSeatsMin, item.availableSeatsMax),
    availableSeatsDisplay: item.availableSeatsDisplay,
    availableSeatsMin: item.availableSeatsMin,
    availableSeatsMax: item.availableSeatsMax,
    tuition: item.tuitionDisplay,
    tuitionCategory: tuitionCategory(item.tuitionCategory),
    tuitionDisplay: item.tuitionDisplay,
    financialAid: item.financialAid,
    applicationDeadline: item.applicationDeadline,
    sourceType: item.sourceType,
    sourceNote: item.sourceNote,
    reliabilityStatus: item.reliabilityStatus,
    missingInformation: item.missingInformation,
    notes: item.notes,
  }
})

export function getAllSwissPartnerships() { return partnerships }
export function getSwissPartnershipById(id: string) { return partnerships.find((item) => item.id === id) }
export function getSwissUniversitiesPoints(): FrenchUniversityPoint[] {
  return database.frenchUniversities.map((item) => ({ frenchUniversity: item.name, frenchFaculty: item.faculty, city: item.city, coordinates: item.coordinates }))
}
export function getSwissFilterOptions() {
  const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
  return {
    frenchUniversities: unique(getSwissUniversitiesPoints().map((item) => item.frenchUniversity)),
    partnerCountries: unique(partnerships.map((item) => item.partnerCountry)),
    partnerStates: unique(partnerships.map((item) => item.partnerState || "")),
    continents: unique(partnerships.map((item) => item.continent)),
    partnerUniversities: unique(partnerships.map((item) => item.partnerUniversity)),
    programTypes: unique(partnerships.map((item) => item.programType)),
    partnershipTypes: unique(partnerships.map((item) => item.partnershipType || database.unknownValue)),
    specialties: unique(partnerships.flatMap((item) => item.specialties || [])),
    requiredLevels: unique(partnerships.map((item) => String(item.requiredLevel))),
    programLanguages: unique(partnerships.map((item) => item.programLanguage)),
    languageTests: unique(partnerships.flatMap((item) => item.languageTests.map((test) => test.test))),
    tuitionCategories: unique(partnerships.map((item) => item.tuitionCategory || database.unknownValue)),
    seats: unique(partnerships.map((item) => String(item.availableSeats))),
    reliabilityStatuses: unique(partnerships.map((item) => item.reliabilityStatus)),
  }
}

