"use client"

import * as React from "react"
import {
  Calculator,
  CircleDollarSign,
  ExternalLink,
  HelpCircle,
  House,
  Info,
  MapPin,
  Percent
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Partnership } from "@/lib/types"
import { cleanText, type UiLanguage } from "@/lib/text-utils"
import {
  formatUsd,
  getAllCostEstimates,
  getCostEstimatesMeta,
  getEstimateSummary,
  getEstimatesForDisplayCity,
  getPartnershipsInEstimateCity,
  getDisplayCities
} from "@/lib/us-cost-estimates"

const copy = {
  fr: {
    badge: "Budget annuel",
    title: "Estimation annuelle du coût d’un LL.M. aux États-Unis",
    intro:
      "Compare le coût public de la tuition avec une estimation après réduction de partenariat. Les montants restent des ordres de grandeur annuels.",
    city: "Ville partenaire",
    school: "École de référence",
    partnership: "Partenariat appliqué",
    normalTuition: "Tuition annuelle normale",
    partnerTuition: "Tuition annuelle via partenariat",
    savings: "Économie estimée",
    annualTotal: "Total annuel estimé",
    normalTotal: "Sans partenariat",
    partnerTotal: "Avec partenariat",
    simulator: "Simulateur interactif",
    discount: "Réduction de tuition",
    living: "Coût de vie",
    livingHelp:
      "Ajuste logement, nourriture, transport, assurance, livres et dépenses personnelles.",
    lower: "plus bas",
    reference: "référence",
    higher: "plus haut",
    costBreakdown: "Postes annuels inclus",
    methodology: "Méthodologie",
    cityPartners: "Ville et partenaires concernés",
    otherCosts: "Postes de vie courants",
    sources: "Sources officielles",
    booksHelp:
      "Livres/fournitures = manuels, supports de cours, impressions, bases de données ou matériel demandé par l’école.",
    tuitionNote:
      "La réduction est estimée depuis les informations du partenariat. Tu peux l’ajuster manuellement.",
    noPartnership: "Aucun partenariat précis sélectionné"
  },
  en: {
    badge: "Annual budget",
    title: "Annual LL.M. cost estimate in the United States",
    intro:
      "Compare public tuition with an estimated partnership tuition. Amounts are annual estimates.",
    city: "Partner city",
    school: "Reference school",
    partnership: "Applied partnership",
    normalTuition: "Standard annual tuition",
    partnerTuition: "Annual tuition via partnership",
    savings: "Estimated savings",
    annualTotal: "Estimated annual total",
    normalTotal: "Without partnership",
    partnerTotal: "With partnership",
    simulator: "Interactive simulator",
    discount: "Tuition discount",
    living: "Living costs",
    livingHelp:
      "Adjust housing, food, transport, insurance, books, and personal expenses.",
    lower: "lower",
    reference: "reference",
    higher: "higher",
    costBreakdown: "Annual cost items",
    methodology: "Methodology",
    cityPartners: "City and matching partners",
    otherCosts: "Common living costs",
    sources: "Official sources",
    booksHelp:
      "Books/supplies means textbooks, course materials, printing, databases, or equipment required by the school.",
    tuitionNote:
      "The discount is inferred from partnership data. You can adjust it manually.",
    noPartnership: "No specific partnership selected"
  },
  es: {
    badge: "Presupuesto anual",
    title: "Estimación anual del coste de un LL.M. en Estados Unidos",
    intro:
      "Compara la matrícula pública con una estimación después del convenio. Los importes son estimaciones anuales.",
    city: "Ciudad asociada",
    school: "Escuela de referencia",
    partnership: "Convenio aplicado",
    normalTuition: "Matrícula anual normal",
    partnerTuition: "Matrícula anual con convenio",
    savings: "Ahorro estimado",
    annualTotal: "Total anual estimado",
    normalTotal: "Sin convenio",
    partnerTotal: "Con convenio",
    simulator: "Simulador interactivo",
    discount: "Reducción de matrícula",
    living: "Coste de vida",
    livingHelp:
      "Ajusta vivienda, comida, transporte, seguro, libros y gastos personales.",
    lower: "más bajo",
    reference: "referencia",
    higher: "más alto",
    costBreakdown: "Partidas anuales incluidas",
    methodology: "Metodología",
    cityPartners: "Ciudad y convenios relacionados",
    otherCosts: "Costes de vida habituales",
    sources: "Fuentes oficiales",
    booksHelp:
      "Libros/materiales incluye manuales, materiales de curso, impresiones, bases de datos o equipo requerido por la escuela.",
    tuitionNote:
      "La reducción se infiere de los datos del convenio. Puedes ajustarla manualmente.",
    noPartnership: "Ningún convenio específico seleccionado"
  }
} as const

