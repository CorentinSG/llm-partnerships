import exchangesRaw from "../../data/international-exchanges.json"

export type ExchangeReliability = "confirmed" | "to_confirm" | "incomplete"

export type InternationalExchange = {
  id: string
  frenchUniversity: string
  frenchFaculty: string
  frenchProgram?: string
  frenchCity: string
  partnerUniversity: string
  partnerProgram?: string
  partnerCountry: string
  partnerCity: string
  partnerState?: string
  continent: string
  mobilityType: string
  isLLM: boolean
  isDegreeGranting: boolean
  duration: string
  semester?: string
  requiredLevel: string
  programLanguage: string
  shortDescription: string
  importantClarification?: string
  barEligibilityWarning?: string
  admissionConditions: string
  selectionProcess?: string
  tuitionDisplay?: string
  financialAid?: string
  availableSeatsDisplay?: string
  officialLink?: string
  sourceType?: string
  reliabilityStatus: ExchangeReliability
  missingInformation?: string[]
  notes?: string
}

type ExchangeDb = {
  schemaVersion: string
  sectionName: string
  description: string
  warning: string
  unknownValue: string
  exchanges: InternationalExchange[]
}

const db = exchangesRaw as ExchangeDb

export function getExchangeMeta() {
  return {
    sectionName: db.sectionName,
    description: db.description,
    warning: db.warning,
    unknownValue: db.unknownValue
  }
}

export function getAllExchanges() {
  return db.exchanges || []
}

export function getExchangeById(id: string) {
  return getAllExchanges().find((x) => x.id === id)
}

export type ExchangesFilters = {
  frenchUniversity?: string
  partnerUniversity?: string
  partnerCountry?: string
  partnerCity?: string
  mobilityType?: string
  duration?: string
  requiredLevel?: string
  semester?: string
  isDegreeGranting?: "oui" | "non"
  reliabilityStatus?: ExchangeReliability
  sourceType?: string
}

export function filterExchanges(
  items: InternationalExchange[],
  query: string,
  filters: ExchangesFilters
) {
  const q = (query || "").trim().toLowerCase()
  const includes = (v: string | undefined) => (v || "").toLowerCase().includes(q)

  return items.filter((it) => {
    if (filters.frenchUniversity && it.frenchUniversity !== filters.frenchUniversity)
      return false
    if (filters.partnerUniversity && it.partnerUniversity !== filters.partnerUniversity)
      return false
    if (filters.partnerCountry && it.partnerCountry !== filters.partnerCountry) return false
    if (filters.partnerCity && it.partnerCity !== filters.partnerCity) return false
    if (filters.mobilityType && it.mobilityType !== filters.mobilityType) return false
    if (filters.duration && it.duration !== filters.duration) return false
    if (filters.requiredLevel && it.requiredLevel !== filters.requiredLevel) return false
    if (filters.semester && (it.semester || "") !== filters.semester) return false
    if (filters.isDegreeGranting) {
      const want = filters.isDegreeGranting === "oui"
      if (Boolean(it.isDegreeGranting) !== want) return false
    }
    if (filters.reliabilityStatus && it.reliabilityStatus !== filters.reliabilityStatus)
      return false
    if (filters.sourceType && (it.sourceType || "") !== filters.sourceType) return false

    if (!q) return true
    return (
      includes(it.frenchUniversity) ||
      includes(it.frenchFaculty) ||
      includes(it.frenchProgram) ||
      includes(it.partnerUniversity) ||
      includes(it.partnerProgram) ||
      includes(it.partnerCountry) ||
      includes(it.partnerCity) ||
      includes(it.partnerState) ||
      includes(it.mobilityType) ||
      includes(it.duration) ||
      includes(it.semester) ||
      includes(it.requiredLevel) ||
      includes(it.programLanguage) ||
      includes(it.shortDescription) ||
      includes(it.importantClarification) ||
      includes(it.tuitionDisplay) ||
      includes(it.notes)
    )
  })
}

export function getExchangeFilterOptions(items: InternationalExchange[]) {
  const uniq = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

  return {
    frenchUniversities: uniq(items.map((x) => x.frenchUniversity)),
    partnerUniversities: uniq(items.map((x) => x.partnerUniversity)),
    partnerCountries: uniq(items.map((x) => x.partnerCountry)),
    partnerCities: uniq(items.map((x) => x.partnerCity)),
    mobilityTypes: uniq(items.map((x) => x.mobilityType)),
    durations: uniq(items.map((x) => x.duration)),
    requiredLevels: uniq(items.map((x) => x.requiredLevel)),
    semesters: uniq(items.map((x) => x.semester || "")),
    sources: uniq(items.map((x) => x.sourceType || "")),
    reliabilityStatuses: uniq(items.map((x) => x.reliabilityStatus))
  }
}

