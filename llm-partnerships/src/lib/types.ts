export type ReliabilityStatus = "confirmed" | "to_confirm" | "incomplete"

export type RequiredLevel =
  | "L3"
  | "M1"
  | "M2"
  | "post-M2"
  | "M1 or M2"
  | "Non communiqué"

export type Seats =
  | "1"
  | "2"
  | "3+"
  | "pas de limite"
  | "1 à 5"
  | "Non communiqué"

export type TuitionCategory =
  | "sans frais"
  | "frais réduits"
  | "frais complets"
  | "bourse possible"
  | "Non communiqué"

export interface Coordinates {
  lat: number
  lng: number
}

export interface LanguageTest {
  test: string
  minimumScore: string
  details?: string
}

export interface Partnership {
  id: string
  frenchUniversity: string
  frenchFaculty: string
  city: string
  coordinates: Coordinates
  partnerCountry: string
  partnerUniversity: string
  partnerCity?: string
  partnerState?: string
  partnerCoordinates?: Coordinates
  continent: string
  programType: string
  partnershipType?: string
  tuitionBenefitScope?: "llm" | "exchange_only" | "conditional_llm" | "unknown"
  programName?: string
  degreesAwarded?: string[]
  usTrack?: {
    name?: string
    location?: string
    structure?: string
    degree?: string
    tuition?: string
    barOptionAvailable?: boolean
  }
  nyBarOption?: {
    available?: boolean
    confirmed?: boolean
    additionalSemesterRequired?: boolean
    additionalSemesterCost?: string
    additionalInsurance?: string
    eligibilityNote?: string
    description?: string
    additionalRequirements?: string
    additionalTuition?: string
  }
  seatPolicy?: {
    hasFixedQuota?: boolean
    description?: string
    reportedCohortSize?: string
  }
  admissionSelection?: {
    selectionBasis?: string
    internalCandidates?: {
      program?: string
      oneSemesterNYRequirement?: string
      nyBarTrackRequirement?: string
      note?: string
    }
    externalCandidates?: {
      accepted?: boolean
      selectionMethod?: string
      requirements?: string
    }
  }
  specialties: string[]
  requiredLevel: RequiredLevel | string
  programLanguage: string
  duration: string
  applicationProcess?: "internal" | "lsac" | "Non communiqué"
  officialLink: string
  attachments?: { label: string; url: string; note?: string }[]
  shortDescription: string
  admissionConditions: string
  languageRequirementsSummary?: string
  frenchLanguageRequirement?: string
  languageTests: LanguageTest[]
  availableSeats: Seats | string
  availableSeatsDisplay?: string
  availableSeatsMin?: number | null
  availableSeatsMax?: number | null
  tuition: string
  tuitionCategory?: TuitionCategory
  tuitionDisplay?: string
  financialAid: string
  applicationYear: string
  applicationDeadline: string
  applicationProcessDetails?: string
  applicationDocuments?: string[]
  contactEmail?: string
  sourceType?: string
  sourceNote?: string
  reliabilityStatus: ReliabilityStatus
  missingInformation?: string[]
  notes: string
}

export interface FrenchUniversityPoint {
  frenchUniversity: string
  frenchFaculty: string
  city: string
  coordinates: Coordinates
}