function inferDiscountPercent(partnership?: Partnership) {
  if (!partnership) return 0

  const category = cleanText(partnership.tuitionCategory)
  const text = cleanText(
    [
      partnership.financialAid,
      partnership.tuitionDisplay,
      partnership.shortDescription,
      partnership.notes
    ].join(" ")
  )

  if (category === "sans frais") return 100
  if (category === "frais complets") return 0

  const percentMatch = text.match(/(\d{1,3})\s*%/)
  if (percentMatch) {
    return Math.min(Math.max(Number(percentMatch[1]), 0), 100)
  }

  if (category === "frais réduits" || category === "bourse possible") return 50
  return 0
}

function isBooksComponent(label: string) {
  const normalized = cleanText(label).toLowerCase()
  return normalized.includes("livres") || normalized.includes("books")
}

export function CostSimulator({
  partnerships,
  language = "fr"
}: {
  partnerships: Partnership[]
  language?: UiLanguage
}) {
  const t = copy[language]
  const meta = React.useMemo(() => getCostEstimatesMeta(), [])
  const allEstimates = React.useMemo(() => getAllCostEstimates(), [])
  const cities = React.useMemo(() => getDisplayCities(), [])

  const [selectedCity, setSelectedCity] = React.useState(cities[0] ?? "")
  const cityEstimates = React.useMemo(
    () => getEstimatesForDisplayCity(selectedCity),
    [selectedCity]
  )
  const [selectedEstimateId, setSelectedEstimateId] = React.useState(
    cityEstimates[0]?.id ?? ""
  )

  React.useEffect(() => {
    if (!cityEstimates.some((estimate) => estimate.id === selectedEstimateId)) {
      setSelectedEstimateId(cityEstimates[0]?.id ?? "")
    }
  }, [cityEstimates, selectedEstimateId])

  const selectedEstimate =
    cityEstimates.find((estimate) => estimate.id === selectedEstimateId) ||
    cityEstimates[0] ||
    allEstimates[0]

  const partnershipsInCity = React.useMemo(
    () =>
      selectedEstimate
        ? getPartnershipsInEstimateCity(partnerships, selectedEstimate)
        : [],
    [partnerships, selectedEstimate]
  )

  const [selectedPartnershipId, setSelectedPartnershipId] = React.useState("")
  const [discountPercent, setDiscountPercent] = React.useState(0)
  const [livingFactor, setLivingFactor] = React.useState(100)

  React.useEffect(() => {
    const first = partnershipsInCity[0]
    setSelectedPartnershipId(first?.id ?? "")
  }, [partnershipsInCity])

  const selectedPartnership = partnershipsInCity.find(
    (partnership) => partnership.id === selectedPartnershipId
  )

  React.useEffect(() => {
    setDiscountPercent(inferDiscountPercent(selectedPartnership))
  }, [selectedPartnership])

  if (!selectedEstimate) return null

  const summary = getEstimateSummary(selectedEstimate)
  const normalTuition = summary.tuitionUsd
  const otherCosts = summary.otherCostsUsd
  const adjustedOtherCosts = Math.round(otherCosts * (livingFactor / 100))
  const partnerTuition = Math.round(normalTuition * (1 - discountPercent / 100))
  const savings = normalTuition - partnerTuition
  const normalTotal = normalTuition + adjustedOtherCosts
  const partnerTotal = partnerTuition + adjustedOtherCosts

  const uniqueUniversitiesInCity = Array.from(
    new Set(partnershipsInCity.map((partnership) => cleanText(partnership.partnerUniversity)))
  ).sort((a, b) => a.localeCompare(b))

  return (
    <section className="budget-section py-10 sm:py-14">
      <div className="container">
        <Card className="overflow-hidden rounded-2xl border-primary/10">
          <CardHeader className="space-y-5 p-4 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl space-y-3">
                <Badge className="w-fit rounded-full bg-primary/12 px-3 py-1 text-primary shadow-none">
                  {t.badge}
                </Badge>
                <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                  {t.title}
                </CardTitle>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  {t.intro}
                </p>
              </div>

              <div className="grid w-full gap-3 rounded-2xl border bg-secondary/45 p-3 sm:max-w-[460px] sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      {t.city}
                    </label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="h-11" aria-label={t.city}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      {t.school}
                    </label>
                    <Select value={selectedEstimate.id} onValueChange={setSelectedEstimateId}>
                      <SelectTrigger className="h-11" aria-label={t.school}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cityEstimates.map((estimate) => (
                          <SelectItem key={estimate.id} value={estimate.id}>
                            {cleanText(estimate.referenceSchool)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.partnership}
                  </label>
                  <Select
                    value={selectedPartnershipId || "none"}
                    onValueChange={(value: string) =>
                      setSelectedPartnershipId(value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger className="h-11" aria-label={t.partnership}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t.noPartnership}</SelectItem>
                      {partnershipsInCity.map((partnership) => (
                        <SelectItem key={partnership.id} value={partnership.id}>
                          {cleanText(partnership.frenchUniversity)} →{" "}
                          {cleanText(partnership.partnerUniversity)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.normalTuition}</div>
                <div className="mt-2 text-2xl font-semibold">{formatUsd(normalTuition)}</div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.partnerTuition}</div>
                <div className="mt-2 text-2xl font-semibold">{formatUsd(partnerTuition)}</div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.savings}</div>
                <div className="mt-2 text-2xl font-semibold text-success">
                  {formatUsd(savings)}
                </div>
              </div>
              <div className="rounded-xl border border-primary/15 bg-primary/10 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.annualTotal}</div>
                <div className="mt-2 text-2xl font-semibold">{formatUsd(partnerTotal)}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-4 pt-0 sm:space-y-6 sm:p-8 sm:pt-0">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    {t.simulator}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t.tuitionNote}
                  </p>
                  <div className="mt-4 space-y-5">
                    <label className="block">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{t.discount}</span>
                        <span className="font-mono-ui text-primary">{discountPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={discountPercent}
                        onChange={(event) => setDiscountPercent(Number(event.target.value))}
                        className="w-full accent-primary"
                      />
                    </label>

                    <label className="block">
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          {t.living}
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] text-muted-foreground"
                            title={t.livingHelp}
                          >
                            ?
                          </span>
                        </span>
                        <span className="font-mono-ui text-primary">{livingFactor}%</span>
                      </div>
                      <input
                        type="range"
                        min={80}
                        max={130}
                        step={5}
                        value={livingFactor}
                        onChange={(event) => setLivingFactor(Number(event.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                        <span>{t.lower}</span>
                        <span>{t.reference}</span>
                        <span>{t.higher}</span>
                      </div>
                    </label>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card/80 p-4">
                      <div className="text-xs text-muted-foreground">{t.normalTotal}</div>
                      <div className="mt-2 text-xl font-semibold">{formatUsd(normalTotal)}</div>
                    </div>
                    <div className="rounded-xl border border-primary/15 bg-primary/10 p-4">
                      <div className="text-xs text-muted-foreground">{t.partnerTotal}</div>
                      <div className="mt-2 text-xl font-semibold">{formatUsd(partnerTotal)}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    {t.costBreakdown}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                    {selectedEstimate.components.map((component) => (
                      <div
                        key={`${selectedEstimate.id}-${component.label}`}
                        className="rounded-xl border bg-card/80 p-3 motion-pop sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
                          <span>{cleanText(component.label)}</span>
                          {isBooksComponent(component.label) ? (
                            <span
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]"
                              title={t.booksHelp}
                            >
                              ?
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 text-lg font-semibold">
                          {formatUsd(component.amountUsd)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    {t.methodology}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {cleanText(selectedEstimate.methodologyNote)}
                  </p>
                  {selectedEstimate.optionalNotes?.length ? (
                    <div className="mt-3 space-y-2">
                      {selectedEstimate.optionalNotes.map((note) => (
                        <div
                          key={note}
                          className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
                        >
                          {cleanText(note)}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {t.cityPartners}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {cleanText(selectedEstimate.displayCity)}
                    </span>{" "}
                    · {cleanText(selectedEstimate.referenceSchool)}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {uniqueUniversitiesInCity.map((university) => (
                      <Badge key={university} variant="outline" className="rounded-full bg-card">
                        {university}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <House className="h-4 w-4 text-muted-foreground" />
                    {t.otherCosts}
                  </div>
                  <div className="mt-4 space-y-3">
                    {meta.commonCosts.map((cost) => (
                      <div key={cost.label}>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          {cleanText(cost.label)}
                          {isBooksComponent(cost.label) ? (
                            <HelpCircle
                              className="h-3.5 w-3.5 text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cleanText(cost.description)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    {t.sources}
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedEstimate.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start justify-between gap-3 rounded-xl border bg-card/80 px-4 py-3 text-sm transition-colors hover:bg-card"
                      >
                        <span>{cleanText(source.label)}</span>
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="rounded-xl border bg-secondary/45 px-4 py-4 text-sm leading-7 text-muted-foreground sm:rounded-2xl sm:px-5">
              {cleanText(meta.disclaimer)}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
