import databaseRaw from "../../data/database.json"

import type { PartnershipsDatabase } from "@/lib/database-schema"
import type { FrenchUniversityPoint, Partnership } from "@/lib/types"

const database = databaseRaw as PartnershipsDatabase

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
    fixed_fee: "frais réduits",
    reduced_tuition: "frais réduits",
    scholarship_possible: "bourse possible",
    full_or_unknown: unknownValue,
    to_confirm: unknownValue
  }
  return map[category] || unknownValue
}

function normalizeRequiredLevel(value: string, unknownValue: string) {
  const v = (value || "").trim()
  if (!v) return unknownValue
  const n = v.toLowerCase()
  if (
    n === "m2" ||
    n.includes("m2 (") ||
    n.includes("fin de master") ||
    n.includes("master 2 de droit") ||
    n === "master 2" ||
    n === "master 2 de droit"
  ) {
    return "M2"
  }
  if (n === "m1") return "M1"
  if (n === "l3") return "L3"
  return v
}

function isFrenchFeesOnly(tuitionDisplay: string | undefined) {
  if (!tuitionDisplay) return false
  const t = tuitionDisplay.toLowerCase()
  return (
    t.includes("à payer auprès de paris") ||
    t.includes("a payer aupres de paris") ||
    t.includes("à payer auprès de paris 1") ||
    t.includes("a payer aupres de paris 1") ||
    t.includes("à verser à paris") ||
    t.includes("a verser a paris") ||
    t.includes("à verser à paris-panthéon-assas") ||
    t.includes("a verser a paris-pantheon-assas") ||
    t.includes("frais de scolarité à payer auprès de paris") ||
    t.includes("frais de scolarite a payer aupres de paris")
  )
}

const partnerships: Partnership[] = database.partnerships.map((p) => {
  const uni = database.frenchUniversities.find((u) => u.id === p.frenchUniversityId)
  const unknown = database.unknownValue || "Non communiqué"
  let tuitionCategory = mapTuitionCategory(p.tuitionCategory, unknown)
  // User rule: if only French university fees are due, treat as "Sans frais"
  // (i.e., no tuition due to the US partner university).
  if (p.tuitionCategory === "fixed_fee" && isFrenchFeesOnly(p.tuitionDisplay)) {
    tuitionCategory = "sans frais"
  }
  const availableSeats = inferSeats(p.availableSeatsMin, p.availableSeatsMax, p.availableSeatsDisplay, unknown)
  const partnershipType =
    p.partnershipType && database.partnershipTypes?.[p.partnershipType]
      ? database.partnershipTypes[p.partnershipType]
      : p.partnershipType || undefined

  return {
    id: p.id,
    frenchUniversity: uni?.name || p.frenchUniversity,
    frenchFaculty: uni?.faculty || unknown,
    city: uni?.city || unknown,
    coordinates: uni?.coordinates || { lat: 46.2276, lng: 2.2137 },
    partnerCountry: p.partnerCountry || unknown,
    partnerUniversity: p.partnerUniversity || unknown,
    partnerCity: p.partnerCity || undefined,
    continent: p.continent || unknown,
    programType: p.programType || unknown,
    partnershipType,
    specialties: p.specialties?.length ? p.specialties : [unknown],
    requiredLevel: normalizeRequiredLevel(p.requiredLevel || unknown, unknown),
    programLanguage: p.programLanguage || unknown,
    duration: p.duration || unknown,
    officialLink: p.officialLink || "",
    attachments: p.attachments || [],
    shortDescription: p.shortDescription || unknown,
    admissionConditions: p.admissionConditions || unknown,
    languageTests:
      p.languageTests?.length > 0
        ? p.languageTests.map((t) => ({
            test: t.test,
            minimumScore: t.minimumScore,
            details: t.details
          }))
        : [{ test: unknown, minimumScore: unknown }],
    availableSeats,
    availableSeatsDisplay: p.availableSeatsDisplay,
    availableSeatsMin: p.availableSeatsMin,
    availableSeatsMax: p.availableSeatsMax,
    tuition: p.tuitionDisplay || unknown,
    tuitionCategory: tuitionCategory as any,
    tuitionDisplay: p.tuitionDisplay,
    financialAid: p.financialAid || unknown,
    applicationYear: p.applicationYear || unknown,
    applicationDeadline: p.applicationDeadline || unknown,
    reliabilityStatus: p.reliabilityStatus,
    missingInformation: p.missingInformation || [],
    notes: p.notes || ""
  }
})

