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
  SlidersHorizontal
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
  getDisplayCities,
  type CostComponent
} from "@/lib/us-cost-estimates"

const copy = {
  fr: {
    badge: "Budget annuel",
    title: "Budget annuel d'un LL.M. aux États-Unis",
    intro: "Compare la tuition publique, l'offre du partenariat et les dépenses de vie que tu peux ajuster selon ton profil.",
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
    offer: "Offre de partenariat",
    studentCosts: "Dépenses modifiables",
    costBreakdown: "Postes annuels inclus",
    methodology: "Méthodologie",
    cityPartners: "Ville et partenaires concernés",
    otherCosts: "Postes de vie courants",
    sources: "Sources officielles",
    booksHelp: "Livres/fournitures = manuels, supports de cours, impressions, bases de données ou matériel demandé par l'école.",
    livingHelp: "Ajuste seulement les postes qui dépendent de ton mode de vie : logement, repas, transport, assurance ou dépenses personnelles.",
    tuitionNote: "La tuition vient des données officielles et du partenariat. Quand plusieurs places ou remises sont mentionnées, choisis l'offre correspondante.",
    noPartnership: "Aucun partenariat précis sélectionné",
    noOffer: "Tarif public",
    freeSeat: "Place sans frais de scolarité partenaire",
    reducedSeat: "Place à frais réduits",
    scholarshipSeat: "Bourse ou remise possible",
    percentSeat: "Remise de {percent}%",
    referenceAmount: "montant de référence",
    fixedHint: "Tuition, livres et frais imposés restent fixes dans ce calcul."
  },
  en: {
    badge: "Annual budget",
    title: "Annual LL.M. budget in the United States",
    intro: "Compare public tuition, the partnership offer, and editable living expenses based on your profile.",
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
    offer: "Partnership offer",
    studentCosts: "Editable living costs",
    costBreakdown: "Annual cost items",
    methodology: "Methodology",
    cityPartners: "City and matching partners",
    otherCosts: "Common living costs",
    sources: "Official sources",
    booksHelp: "Books/supplies means textbooks, course materials, printing, databases, or equipment required by the school.",
    livingHelp: "Adjust only costs driven by your lifestyle: housing, meals, transport, insurance, or personal expenses.",
    tuitionNote: "Tuition is based on official and partnership data. When several seats or discounts are mentioned, choose the matching offer.",
    noPartnership: "No specific partnership selected",
    noOffer: "Public rate",
    freeSeat: "Partner tuition-free seat",
    reducedSeat: "Reduced tuition seat",
    scholarshipSeat: "Scholarship or discount possible",
    percentSeat: "{percent}% discount",
    referenceAmount: "reference amount",
    fixedHint: "Tuition, books, and mandatory fees stay fixed in this estimate."
  },
  es: {
    badge: "Presupuesto anual",
    title: "Presupuesto anual de un LL.M. en Estados Unidos",
    intro: "Compara la matrícula pública, la oferta del convenio y los gastos de vida que puedes ajustar según tu perfil.",
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
    offer: "Oferta del convenio",
    studentCosts: "Costes modificables",
    costBreakdown: "Partidas anuales incluidas",
    methodology: "Metodología",
    cityPartners: "Ciudad y convenios relacionados",
    otherCosts: "Costes de vida habituales",
    sources: "Fuentes oficiales",
    booksHelp: "Libros/materiales incluye manuales, materiales de curso, impresiones, bases de datos o equipo requerido por la escuela.",
    livingHelp: "Ajusta solo los costes que dependen de tu estilo de vida: vivienda, comidas, transporte, seguro o gastos personales.",
    tuitionNote: "La matrícula se basa en datos oficiales y del convenio. Cuando haya varias plazas o reducciones, elige la oferta correspondiente.",
    noPartnership: "Ningún convenio específico seleccionado",
    noOffer: "Tarifa pública",
    freeSeat: "Plaza sin matrícula de la universidad asociada",
    reducedSeat: "Plaza con matrícula reducida",
    scholarshipSeat: "Beca o reducción posible",
    percentSeat: "Reducción de {percent}%",
    referenceAmount: "importe de referencia",
    fixedHint: "Matrícula, libros y tasas obligatorias permanecen fijas en esta estimación."
  }
} as const

