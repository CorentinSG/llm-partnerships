import costEstimatesRaw from "../../data/us-cost-estimates.json"

import type { Partnership } from "@/lib/types"

type CostComponentKind = "tuition" | "other"

export interface CostComponent {
  label: string
  amountUsd: number
  kind: CostComponentKind
}

export interface CostSource {
  label: string
  url: string
}

export interface CostEstimate {
  id: string
  displayCity: string
  city: string
  state: string
  referenceSchool: string
  coveredUniversities: string[]
  academicYear: string
  methodologyNote: string
  components: CostComponent[]
  optionalNotes?: string[]
  sources: CostSource[]
}

interface CostEstimatesFile {
  updatedAt: string
  currency: string
  title: string
  disclaimer: string
  commonCosts: { label: string; description: string }[]
  estimates: CostEstimate[]
}

const costEstimates = costEstimatesRaw as CostEstimatesFile

function normalizeValue(value: string | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function normalizePartnerCity(city: string | undefined) {
  const value = normalizeValue(city)

  const aliases: Record<string, string> = {
    "brooklyn new york city ny": "new york",
    "new york": "new york",
    "davis california": "davis",
    "baton rouge la": "baton rouge",
    "st louis missouri": "st louis",
    "washington dc": "washington",
    "wilmington": "wilmington",
    "cleveland ohio": "cleveland",
    "minneapolis mn": "minneapolis",
    "charlottesville": "charlottesville",
    "south royalton": "south royalton",
    "san diego": "san diego",
    "san francisco": "san francisco",
    "los angeles": "los angeles",
    "notre dame": "notre dame",
    "ithaca": "ithaca",
    "philadelphia": "philadelphia",
    "pittsburgh": "pittsburgh",
    "boston": "boston",
    "chicago": "chicago",
    "bloomington": "bloomington",
    "cincinnati": "cincinnati"
  }

  return aliases[value] || value
}

function normalizeDisplayCity(displayCity: string) {
  return normalizePartnerCity(displayCity.split(",")[0])
}

function sumComponents(components: CostComponent[], kind: CostComponentKind) {
  return components
    .filter((component) => component.kind === kind)
    .reduce((total, component) => total + component.amountUsd, 0)
}

export function getCostEstimatesMeta() {
  return {
    updatedAt: costEstimates.updatedAt,
    currency: costEstimates.currency,
    title: costEstimates.title,
    disclaimer: costEstimates.disclaimer,
    commonCosts: costEstimates.commonCosts
  }
}

export function getAllCostEstimates() {
  return costEstimates.estimates
}

export function getDisplayCities() {
  return Array.from(
    new Set(costEstimates.estimates.map((estimate) => estimate.displayCity))
  ).sort((a, b) => a.localeCompare(b))
}

export function getEstimatesForDisplayCity(displayCity: string) {
  return costEstimates.estimates.filter(
    (estimate) => estimate.displayCity === displayCity
  )
}

export function getEstimateSummary(estimate: CostEstimate) {
  const tuitionUsd = sumComponents(estimate.components, "tuition")
  const otherCostsUsd = sumComponents(estimate.components, "other")

  return {
    tuitionUsd,
    otherCostsUsd,
    totalUsd: tuitionUsd + otherCostsUsd
  }
}

export function getPartnershipsInEstimateCity(
  allPartnerships: Partnership[],
  estimate: CostEstimate
) {
  const estimateCity = normalizeDisplayCity(estimate.displayCity)

  return allPartnerships.filter((partnership) => {
    const partnerCity = normalizePartnerCity(partnership.partnerCity)
    return partnerCity === estimateCity
  })
}

export function getCostEstimateForPartnership(partnership: Partnership) {
  const normalizedUniversity = normalizeValue(partnership.partnerUniversity)
  const exact = costEstimates.estimates.find((estimate) =>
    normalizeValue(estimate.referenceSchool) === normalizedUniversity
  )

  if (exact) return exact

  const normalizedCity = normalizePartnerCity(partnership.partnerCity)
  return costEstimates.estimates.find(
    (estimate) => normalizeDisplayCity(estimate.displayCity) === normalizedCity
  )
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount)
}