export function getAllPartnerships() {
  return partnerships
}

export function getPartnershipById(id: string) {
  return partnerships.find((p) => p.id === id)
}

export function getFrenchUniversitiesPoints(): FrenchUniversityPoint[] {
  const byName = new Map<string, FrenchUniversityPoint>()

  for (const u of database.frenchUniversities) {
    byName.set(u.name, {
      frenchUniversity: u.name,
      frenchFaculty: u.faculty,
      city: u.city,
      coordinates: u.coordinates
    })
  }

  // Research queue: show on the map even if no partnerships are recorded yet.
  const fallbackCityCoords: Record<string, { lat: number; lng: number }> = {
    Paris: { lat: 48.8566, lng: 2.3522 },
    Nanterre: { lat: 48.8924, lng: 2.2071 },
    Saclay: { lat: 48.7326, lng: 2.1702 },
    Sceaux: { lat: 48.7789, lng: 2.2903 }
  }

  for (const item of database.researchQueue || []) {
    if (byName.has(item.frenchUniversity)) continue
    const city = item.city || database.unknownValue
    const keyCity = city.split("/")[0]?.trim() || city
    const coords = fallbackCityCoords[keyCity] || fallbackCityCoords.Paris
    byName.set(item.frenchUniversity, {
      frenchUniversity: item.frenchUniversity,
      frenchFaculty: database.unknownValue,
      city,
      coordinates: coords
    })
  }

  return Array.from(byName.values()).sort((a, b) =>
    a.frenchUniversity.localeCompare(b.frenchUniversity)
  )
}

export function getFilterOptions() {
  const uniq = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

  const frenchUniversities = uniq(getFrenchUniversitiesPoints().map((u) => u.frenchUniversity))
  const partnerCountries = uniq(partnerships.map((p) => p.partnerCountry))
  const continents = uniq(partnerships.map((p) => p.continent))
  const partnerUniversities = uniq(partnerships.map((p) => p.partnerUniversity))
  const programTypes = uniq(partnerships.map((p) => p.programType))
  const partnershipTypes = uniq(
    partnerships.map((p) => p.partnershipType || database.unknownValue)
  )
  const programLanguages = uniq(partnerships.map((p) => p.programLanguage))
  const requiredLevels = uniq(partnerships.map((p) => String(p.requiredLevel)))
  const tuitionCategories = uniq(partnerships.map((p) => p.tuitionCategory || database.unknownValue))
  const seats = uniq(partnerships.map((p) => String(p.availableSeats)))
  const reliabilityStatuses = uniq(partnerships.map((p) => p.reliabilityStatus))
  const specialties = uniq(partnerships.flatMap((p) => p.specialties || []))
  const languageTests = uniq(
    partnerships.flatMap((p) => (p.languageTests || []).map((t) => t.test))
  )

  return {
    frenchUniversities,
    partnerCountries,
    continents,
    partnerUniversities,
    programTypes,
    partnershipTypes,
    specialties,
    requiredLevels,
    programLanguages,
    languageTests,
    tuitionCategories,
    seats,
    reliabilityStatuses
  }
}

export function getDatabaseMeta() {
  return {
    projectName: database.projectName,
    language: database.language,
    schemaVersion: database.schemaVersion,
    unknownValue: database.unknownValue,
    statusDefinitions: database.statusDefinitions,
    tuitionCategories: database.tuitionCategories,
    partnershipTypes: database.partnershipTypes,
    researchQueue: database.researchQueue
  }
}