type OfferOption = {
  id: string
  label: string
  tuitionUsd: number
  note?: string
}

function isBooksComponent(label: string) {
  const normalized = cleanText(label).toLowerCase()
  return normalized.includes("livres") || normalized.includes("books")
}

function BooksHelpTooltip({ text }: { text: string }) {
  return (
    <span className="group/tooltip relative inline-flex">
      <button
        type="button"
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-background text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-label={text}
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-7 z-30 w-72 translate-y-1 rounded-xl border bg-popover px-3.5 py-3 text-left text-xs leading-5 text-popover-foreground opacity-0 shadow-xl shadow-black/15 transition duration-150 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100"
      >
        <span className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 border-l border-t bg-popover" />
        {text}
      </span>
    </span>
  )
}

function isTuitionComponent(component: CostComponent) {
  return component.kind === "tuition"
}

function isEditableLivingComponent(component: CostComponent) {
  const label = cleanText(component.label).toLowerCase()
  if (component.kind === "tuition" || isBooksComponent(label)) return false
  if (label.includes("frais universitaire") || label.includes("activity fee")) return false
  if (label.includes("loan fee") || label.includes("mbe support") || label.includes("health services fee")) return false

  return (
    label.includes("logement") ||
    label.includes("nourriture") ||
    label.includes("repas") ||
    label.includes("transport") ||
    label.includes("assurance") ||
    label.includes("personal") ||
    label.includes("personnelles") ||
    label.includes("housing") ||
    label.includes("food") ||
    label.includes("meal")
  )
}

function parseDollarAmounts(text: string) {
  const amounts: number[] = []
  const matches = text.matchAll(/(?:\$|usd|dollars?)\s*([0-9][0-9\s.,]*)|([0-9][0-9\s.,]*)\s*(?:\$|usd|dollars?)/gi)
  for (const match of matches) {
    const raw = match[1] || match[2]
    const value = Number(raw.replace(/[\s,]/g, ""))
    if (Number.isFinite(value) && value > 0) amounts.push(value)
  }
  return amounts
}

function parsePercent(text: string) {
  const match = text.match(/(\d{1,3})\s*%/)
  if (!match) return undefined
  return Math.min(Math.max(Number(match[1]), 0), 100)
}

