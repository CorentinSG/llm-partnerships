import databaseRaw from "../../data/uk-database.json"

import type { PartnershipsDatabase } from "@/lib/database-schema"
import type {
  FrenchUniversityPoint,
  Partnership,
  TuitionCategory,
} from "@/lib/types"

const ukDatabase = databaseRaw as PartnershipsDatabase

function inferSeats(minimum: number | null, maximum: number | null, unknown: string) {
  if (minimum == null && maximum == null) return unknown
  const min = minimum ?? maximum
  const max = maximum ?? minimum
  if (min == null || max == null) return unknown
  if (min === 1 && max === 1) return "1"
  if (min === 2 && max === 2) return "2"
  return "3+"
}

function mapTuitionCategory(category: string): TuitionCategory {
  const categories: Record<string, TuitionCategory> = {
    no_tuition: "sans frais",
    fixed_fee: "frais réduits",
    reduced_tuition: "frais réduits",
    scholarship_possible: "bourse possible",
    full_or_unknown: "Non communiqué",
    to_confirm: "Non communiqué",
  }
  return categories[category] || "Non communiqué"
}

const ukPartnerships: Partnership[] = ukDatabase.partnerships.map((partnership) => {
  const institution = ukDatabase.frenchUniversities.find(
    (candidate) => candidate.id === partnership.frenchUniversityId,
  )
  const unknown = ukDatabase.unknownValue
  const partnershipType =
    partnership.partnershipType && ukDatabase.partnershipTypes[partnership.partnershipType]
      ? ukDatabase.partnershipTypes[partnership.partnershipType]
      : partnership.partnershipType || undefined

  return {
    id: partnership.id,
    frenchUniversity: institution?.name || partnership.frenchUniversity,
    frenchFaculty: institution?.faculty || unknown,
    city: institution?.city || unknown,
    coordinates: institution?.coordinates || { lat: 54.5, lng: -3.5 },
    partnerCountry: partnership.partnerCountry,
    partnerUniversity: partnership.partnerUniversity,
    partnerCity: partnership.partnerCity,
    partnerState: partnership.partnerState,
    partnerCoordinates: partnership.partnerCoordinates,
    continent: partnership.continent,
    programType: partnership.programType,
    partnershipType,
    tuitionBenefitScope:
      partnership.tuitionCategory === "scholarship_possible" ||
      partnership.tuitionCategory === "to_confirm"
        ? "conditional_llm"
        : partnership.tuitionCategory === "full_or_unknown"
          ? "unknown"
          : "llm",
    specialties: partnership.specialties,
    requiredLevel: partnership.requiredLevel,
    programLanguage: partnership.programLanguage,
    duration: partnership.duration,
    applicationProcess:
      partnership.applicationProcess === "internal"
        ? "internal"
        : partnership.applicationProcess === "lsac"
          ? "lsac"
          : (unknown as Partnership["applicationProcess"]),
    officialLink: partnership.officialLink,
    attachments: partnership.attachments || [],
    shortDescription: partnership.shortDescription,
    admissionConditions: partnership.admissionConditions,
    languageTests: partnership.languageTests.length
      ? partnership.languageTests
      : [{ test: unknown, minimumScore: unknown }],
    availableSeats: inferSeats(
      partnership.availableSeatsMin,
      partnership.availableSeatsMax,
      unknown,
    ),
    availableSeatsDisplay: partnership.availableSeatsDisplay,
    availableSeatsMin: partnership.availableSeatsMin,
    availableSeatsMax: partnership.availableSeatsMax,
    tuition: partnership.tuitionDisplay,
    tuitionCategory: mapTuitionCategory(partnership.tuitionCategory),
    tuitionDisplay: partnership.tuitionDisplay,
    financialAid: partnership.financialAid,
    applicationYear: partnership.applicationYear,
    applicationDeadline: partnership.applicationDeadline,
    sourceType: partnership.sourceType,
    sourceNote: partnership.sourceNote,
    reliabilityStatus: partnership.reliabilityStatus,
    missingInformation: partnership.missingInformation,
    notes: partnership.notes,
  }
})

export function getAllUkPartnerships(): Partnership[] {
  return ukPartnerships
}

export function getUkPartnershipById(id: string): Partnership | undefined {
  return ukPartnerships.find((partnership) => partnership.id === id)
}

export function getUkUniversitiesPoints(): FrenchUniversityPoint[] {
  return ukDatabase.frenchUniversities.map((institution) => ({
    frenchUniversity: institution.name,
    frenchFaculty: institution.faculty,
    city: institution.city,
    coordinates: institution.coordinates,
  }))
}

export function getUkFilterOptions() {
  const unique = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

  return {
    frenchUniversities: unique(getUkUniversitiesPoints().map((item) => item.frenchUniversity)),
    partnerCountries: unique(ukPartnerships.map((item) => item.partnerCountry)),
    partnerStates: unique(ukPartnerships.map((item) => item.partnerState || "")),
    continents: unique(ukPartnerships.map((item) => item.continent)),
    partnerUniversities: unique(ukPartnerships.map((item) => item.partnerUniversity)),
    programTypes: unique(ukPartnerships.map((item) => item.programType)),
    partnershipTypes: unique(ukPartnerships.map((item) => item.partnershipType || unknownValue())),
    specialties: unique(ukPartnerships.flatMap((item) => item.specialties || [])),
    requiredLevels: unique(ukPartnerships.map((item) => String(item.requiredLevel))),
    programLanguages: unique(ukPartnerships.map((item) => item.programLanguage)),
    languageTests: unique(
      ukPartnerships.flatMap((item) => (item.languageTests || []).map((test) => test.test)),
    ),
    tuitionCategories: unique(
      ukPartnerships.map((item) => item.tuitionCategory || ukDatabase.unknownValue),
    ),
    seats: unique(ukPartnerships.map((item) => String(item.availableSeats))),
    reliabilityStatuses: unique(ukPartnerships.map((item) => item.reliabilityStatus)),
  }
}

function unknownValue() {
  return ukDatabase.unknownValue
}
