import databaseRaw from "../../data/italy-database.json"

import type { PartnershipsDatabase } from "@/lib/database-schema"
import type {
  FrenchUniversityPoint,
  Partnership,
  TuitionCategory,
} from "@/lib/types"

const italyDatabase = databaseRaw as PartnershipsDatabase

function inferSeats(
  minimum: number | null,
  maximum: number | null,
  unknown: string,
) {
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

const italianPartnerships: Partnership[] = italyDatabase.partnerships.map(
  (partnership) => {
    const institution = italyDatabase.frenchUniversities.find(
      (candidate) => candidate.id === partnership.frenchUniversityId,
    )
    const unknown = italyDatabase.unknownValue
    const partnershipType =
      partnership.partnershipType &&
      italyDatabase.partnershipTypes[partnership.partnershipType]
        ? italyDatabase.partnershipTypes[partnership.partnershipType]
        : partnership.partnershipType || undefined

    return {
      id: partnership.id,
      frenchUniversity: institution?.name || partnership.frenchUniversity,
      frenchFaculty: institution?.faculty || unknown,
      city: institution?.city || unknown,
      coordinates: institution?.coordinates || { lat: 41.8719, lng: 12.5674 },
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
  },
)

export function getAllItalianPartnerships(): Partnership[] {
  return italianPartnerships
}

export function getItalianPartnershipById(
  id: string,
): Partnership | undefined {
  return italianPartnerships.find((partnership) => partnership.id === id)
}

export function getItalianUniversitiesPoints(): FrenchUniversityPoint[] {
  return italyDatabase.frenchUniversities.map((institution) => ({
    frenchUniversity: institution.name,
    frenchFaculty: institution.faculty,
    city: institution.city,
    coordinates: institution.coordinates,
  }))
}

export function getItalianFilterOptions() {
  const unique = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    )

  return {
    frenchUniversities: unique(
      getItalianUniversitiesPoints().map((item) => item.frenchUniversity),
    ),
    partnerCountries: unique(
      italianPartnerships.map((item) => item.partnerCountry),
    ),
    partnerStates: unique(
      italianPartnerships.map((item) => item.partnerState || ""),
    ),
    continents: unique(italianPartnerships.map((item) => item.continent)),
    partnerUniversities: unique(
      italianPartnerships.map((item) => item.partnerUniversity),
    ),
    programTypes: unique(italianPartnerships.map((item) => item.programType)),
    partnershipTypes: unique(
      italianPartnerships.map((item) => item.partnershipType || unknownValue()),
    ),
    specialties: unique(
      italianPartnerships.flatMap((item) => item.specialties || []),
    ),
    requiredLevels: unique(
      italianPartnerships.map((item) => String(item.requiredLevel)),
    ),
    programLanguages: unique(
      italianPartnerships.map((item) => item.programLanguage),
    ),
    languageTests: unique(
      italianPartnerships.flatMap((item) =>
        (item.languageTests || []).map((test) => test.test),
      ),
    ),
    tuitionCategories: unique(
      italianPartnerships.map(
        (item) => item.tuitionCategory || italyDatabase.unknownValue,
      ),
    ),
    seats: unique(
      italianPartnerships.map((item) => String(item.availableSeats)),
    ),
    reliabilityStatuses: unique(
      italianPartnerships.map((item) => item.reliabilityStatus),
    ),
  }
}

function unknownValue() {
  return italyDatabase.unknownValue
}
