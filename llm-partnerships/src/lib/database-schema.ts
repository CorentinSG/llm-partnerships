import type { Coordinates, ReliabilityStatus } from "@/lib/types"

export interface DatabaseFrenchUniversity {
  id: string
  name: string
  faculty: string
  city: string
  country: string
  coordinates: Coordinates
  dataStatus: ReliabilityStatus
}

export interface DatabaseLanguageTest {
  test: string
  minimumScore: string
  details?: string
}

export interface DatabasePartnership {
  id: string
  frenchUniversityId: string
  frenchUniversity: string
  partnerUniversity: string
  partnerCountry: string
  partnerCity?: string
  continent: string
  programType: string
  partnershipType?: string
  specialties: string[]
  requiredLevel: string
  applicationYear: string
  programLanguage: string
  duration: string
  officialLink: string
  attachments?: { label: string; url: string; note?: string }[]
  shortDescription: string
  admissionConditions: string
  languageTests: DatabaseLanguageTest[]
  availableSeatsDisplay: string
  availableSeatsMin: number | null
  availableSeatsMax: number | null
  tuitionCategory: string
  tuitionDisplay: string
  financialAid: string
  applicationDeadline: string
  reliabilityStatus: ReliabilityStatus
  missingInformation: string[]
  notes: string
}

export interface ResearchQueueItem {
  id: string
  frenchUniversity: string
  city: string
  status: string
  knownPartners: string[]
  contactsToVerify?: string[]
  notes: string
}

export interface PartnershipsDatabase {
  schemaVersion: string
  language: string
  projectName: string
  unknownValue: string
  statusDefinitions: Record<string, string>
  tuitionCategories: Record<string, string>
  partnershipTypes: Record<string, string>
  frenchUniversities: DatabaseFrenchUniversity[]
  partnerships: DatabasePartnership[]
  researchQueue: ResearchQueueItem[]
}
