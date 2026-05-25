import alternativesRaw from "../../data/alternatives.json"

export type AlternativeItem = {
  id: string
  category: string
  status: string
  institution: string
  faculty: string
  city: string
  country: string
  continent: string
  programName: string
  programType: string
  isUSLLM: boolean
  isFrenchUniversityPartnership: boolean
  officialLink: string
  credits: string
  studyMode: string[]
  campus: string
  language: string
  shortDescription: string
  whyRelevant: string
  mainSubjects: string[]
  admissionConditions: {
    degreeRequirement: string
    professionalAccreditationRequirement: string
    minimumAverage: string
    languageRequirement: string
  }
  duration: {
    minimum: string
    maximum: string
  }
  tuition: {
    frenchOrBelgianFrancophoneStudents: string
    internationalStudents: string
    note: string
  }
  barEligibilityWarning: string
  displayWarning: string
  recommendedDisplaySection: string
  reliabilityStatus: "confirmed" | "to_confirm" | "incomplete"
  sourceType: string
  missingInformation: string[]
}

const db = alternativesRaw as {
  schemaVersion: string
  language: string
  unknownValue: string
  items: AlternativeItem[]
}

export function getAlternativeItems() {
  return db.items || []
}

export function searchAlternativeItems(items: AlternativeItem[], query: string) {
  const q = (query || "").trim().toLowerCase()
  if (!q) return items
  const includes = (v: string | undefined) => (v || "").toLowerCase().includes(q)
  return items.filter((it) => {
    return (
      includes(it.institution) ||
      includes(it.faculty) ||
      includes(it.programName) ||
      includes(it.programType) ||
      includes(it.city) ||
      includes(it.country) ||
      includes(it.continent) ||
      it.mainSubjects.some((s) => includes(s)) ||
      includes(it.shortDescription) ||
      includes(it.whyRelevant)
    )
  })
}

