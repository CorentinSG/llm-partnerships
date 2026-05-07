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
  specialties: string[]
  requiredLevel: RequiredLevel | string
  programLanguage: string
  duration: string
  officialLink: string
  attachments?: { label: string; url: string; note?: string }[]
  shortDescription: string
  admissionConditions: string
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