function inferOfferOptions(partnership: Partnership | undefined, normalTuition: number, language: UiLanguage) {
  const t = copy[language]
  const options: OfferOption[] = [
    { id: "public", label: t.noOffer, tuitionUsd: normalTuition }
  ]

  if (!partnership) return options

  const category = cleanText(partnership.tuitionCategory).toLowerCase()
  const text = cleanText([
    partnership.availableSeatsDisplay,
    partnership.tuitionDisplay,
    partnership.financialAid,
    partnership.shortDescription,
    partnership.notes
  ].join(" "))
  const lower = text.toLowerCase()
  const amounts = parseDollarAmounts(lower).filter((amount) => amount < normalTuition)
  const percent = parsePercent(lower)

  if (category === "sans frais" || lower.includes("sans frais") || lower.includes("full scholarship")) {
    options.push({ id: "free", label: t.freeSeat, tuitionUsd: 0, note: cleanText(partnership.availableSeatsDisplay) })
  }

  if (percent && percent > 0 && percent < 100) {
    options.push({
      id: `percent-${percent}`,
      label: t.percentSeat.replace("{percent}", String(percent)),
      tuitionUsd: Math.round(normalTuition * (1 - percent / 100)),
      note: cleanText(partnership.financialAid || partnership.tuitionDisplay)
    })
  }

  const likelyAmounts = Array.from(new Set(amounts)).sort((a, b) => a - b).slice(0, 3)
  likelyAmounts.forEach((amount, index) => {
    options.push({
      id: `amount-${index}-${amount}`,
      label: category.includes("bourse") ? t.scholarshipSeat : t.reducedSeat,
      tuitionUsd: Math.round(amount),
      note: `${formatUsd(amount)} ${t.referenceAmount}`
    })
  })

  if (options.length === 1 && (category.includes("réduits") || category.includes("reduit") || category.includes("bourse"))) {
    const fallbackPercent = category.includes("bourse") ? 25 : 50
    options.push({
      id: `fallback-${fallbackPercent}`,
      label: category.includes("bourse") ? t.scholarshipSeat : t.reducedSeat,
      tuitionUsd: Math.round(normalTuition * (1 - fallbackPercent / 100)),
      note: t.referenceAmount
    })
  }

  return options.filter(
    (option, index, all) => all.findIndex((item) => item.tuitionUsd === option.tuitionUsd && item.label === option.label) === index
  )
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
  const cityEstimates = React.useMemo(() => getEstimatesForDisplayCity(selectedCity), [selectedCity])
  const [selectedEstimateId, setSelectedEstimateId] = React.useState(cityEstimates[0]?.id ?? "")

  React.useEffect(() => {
    if (!cityEstimates.some((estimate) => estimate.id === selectedEstimateId)) {
      setSelectedEstimateId(cityEstimates[0]?.id ?? "")
    }
  }, [cityEstimates, selectedEstimateId])

  const selectedEstimate =
    cityEstimates.find((estimate) => estimate.id === selectedEstimateId) || cityEstimates[0] || allEstimates[0]

  const partnershipsInCity = React.useMemo(
    () => (selectedEstimate ? getPartnershipsInEstimateCity(partnerships, selectedEstimate) : []),
    [partnerships, selectedEstimate]
  )

  const [selectedPartnershipId, setSelectedPartnershipId] = React.useState("")
  const [selectedOfferId, setSelectedOfferId] = React.useState("public")
  const [customCosts, setCustomCosts] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    const first = partnershipsInCity[0]
    setSelectedPartnershipId(first?.id ?? "")
  }, [partnershipsInCity])

  const selectedPartnership = partnershipsInCity.find((partnership) => partnership.id === selectedPartnershipId)

  if (!selectedEstimate) return null

  const summary = getEstimateSummary(selectedEstimate)
  const normalTuition = summary.tuitionUsd
  const offerOptions = inferOfferOptions(selectedPartnership, normalTuition, language)
  const selectedOffer = offerOptions.find((offer) => offer.id === selectedOfferId) || offerOptions[0]

  React.useEffect(() => {
    setSelectedOfferId("public")
  }, [selectedPartnershipId, selectedEstimateId])

  const fixedComponents = selectedEstimate.components.filter(
    (component) => !isTuitionComponent(component) && !isEditableLivingComponent(component)
  )
  const editableComponents = selectedEstimate.components.filter(isEditableLivingComponent)

  React.useEffect(() => {
    setCustomCosts((current) => {
      const next: Record<string, number> = {}
      for (const component of editableComponents) {
        next[component.label] = current[component.label] ?? component.amountUsd
      }
      return next
    })
  }, [selectedEstimate.id])

  const fixedOtherCosts = fixedComponents.reduce((total, component) => total + component.amountUsd, 0)
  const editableOtherCosts = editableComponents.reduce(
    (total, component) => total + (customCosts[component.label] ?? component.amountUsd),
    0
  )
  const adjustedOtherCosts = fixedOtherCosts + editableOtherCosts
  const partnerTuition = selectedOffer.tuitionUsd
  const savings = Math.max(0, normalTuition - partnerTuition)
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
                <Badge className="w-fit rounded-full bg-primary/12 px-3 py-1 text-primary shadow-none">{t.badge}</Badge>
                <CardTitle className="text-2xl tracking-tight sm:text-3xl">{t.title}</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">{t.intro}</p>
              </div>

              <div className="grid w-full gap-3 rounded-2xl border bg-secondary/45 p-3 sm:max-w-[460px] sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{t.city}</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="h-11" aria-label={t.city}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{t.school}</label>
                    <Select value={selectedEstimate.id} onValueChange={setSelectedEstimateId}>
                      <SelectTrigger className="h-11" aria-label={t.school}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {cityEstimates.map((estimate) => (
                          <SelectItem key={estimate.id} value={estimate.id}>{cleanText(estimate.referenceSchool)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">{t.partnership}</label>
                  <Select value={selectedPartnershipId || "none"} onValueChange={(value: string) => setSelectedPartnershipId(value === "none" ? "" : value)}>
                    <SelectTrigger className="h-11" aria-label={t.partnership}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t.noPartnership}</SelectItem>
                      {partnershipsInCity.map((partnership) => (
                        <SelectItem key={partnership.id} value={partnership.id}>
                          {cleanText(partnership.frenchUniversity)} → {cleanText(partnership.partnerUniversity)}
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
                <div className="mt-2 text-2xl font-semibold text-success">{formatUsd(savings)}</div>
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
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    {t.simulator}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.tuitionNote}</p>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">{t.offer}</label>
                      <Select value={selectedOffer.id} onValueChange={setSelectedOfferId}>
                        <SelectTrigger className="h-11" aria-label={t.offer}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {offerOptions.map((offer) => (
                            <SelectItem key={offer.id} value={offer.id}>{offer.label} - {formatUsd(offer.tuitionUsd)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedOffer.note ? <p className="text-xs leading-5 text-muted-foreground">{selectedOffer.note}</p> : null}
                    </div>

                    <div className="rounded-xl border bg-card/80 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="text-sm font-medium">{t.studentCosts}</div>
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] text-muted-foreground" title={t.livingHelp}>?</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {editableComponents.map((component) => (
                          <label key={component.label} className="space-y-1.5">
                            <span className="text-xs text-muted-foreground">{cleanText(component.label)}</span>
                            <input
                              type="number"
                              min={0}
                              step={100}
                              value={customCosts[component.label] ?? component.amountUsd}
                              onChange={(event) => setCustomCosts((current) => ({ ...current, [component.label]: Number(event.target.value) || 0 }))}
                              className="h-10 w-full rounded-lg border bg-background px-3 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
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
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.fixedHint}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                    {selectedEstimate.components.map((component) => {
                      const editable = isEditableLivingComponent(component)
                      const amount = editable ? customCosts[component.label] ?? component.amountUsd : component.amountUsd
                      return (
                        <div key={`${selectedEstimate.id}-${component.label}`} className="rounded-xl border bg-card/80 p-3 motion-pop sm:p-4">
                          <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
                            <span>{cleanText(component.label)}</span>
                            {isBooksComponent(component.label) ? (
                              <BooksHelpTooltip text={t.booksHelp} />
                            ) : editable ? (
                              <Badge variant="outline" className="rounded-full text-[10px]">{t.studentCosts}</Badge>
                            ) : null}
                          </div>
                          <div className="mt-2 text-lg font-semibold">{formatUsd(amount)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    {t.methodology}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{cleanText(selectedEstimate.methodologyNote)}</p>
                  {selectedEstimate.optionalNotes?.length ? (
                    <div className="mt-3 space-y-2">
                      {selectedEstimate.optionalNotes.map((note) => (
                        <div key={note} className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
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
                    <span className="font-medium text-foreground">{cleanText(selectedEstimate.displayCity)}</span> · {cleanText(selectedEstimate.referenceSchool)}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {uniqueUniversitiesInCity.map((university) => (
                      <Badge key={university} variant="outline" className="rounded-full bg-card">{university}</Badge>
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
                          {isBooksComponent(cost.label) ? <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" /> : null}
                        </div>
                        <div className="text-sm text-muted-foreground">{cleanText(cost.description)}</div>
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
                      <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-3 rounded-xl border bg-card/80 px-4 py-3 text-sm transition-colors hover:bg-card">
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
