import type { Partnership, ReliabilityStatus } from "@/lib/types"
import { includesQuery, normalizeText } from "@/lib/text"

export interface FiltersState {
  frenchUniversity?: string
  partnerCountry?: string
  continent?: string
  partnerUniversity?: string
  partnerState?: string
  programType?: string
  partnershipType?: string
  specialties?: string[]
  requiredLevel?: string
  programLanguage?: string
  languageTests?: string[]
  tuitionCategory?: string
  availableSeats?: string
  reliabilityStatus?: ReliabilityStatus
}

export function emptyFilters(): FiltersState {
  return {
    specialties: [],
    languageTests: []
  }
}

export function filterPartnerships(
  all: Partnership[],
  searchQuery: string,
  filters: FiltersState
) {
  const q = searchQuery.trim()
  const activeSpecialties = (filters.specialties || []).filter(Boolean)
  const activeTests = (filters.languageTests || []).filter(Boolean)

  return all.filter((p) => {
    // Hide pure placeholders unless the user explicitly filters for incomplete info
    const isPlaceholder =
      p.partnerUniversity === "Non communiqué" ||
      p.partnerCountry === "Non communiqué" ||
      p.programType === "À compléter"
    if (isPlaceholder && filters.reliabilityStatus !== "incomplete") return false

    if (filters.frenchUniversity && p.frenchUniversity !== filters.frenchUniversity)
      return false
    if (filters.partnerCountry && p.partnerCountry !== filters.partnerCountry)
      return false
    if (filters.continent && p.continent !== filters.continent) return false
    if (filters.partnerUniversity && p.partnerUniversity !== filters.partnerUniversity)
      return false
    if (filters.partnerState && (p.partnerState || "") !== filters.partnerState)
      return false
    if (filters.programType && p.programType !== filters.programType) return false
    if (filters.partnershipType && p.partnershipType !== filters.partnershipType)
      return false
    if (filters.requiredLevel && String(p.requiredLevel) !== filters.requiredLevel)
      return false
    if (filters.programLanguage && p.programLanguage !== filters.programLanguage)
      return false
    if (filters.tuitionCategory) {
      const tc = p.tuitionCategory || "Non communiqué"
      if (tc !== filters.tuitionCategory) return false
    }
    if (filters.availableSeats && String(p.availableSeats) !== filters.availableSeats)
      return false
    if (filters.reliabilityStatus && p.reliabilityStatus !== filters.reliabilityStatus)
      return false

    if (activeSpecialties.length > 0) {
      const set = new Set(p.specialties || [])
      for (const spec of activeSpecialties) {
        if (!set.has(spec)) return false
      }
    }

    if (activeTests.length > 0) {
      const tests = (p.languageTests || []).map((t) => String(t.test))
      const set = new Set<string>(tests)
      for (const t of activeTests) {
        if (!set.has(t)) return false
      }
    }

    if (!q) return true
    const searchable = [
      p.frenchUniversity,
      p.frenchFaculty,
      p.city,
      p.partnerCountry,
      p.partnerUniversity,
      p.partnerCity || "",
      p.partnerState || "",
      p.continent,
      p.programType,
      p.partnershipType || "",
      (p.specialties || []).join(" "),
      p.requiredLevel,
      p.programLanguage,
      p.duration,
      p.shortDescription,
      p.admissionConditions,
      p.tuition,
      p.tuitionDisplay || "",
      p.financialAid,
      p.applicationYear,
      p.applicationDeadline,
      (p.missingInformation || []).join(" "),
      p.notes
    ]
      .filter(Boolean)
      .join(" • ")

    return includesQuery(searchable, q)
  })
}

export function countUnique(values: string[]) {
  return new Set(values.filter(Boolean)).size
}

export function getReliabilityCounts(all: Partnership[]) {
  const counts: Record<ReliabilityStatus, number> = {
    confirmed: 0,
    to_confirm: 0,
    incomplete: 0
  }
  for (const p of all) counts[p.reliabilityStatus]++
  return counts
}

export function sortByPartnerThenFrench(items: Partnership[]) {
  return [...items].sort((a, b) => {
    const pa = normalizeText(a.partnerUniversity)
    const pb = normalizeText(b.partnerUniversity)
    if (pa !== pb) return pa.localeCompare(pb)
    return normalizeText(a.frenchUniversity).localeCompare(
      normalizeText(b.frenchUniversity)
    )
  })
}
