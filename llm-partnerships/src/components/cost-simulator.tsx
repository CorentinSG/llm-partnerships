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
    badge: "Simulateur étudiant",
    title: "Budget annuel LL.M. : public vs partenariat",
    intro:
      "Les frais d'inscription peuvent être le premier poste d'un LL.M. aux États-Unis, mais ils ne sont jamais seuls : visa, livres, logement, repas, transport et assurance peuvent aussi peser lourd. Compare le prix public, le prix avec partenariat, puis ajuste les dépenses qui dépendent de toi.",
    city: "1. Ville",
    school: "École de référence",
    partnership: "2. Partenariat",
    offer: "3. Offre appliquée",
    visa: "4. Situation visa",
    noPartnership: "Aucun partenariat précis",
    noOffer: "Tarif public",
    publicTuition: "Tuition publique annuelle",
    partnerTuition: "Tuition grâce au partenariat",
    savings: "Économie sur la tuition",
    fixedCosts: "Frais fixes annuels",
    visaCosts: "Frais visa estimés",
    livingCosts: "Dépenses de vie ajustables",
    publicTotal: "Budget annuel sans partenariat",
    partnerTotal: "Budget annuel avec partenariat",
    studentCosts: "Ajuste ton mode de vie",
    studentCostsHelp:
      "Ces curseurs modifient seulement les postes qui varient selon ton choix de logement, repas, transport, assurance ou dépenses personnelles.",
    lean: "sobre",
    reference: "référence",
    comfortable: "confort",
    costBreakdown: "Détail du calcul annuel",
    fixedHint: "Tuition, livres et frais imposés restent fixes. Seules les dépenses de vie ci-dessus sont interactives.",
    methodology: "Méthodologie",
    cityPartners: "Ville et partenaires concernés",
    otherCosts: "Postes de vie courants",
    sources: "Sources officielles",
    booksHelp:
      "Ce poste correspond aux livres et fournitures académiques : manuels obligatoires, supports de cours, impressions, accès à des bases de données ou matériel demandé par l'école. Il ne s'agit pas d'une dépense de vie librement ajustable.",
    freeSeat: "Place sans frais de scolarité partenaire",
    reducedSeat: "Place à frais réduits",
    scholarshipSeat: "Bourse ou remise possible",
    percentSeat: "Remise de {percent}%",
    referenceAmount: "montant indiqué",
    publicRate: "Prix public normal",
    partnerRate: "Prix après partenariat",
    visaNone: "Pas de visa à prévoir",
    visaF1: "F-1 initial : MRV + SEVIS",
    visaJ1: "J-1 initial : MRV + SEVIS",
    visaSevisOnly: "SEVIS uniquement",
    visaRenewal: "Renouvellement visa : MRV",
    visaNote:
      "Estimation basée sur MRV 185 $ et SEVIS I-901 : F/M 350 $, J 220 $. Les frais de délivrance éventuels dépendent de la nationalité."
  },
  en: {
    badge: "Student simulator",
    title: "Annual LL.M. budget: public vs partnership",
    intro:
      "Tuition can be the largest line item for a U.S. LL.M., but it is not the only one: visa, books, housing, meals, transport, and insurance can also be significant. Compare the public price, the partnership price, then adjust the costs driven by your own choices.",
    city: "1. City",
    school: "Reference school",
    partnership: "2. Partnership",
    offer: "3. Applied offer",
    visa: "4. Visa situation",
    noPartnership: "No specific partnership",
    noOffer: "Public rate",
    publicTuition: "Annual public tuition",
    partnerTuition: "Tuition with partnership",
    savings: "Tuition savings",
    fixedCosts: "Annual fixed costs",
    visaCosts: "Estimated visa fees",
    livingCosts: "Editable living costs",
    publicTotal: "Annual budget without partnership",
    partnerTotal: "Annual budget with partnership",
    studentCosts: "Adjust your lifestyle",
    studentCostsHelp:
      "These sliders only change costs driven by your housing, meals, transport, insurance, or personal spending choices.",
    lean: "lean",
    reference: "reference",
    comfortable: "comfortable",
    costBreakdown: "Annual calculation details",
    fixedHint: "Tuition, books, and mandatory fees stay fixed. Only the living costs above are interactive.",
    methodology: "Methodology",
    cityPartners: "City and matching partners",
    otherCosts: "Common living costs",
    sources: "Official sources",
    booksHelp:
      "This item covers academic books and supplies: required textbooks, course materials, printing, database access, or equipment required by the school. It is not a freely adjustable living expense.",
    freeSeat: "Partner tuition-free seat",
    reducedSeat: "Reduced tuition seat",
    scholarshipSeat: "Scholarship or discount possible",
    percentSeat: "{percent}% discount",
    referenceAmount: "published amount",
    publicRate: "Normal public price",
    partnerRate: "Price after partnership",
    visaNone: "No visa cost to include",
    visaF1: "Initial F-1: MRV + SEVIS",
    visaJ1: "Initial J-1: MRV + SEVIS",
    visaSevisOnly: "SEVIS only",
    visaRenewal: "Visa renewal: MRV",
    visaNote:
      "Estimate based on MRV $185 and SEVIS I-901: F/M $350, J $220. Any visa issuance fee depends on nationality."
  },
  es: {
    badge: "Simulador estudiante",
    title: "Presupuesto anual LL.M.: público vs convenio",
    intro:
      "La matrícula puede ser el mayor coste de un LL.M. en Estados Unidos, pero no es el único: visa, libros, vivienda, comidas, transporte y seguro también pueden ser elevados. Compara el precio público, el precio con convenio y ajusta los gastos que dependen de ti.",
    city: "1. Ciudad",
    school: "Escuela de referencia",
    partnership: "2. Convenio",
    offer: "3. Oferta aplicada",
    visa: "4. Situación de visa",
    noPartnership: "Ningún convenio específico",
    noOffer: "Tarifa pública",
    publicTuition: "Matrícula pública anual",
    partnerTuition: "Matrícula con convenio",
    savings: "Ahorro en matrícula",
    fixedCosts: "Costes fijos anuales",
    visaCosts: "Costes estimados de visa",
    livingCosts: "Gastos de vida ajustables",
    publicTotal: "Presupuesto anual sin convenio",
    partnerTotal: "Presupuesto anual con convenio",
    studentCosts: "Ajusta tu estilo de vida",
    studentCostsHelp:
      "Estos controles solo modifican gastos que dependen de tu vivienda, comidas, transporte, seguro o gastos personales.",
    lean: "sobrio",
    reference: "referencia",
    comfortable: "cómodo",
    costBreakdown: "Detalle del cálculo anual",
    fixedHint: "Matrícula, libros y tasas obligatorias permanecen fijas. Solo los gastos de vida anteriores son interactivos.",
    methodology: "Metodología",
    cityPartners: "Ciudad y convenios relacionados",
    otherCosts: "Costes de vida habituales",
    sources: "Fuentes oficiales",
    booksHelp:
      "Este concepto cubre libros y materiales académicos: manuales obligatorios, materiales de curso, impresiones, acceso a bases de datos o equipo requerido por la escuela. No es un gasto de vida libremente ajustable.",
    freeSeat: "Plaza sin matrícula de la universidad asociada",
    reducedSeat: "Plaza con matrícula reducida",
    scholarshipSeat: "Beca o reducción posible",
    percentSeat: "Reducción de {percent}%",
    referenceAmount: "importe indicado",
    publicRate: "Precio público normal",
    partnerRate: "Precio tras convenio",
    visaNone: "Sin coste de visa",
    visaF1: "F-1 inicial: MRV + SEVIS",
    visaJ1: "J-1 inicial: MRV + SEVIS",
    visaSevisOnly: "Solo SEVIS",
    visaRenewal: "Renovación de visa: MRV",
    visaNote:
      "Estimación basada en MRV 185 $ y SEVIS I-901: F/M 350 $, J 220 $. Las tasas de emisión dependen de la nacionalidad."
  }
} as const

type OfferOption = {
  id: string
  label: string
  tuitionUsd: number
  note?: string
}

type VisaOption = {
  id: string
  label: string
  amountUsd: number
}

function getVisaOptions(language: UiLanguage): VisaOption[] {
  const t = copy[language]

  return [
    { id: "none", label: t.visaNone, amountUsd: 0 },
    { id: "f1-initial", label: t.visaF1, amountUsd: 535 },
    { id: "j1-initial", label: t.visaJ1, amountUsd: 405 },
    { id: "sevis-only", label: t.visaSevisOnly, amountUsd: 350 },
    { id: "renewal", label: t.visaRenewal, amountUsd: 185 }
  ]
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
    { id: "public", label: t.noOffer, tuitionUsd: normalTuition, note: t.publicRate }
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
    options.push({
      id: "free",
      label: t.freeSeat,
      tuitionUsd: 0,
      note: cleanText(partnership.availableSeatsDisplay || partnership.tuitionDisplay)
    })
  }

  if (percent && percent > 0 && percent < 100) {
    options.push({
      id: `percent-${percent}`,
      label: t.percentSeat.replace("{percent}", String(percent)),
      tuitionUsd: Math.round(normalTuition * (1 - percent / 100)),
      note: cleanText(partnership.financialAid || partnership.tuitionDisplay)
    })
  }

  Array.from(new Set(amounts)).sort((a, b) => a - b).slice(0, 3).forEach((amount, index) => {
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
      note: t.partnerRate
    })
  }

  return options.filter(
    (option, index, all) =>
      all.findIndex((item) => item.tuitionUsd === option.tuitionUsd && item.label === option.label) === index
  )
}

function sliderMin(amount: number) {
  return Math.max(0, Math.round((amount * 0.55) / 100) * 100)
}

function sliderMax(amount: number) {
  return Math.max(1000, Math.round((amount * 1.65) / 100) * 100)
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
  const [selectedVisaId, setSelectedVisaId] = React.useState("f1-initial")
  const [customCosts, setCustomCosts] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    const freeFirst = partnershipsInCity.find((partnership) => cleanText(partnership.tuitionCategory).toLowerCase() === "sans frais")
    const first = freeFirst || partnershipsInCity[0]
    setSelectedPartnershipId(first?.id ?? "")
  }, [partnershipsInCity])

  const selectedPartnership = partnershipsInCity.find((partnership) => partnership.id === selectedPartnershipId)

  const summary = selectedEstimate ? getEstimateSummary(selectedEstimate) : { tuitionUsd: 0, otherCostsUsd: 0, totalUsd: 0 }
  const normalTuition = summary.tuitionUsd
  const offerOptions = React.useMemo(
    () => inferOfferOptions(selectedPartnership, normalTuition, language),
    [selectedPartnership, normalTuition, language]
  )
  const selectedOffer = offerOptions.find((offer) => offer.id === selectedOfferId) || offerOptions[0]
  const visaOptions = React.useMemo(() => getVisaOptions(language), [language])
  const selectedVisa = visaOptions.find((option) => option.id === selectedVisaId) || visaOptions[0]

  React.useEffect(() => {
    const bestOffer = offerOptions.find((offer) => offer.id !== "public") || offerOptions[0]
    setSelectedOfferId(bestOffer?.id ?? "public")
  }, [offerOptions])

  const fixedComponents = React.useMemo(
    () => selectedEstimate?.components.filter((component) => !isTuitionComponent(component) && !isEditableLivingComponent(component)) ?? [],
    [selectedEstimate]
  )
  const editableComponents = React.useMemo(
    () => selectedEstimate?.components.filter(isEditableLivingComponent) ?? [],
    [selectedEstimate]
  )

  React.useEffect(() => {
    setCustomCosts((current) => {
      const next: Record<string, number> = {}
      for (const component of editableComponents) {
        next[component.label] = current[component.label] ?? component.amountUsd
      }
      return next
    })
  }, [editableComponents])

  if (!selectedEstimate || !selectedOffer) return null

  const fixedOtherCosts = fixedComponents.reduce((total, component) => total + component.amountUsd, 0)
  const editableOtherCosts = editableComponents.reduce(
    (total, component) => total + (customCosts[component.label] ?? component.amountUsd),
    0
  )
  const adjustedOtherCosts = fixedOtherCosts + editableOtherCosts
  const visaCosts = selectedVisa.amountUsd
  const partnerTuition = selectedOffer.tuitionUsd
  const savings = Math.max(0, normalTuition - partnerTuition)
  const normalTotal = normalTuition + adjustedOtherCosts + visaCosts
  const partnerTotal = partnerTuition + adjustedOtherCosts + visaCosts
  const fixedCostsLabel = formatUsd(fixedOtherCosts)
  const livingCostsLabel = formatUsd(editableOtherCosts)

  const uniqueUniversitiesInCity = Array.from(
    new Set(partnershipsInCity.map((partnership) => cleanText(partnership.partnerUniversity)))
  ).sort((a, b) => a.localeCompare(b))

  return (
    <section className="budget-section py-10 sm:py-14">
      <div className="container">
        <Card className="overflow-hidden rounded-2xl border-primary/10">
          <CardHeader className="space-y-6 p-4 sm:p-8">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_460px]">
              <div className="max-w-3xl space-y-3">
                <Badge className="w-fit rounded-full bg-primary/12 px-3 py-1 text-primary shadow-none">
                  {t.badge}
                </Badge>
                <CardTitle className="text-2xl tracking-tight sm:text-3xl">{t.title}</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">{t.intro}</p>
              </div>

              <div className="grid gap-3 rounded-2xl border bg-secondary/45 p-3 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{t.city}</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="h-11" aria-label={t.city}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{t.school}</label>
                    <Select value={selectedEstimate.id} onValueChange={setSelectedEstimateId}>
                      <SelectTrigger className="h-11" aria-label={t.school}>
                        <SelectValue />
                      </SelectTrigger>
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
                    <SelectTrigger className="h-11" aria-label={t.partnership}>
                      <SelectValue />
                    </SelectTrigger>
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

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">{t.offer}</label>
                  <Select value={selectedOffer.id} onValueChange={setSelectedOfferId}>
                    <SelectTrigger className="h-11" aria-label={t.offer}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {offerOptions.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>{offer.label} - {formatUsd(offer.tuitionUsd)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedOffer.note ? <p className="text-xs leading-5 text-muted-foreground">{selectedOffer.note}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">{t.visa}</label>
                  <Select value={selectedVisa.id} onValueChange={setSelectedVisaId}>
                    <SelectTrigger className="h-11" aria-label={t.visa}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visaOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label} - {formatUsd(option.amountUsd)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs leading-5 text-muted-foreground">{t.visaNote}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.publicTuition}</div>
                <div className="mt-2 text-2xl font-semibold">{formatUsd(normalTuition)}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{t.publicRate}</div>
              </div>
              <div className="rounded-xl border border-primary/15 bg-primary/10 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.partnerTuition}</div>
                <div className="mt-2 text-2xl font-semibold">{formatUsd(partnerTuition)}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{t.partnerRate}</div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.savings}</div>
                <div className="mt-2 text-2xl font-semibold text-success">{formatUsd(savings)}</div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.livingCosts}</div>
                <div className="mt-2 text-2xl font-semibold">{livingCostsLabel}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{t.fixedCosts} : {fixedCostsLabel}</div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.visaCosts}</div>
                <div className="mt-2 text-2xl font-semibold">{formatUsd(visaCosts)}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{selectedVisa.label}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-4 pt-0 sm:space-y-6 sm:p-8 sm:pt-0">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    {t.studentCosts}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.studentCostsHelp}</p>

                  <div className="mt-5 space-y-5">
                    {editableComponents.map((component) => {
                      const value = customCosts[component.label] ?? component.amountUsd
                      const min = sliderMin(component.amountUsd)
                      const max = sliderMax(component.amountUsd)
                      return (
                        <label key={component.label} className="block rounded-xl border bg-card/80 p-4">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">{cleanText(component.label)}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {t.reference} : {formatUsd(component.amountUsd)}
                              </div>
                            </div>
                            <div className="font-mono-ui text-sm font-semibold text-primary">{formatUsd(value)}</div>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            step={100}
                            value={value}
                            onChange={(event) => setCustomCosts((current) => ({
                              ...current,
                              [component.label]: Number(event.target.value)
                            }))}
                            className="w-full accent-primary"
                          />
                          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                            <span>{t.lean}</span>
                            <span>{t.reference}</span>
                            <span>{t.comfortable}</span>
                          </div>
                        </label>
                      )
                    })}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card/80 p-4">
                      <div className="text-xs text-muted-foreground">{t.publicTotal}</div>
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
                              <Badge variant="outline" className="rounded-full text-[10px]">{t.livingCosts}</Badge>
                            ) : null}
                          </div>
                          <div className="mt-2 text-lg font-semibold">{formatUsd(amount)}</div>
                        </div>
                      )
                    })}
                    <div className="rounded-xl border bg-card/80 p-3 motion-pop sm:p-4">
                      <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
                        <span>{t.visaCosts}</span>
                        <Badge variant="outline" className="rounded-full text-[10px]">{t.fixedCosts}</Badge>
                      </div>
                      <div className="mt-2 text-lg font-semibold">{formatUsd(visaCosts)}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{selectedVisa.label}</div>
                    </div>
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
