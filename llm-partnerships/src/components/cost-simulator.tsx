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
  SlidersHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Partnership } from "@/lib/types"
import { cleanText, translateDataText, type UiLanguage } from "@/lib/text-utils"
import {
  formatUsd,
  getCostEstimatesMeta,
  getEstimatesForDisplayCity,
  getPartnershipCostResolutions,
  getScopedDisplayCities,
  type CostComponent,
} from "@/lib/us-cost-estimates"
import { inferOfferOptions } from "@/lib/tuition-offers"

const copy = {
  fr: {
    badge: "Simulateur étudiant",
    title: "Budget annuel LL.M. : public vs partenariat",
    intro:
      "Les frais d'inscription peuvent être le premier poste d'un LL.M. aux États-Unis, mais ils ne sont jamais seuls : visa, livres, logement, repas, transport, assurance et billets d'avion peuvent aussi peser lourd. Compare le prix public, le prix avec partenariat, puis ajuste les dépenses qui dépendent de toi.",
    city: "1. Ville",
    school: "École de référence",
    partnership: "2. Partenariat",
    offer: "3. Offre appliquée",
    visa: "4. Situation visa",
    barJurisdiction: "5. Barreau visé",
    noPartnership: "Aucun partenariat précis",
    noOffer: "Tarif public",
    publicTuition: "Tuition publique annuelle",
    partnerTuition: "Tuition grâce au partenariat",
    savings: "Économie sur la tuition",
    fixedCosts: "Frais fixes annuels",
    visaCosts: "Frais visa estimés",
    livingCosts: "Dépenses de vie ajustables",
    healthInsurance: "Assurance santé",
    flights: "Billets d'avion France - États-Unis",
    frenchUniversityFees:
      "Frais éventuels à l'université française",
    nyBarExamFee: "NY Bar Exam - inscription candidat étranger",
    nyBarLaptop: "NY Bar Exam - ordinateur",
    nyleFee: "NYLE - examen en ligne",
    mpreFee: "MPRE - éthique professionnelle",
    barPrep: "Préparation au barreau",
    barExamLogistics: "Logement et transport pour le barreau",
    nyleHelp:
      "Le NYLE est le New York Law Exam : un examen en ligne propre à New York, distinct de l'UBE, à valider pour l'admission au barreau de New York.",
    mpreHelp:
      "Le MPRE est l'examen national d'éthique professionnelle requis par de nombreux barreaux américains, dont New York, la Californie, DC et Washington.",
    laptopHelp:
      "Ce poste correspond aux frais de logiciel ou d'utilisation d'un ordinateur pour composer l'examen. Le montant varie selon l'État et la session.",
    barPrepHelp:
      "La préparation dépend de la formule choisie. Les références les plus utilisées sont Themis et BARBRI ; elles servent ici d'ordre de grandeur. Des réductions ou bourses peuvent exister via certaines law schools partenaires, donc le coût peut fortement varier.",
    barJurisdictionNote:
      "L'éligibilité d'un juriste formé à l'étranger dépend de l'État, du premier diplôme de droit, du LL.M. et des matières suivies. Vérifie toujours les règles officielles avant de candidater.",
    publicTotal: "Budget annuel sans partenariat",
    partnerTotal: "Budget annuel avec partenariat",
    showEuros: "Voir en EUR",
    showDollars: "Voir en USD",
    euroEstimateNote: "Conversion indicative : 1 $ ≈ 0,879 €.",
    studentCosts: "Ajuste ton mode de vie",
    studentCostsHelp:
      "Ces curseurs modifient seulement les postes qui varient selon ton choix de logement, repas, transport, assurance, billets d'avion, préparation au barreau ou dépenses personnelles.",
    lean: "sobre",
    reference: "référence",
    comfortable: "confort",
    costBreakdown: "Détail du calcul annuel",
    fixedHint:
      "Tuition, livres, visa et frais d'examen imposés restent fixes. Seules les dépenses de vie et de préparation ci-dessus sont interactives.",
    methodology: "Méthodologie",
    cityPartners: "Ville et partenaires concernés",
    otherCosts: "Postes de vie courants",
    sources: "Sources officielles",
    booksHelp:
      "Ce poste correspond aux livres et fournitures académiques : manuels obligatoires, supports de cours, impressions, accès à des bases de données ou matériel demandé par l'école. Il ne s'agit pas d'une dépense de vie librement ajustable.",
    frenchUniversityFeesHelp:
      "Estimation des frais qui peuvent rester dus côté français : inscription administrative, CVEC éventuelle, frais de dossier, frais de diplôme ou frais locaux selon l'université et le partenariat. Ce poste ne correspond pas à la tuition américaine.",
    freeSeat: "Place sans frais de scolarité partenaire",
    reducedSeat: "Place à frais réduits",
    scholarshipSeat: "Bourse ou remise possible",
    percentSeat: "Remise de {percent}%",
    referenceAmount: "montant indiqué",
    publicRate: "Prix public normal",
    partnerRate: "Prix après partenariat",
    unsupportedSchool: "Aucune estimation de référence",
    unsupportedEstimate:
      "Aucune estimation annuelle n’est disponible pour cette destination. Le partenariat reste visible, mais aucun total LL.M. ne sera inventé.",
    visaNone: "Pas de visa à prévoir",
    visaF1: "F-1 initial : MRV + SEVIS",
    visaJ1: "J-1 initial : MRV + SEVIS",
    visaSevisOnly: "SEVIS uniquement",
    visaRenewal: "Renouvellement visa : MRV",
    visaNote:
      "Estimation basée sur MRV 185 $ et SEVIS I-901 : F/M 350 $, J 220 $. Les frais de délivrance éventuels dépendent de la nationalité.",
  },
  en: {
    badge: "Student simulator",
    title: "Annual LL.M. budget: public vs partnership",
    intro:
      "Tuition can be the largest line item for a U.S. LL.M., but it is not the only one: visa, books, housing, meals, transport, insurance, and flights can also be significant. Compare the public price, the partnership price, then adjust the costs driven by your own choices.",
    city: "1. City",
    school: "Reference school",
    partnership: "2. Partnership",
    offer: "3. Applied offer",
    visa: "4. Visa situation",
    barJurisdiction: "5. Target bar",
    noPartnership: "No specific partnership",
    noOffer: "Public rate",
    publicTuition: "Annual public tuition",
    partnerTuition: "Tuition with partnership",
    savings: "Tuition savings",
    fixedCosts: "Annual fixed costs",
    visaCosts: "Estimated visa fees",
    livingCosts: "Editable living costs",
    healthInsurance: "Health insurance",
    flights: "France - U.S. flights",
    frenchUniversityFees:
      "Possible fees at the French university",
    nyBarExamFee: "NY Bar Exam - foreign applicant fee",
    nyBarLaptop: "NY Bar Exam - laptop fee",
    nyleFee: "NYLE - online exam",
    mpreFee: "MPRE - professional responsibility",
    barPrep: "Bar preparation",
    barExamLogistics: "Bar exam lodging and transport",
    nyleHelp:
      "The NYLE is the New York Law Exam: a New York-specific online exam, separate from the UBE, required for New York admission.",
    mpreHelp:
      "The MPRE is the national professional responsibility exam required by many U.S. jurisdictions, including New York, California, DC, and Washington.",
    laptopHelp:
      "This covers laptop or exam software fees. The amount depends on the jurisdiction and exam administration.",
    barPrepHelp:
      "Preparation cost depends on the provider and package. Themis and BARBRI are common reference providers for this estimate. Discounts or scholarships may be available through some U.S. law school partnerships, so the final cost can vary significantly.",
    barJurisdictionNote:
      "Eligibility for foreign-trained lawyers depends on the jurisdiction, first law degree, LL.M., and required coursework. Always verify the official rules before applying.",
    publicTotal: "Annual budget without partnership",
    partnerTotal: "Annual budget with partnership",
    showEuros: "Show EUR",
    showDollars: "Show USD",
    euroEstimateNote: "Indicative conversion: $1 ≈ €0.879.",
    studentCosts: "Adjust your lifestyle",
    studentCostsHelp:
      "These sliders only change costs driven by your housing, meals, transport, insurance, flights, bar prep, or personal spending choices.",
    lean: "lean",
    reference: "reference",
    comfortable: "comfortable",
    costBreakdown: "Annual calculation details",
    fixedHint:
      "Tuition, books, visa, and mandatory exam fees stay fixed. Only the living and preparation costs above are interactive.",
    methodology: "Methodology",
    cityPartners: "City and matching partners",
    otherCosts: "Common living costs",
    sources: "Official sources",
    booksHelp:
      "This item covers academic books and supplies: required textbooks, course materials, printing, database access, or equipment required by the school. It is not a freely adjustable living expense.",
    frenchUniversityFeesHelp:
      "Estimate for fees that may remain payable to the French university: administrative registration, possible CVEC, application fees, degree fees, or local charges depending on the university and partnership. This is not U.S. tuition.",
    freeSeat: "Partner tuition-free seat",
    reducedSeat: "Reduced tuition seat",
    scholarshipSeat: "Scholarship or discount possible",
    percentSeat: "{percent}% discount",
    referenceAmount: "published amount",
    publicRate: "Normal public price",
    partnerRate: "Price after partnership",
    unsupportedSchool: "No reference estimate",
    unsupportedEstimate:
      "No annual cost estimate is available for this destination. The partnership remains visible, but no LL.M. total will be invented.",
    visaNone: "No visa cost to include",
    visaF1: "Initial F-1: MRV + SEVIS",
    visaJ1: "Initial J-1: MRV + SEVIS",
    visaSevisOnly: "SEVIS only",
    visaRenewal: "Visa renewal: MRV",
    visaNote:
      "Estimate based on MRV $185 and SEVIS I-901: F/M $350, J $220. Any visa issuance fee depends on nationality.",
  },
  es: {
    badge: "Simulador estudiante",
    title: "Presupuesto anual LL.M.: público vs convenio",
    intro:
      "La matrícula puede ser el mayor coste de un LL.M. en Estados Unidos, pero no es el único: visa, libros, vivienda, comidas, transporte, seguro y vuelos también pueden ser elevados. Compara el precio público, el precio con convenio y ajusta los gastos que dependen de ti.",
    city: "1. Ciudad",
    school: "Escuela de referencia",
    partnership: "2. Convenio",
    offer: "3. Oferta aplicada",
    visa: "4. Situación de visa",
    barJurisdiction: "5. Barra objetivo",
    noPartnership: "Ningún convenio específico",
    noOffer: "Tarifa pública",
    publicTuition: "Matrícula pública anual",
    partnerTuition: "Matrícula con convenio",
    savings: "Ahorro en matrícula",
    fixedCosts: "Costes fijos anuales",
    visaCosts: "Costes estimados de visa",
    livingCosts: "Gastos de vida ajustables",
    healthInsurance: "Seguro de salud",
    flights: "Vuelos Francia - Estados Unidos",
    frenchUniversityFees:
      "Posibles tasas en la universidad francesa",
    nyBarExamFee: "NY Bar Exam - tasa candidato extranjero",
    nyBarLaptop: "NY Bar Exam - tasa ordenador",
    nyleFee: "NYLE - examen en línea",
    mpreFee: "MPRE - ética profesional",
    barPrep: "Preparación para el bar exam",
    barExamLogistics: "Alojamiento y transporte para el bar exam",
    nyleHelp:
      "El NYLE es el New York Law Exam: un examen en línea específico de Nueva York, separado del UBE, necesario para la admisión en Nueva York.",
    mpreHelp:
      "El MPRE es el examen nacional de responsabilidad profesional exigido por muchos estados, incluyendo Nueva York, California, DC y Washington.",
    laptopHelp:
      "Este coste corresponde al software o uso de ordenador para el examen. El importe varía según el estado y la sesión.",
    barPrepHelp:
      "El coste de preparación depende del proveedor y del paquete. Themis y BARBRI son referencias habituales para esta estimación. Algunas law schools pueden ofrecer descuentos o becas, por lo que el coste final puede variar bastante.",
    barJurisdictionNote:
      "La elegibilidad de juristas formados fuera de EE. UU. depende del estado, del primer título de derecho, del LL.M. y de las materias cursadas. Verifica siempre las reglas oficiales antes de aplicar.",
    publicTotal: "Presupuesto anual sin convenio",
    partnerTotal: "Presupuesto anual con convenio",
    showEuros: "Ver en EUR",
    showDollars: "Ver en USD",
    euroEstimateNote: "Conversión indicativa: 1 $ ≈ 0,879 €.",
    studentCosts: "Ajusta tu estilo de vida",
    studentCostsHelp:
      "Estos controles solo modifican gastos que dependen de tu vivienda, comidas, transporte, seguro, vuelos, preparación del bar exam o gastos personales.",
    lean: "sobrio",
    reference: "referencia",
    comfortable: "cómodo",
    costBreakdown: "Detalle del cálculo anual",
    fixedHint:
      "Matrícula, libros, visa y tasas obligatorias de examen permanecen fijas. Solo los gastos de vida y preparación anteriores son interactivos.",
    methodology: "Metodología",
    cityPartners: "Ciudad y convenios relacionados",
    otherCosts: "Costes de vida habituales",
    sources: "Fuentes oficiales",
    booksHelp:
      "Este concepto cubre libros y materiales académicos: manuales obligatorios, materiales de curso, impresiones, acceso a bases de datos o equipo requerido por la escuela. No es un gasto de vida libremente ajustable.",
    frenchUniversityFeesHelp:
      "Estimación de tasas que pueden seguir debiéndose a la universidad francesa: inscripción administrativa, posible CVEC, tasas de expediente, diploma o costes locales según la universidad y el convenio. No corresponde a la matrícula estadounidense.",
    freeSeat: "Plaza sin matrícula de la universidad asociada",
    reducedSeat: "Plaza con matrícula reducida",
    scholarshipSeat: "Beca o reducción posible",
    percentSeat: "Reducción de {percent}%",
    referenceAmount: "importe indicado",
    publicRate: "Precio público normal",
    partnerRate: "Precio tras convenio",
    unsupportedSchool: "Sin estimación de referencia",
    unsupportedEstimate:
      "No hay una estimación anual disponible para este destino. El convenio sigue visible, pero no se inventará ningún total de LL.M.",
    visaNone: "Sin coste de visa",
    visaF1: "F-1 inicial: MRV + SEVIS",
    visaJ1: "J-1 inicial: MRV + SEVIS",
    visaSevisOnly: "Solo SEVIS",
    visaRenewal: "Renovación de visa: MRV",
    visaNote:
      "Estimación basada en MRV 185 $ y SEVIS I-901: F/M 350 $, J 220 $. Las tasas de emisión dependen de la nacionalidad.",
  },
} as const

type VisaOption = {
  id: string
  label: string
  amountUsd: number
}

type BarCostItem = {
  key:
    "barExam" | "laptop" | "nyle" | "mpre" | "character" | "prep" | "logistics"
  label: string
  amountUsd: number
  editable?: boolean
}

type BarJurisdictionOption = {
  id: string
  label: string
  eligibilityNote: string
  items: BarCostItem[]
}

function getVisaOptions(language: UiLanguage): VisaOption[] {
  const t = copy[language]

  return [
    { id: "none", label: t.visaNone, amountUsd: 0 },
    { id: "f1-initial", label: t.visaF1, amountUsd: 535 },
    { id: "j1-initial", label: t.visaJ1, amountUsd: 405 },
    { id: "sevis-only", label: t.visaSevisOnly, amountUsd: 350 },
    { id: "renewal", label: t.visaRenewal, amountUsd: 185 },
  ]
}

function getBarJurisdictionOptions(
  language: UiLanguage,
): BarJurisdictionOption[] {
  const t = copy[language]
  const notes = {
    fr: {
      ny: "Voie la plus courante pour les LL.M. : possible si le diplôme étranger et le LL.M. respectent les exigences de la règle 520.6.",
      ca: "Possible pour certains diplômés étrangers, après évaluation de l'éducation juridique et/ou compléments requis par le State Bar of California.",
      dc: "Possible notamment avec 26 crédits dans une law school ABA, concentrés sur les matières testées par l'UBE, sous réserve de validation.",
      wa: "Possible pour certains diplômés étrangers avec LL.M. ABA et conditions APR 3, notamment selon formation et pratique antérieure.",
      wi: "Possible pour certains diplômés étrangers avec LL.M. ou autre diplôme de droit avancé d'une law school ABA, sous réserve de l'évaluation et des conditions Wisconsin.",
    },
    en: {
      ny: "The most common LL.M. route: possible if the foreign law degree and LL.M. satisfy Rule 520.6 requirements.",
      ca: "Possible for some foreign-educated applicants, after legal education evaluation and/or required supplemental study.",
      dc: "Possible with 26 credits at an ABA-approved law school substantially concentrated on UBE-tested subjects, subject to approval.",
      wa: "Possible for some foreign law graduates with an ABA LL.M. under APR 3, depending on education and prior practice.",
      wi: "Possible for some foreign law graduates with an LL.M. or other advanced law degree from an ABA-approved law school, subject to Wisconsin review and conditions.",
    },
    es: {
      ny: "La vía más común para LL.M.: posible si el título extranjero y el LL.M. cumplen la regla 520.6.",
      ca: "Posible para algunos candidatos formados fuera de EE. UU., tras evaluación y/o estudios complementarios exigidos.",
      dc: "Posible con 26 créditos en una law school ABA concentrados en materias del UBE, sujeto a validación.",
      wa: "Posible para algunos graduados extranjeros con LL.M. ABA bajo APR 3, según formación y práctica previa.",
      wi: "Posible para algunos graduados extranjeros con LL.M. u otro título avanzado de una law school ABA, sujeto a revisión y condiciones de Wisconsin.",
    },
  }[language]

  return [
    {
      id: "ny",
      label: "New York",
      eligibilityNote: notes.ny,
      items: [
        { key: "barExam", label: t.nyBarExamFee, amountUsd: 750 },
        { key: "laptop", label: t.nyBarLaptop, amountUsd: 100 },
        { key: "nyle", label: t.nyleFee, amountUsd: 29 },
        { key: "mpre", label: t.mpreFee, amountUsd: 185 },
        {
          key: "prep",
          label: `${t.barPrep} - New York`,
          amountUsd: 3000,
          editable: true,
        },
        {
          key: "logistics",
          label: `${t.barExamLogistics} - New York`,
          amountUsd: 800,
          editable: true,
        },
      ],
    },
    {
      id: "ca",
      label: "California",
      eligibilityNote: notes.ca,
      items: [
        {
          key: "barExam",
          label: "California Bar Exam - application",
          amountUsd: 878,
        },
        {
          key: "laptop",
          label: "California Bar Exam - laptop",
          amountUsd: 153,
        },
        {
          key: "character",
          label: "California - moral character",
          amountUsd: 725,
        },
        { key: "mpre", label: t.mpreFee, amountUsd: 185 },
        {
          key: "prep",
          label: `${t.barPrep} - California`,
          amountUsd: 3000,
          editable: true,
        },
        {
          key: "logistics",
          label: `${t.barExamLogistics} - California`,
          amountUsd: 1000,
          editable: true,
        },
      ],
    },
    {
      id: "dc",
      label: "District of Columbia",
      eligibilityNote: notes.dc,
      items: [
        { key: "barExam", label: "DC Bar Exam - application", amountUsd: 405 },
        {
          key: "laptop",
          label: "DC Bar Exam - laptop/software",
          amountUsd: 150,
        },
        {
          key: "character",
          label: "DC - NCBE investigation estimate",
          amountUsd: 500,
          editable: true,
        },
        { key: "mpre", label: t.mpreFee, amountUsd: 185 },
        {
          key: "prep",
          label: `${t.barPrep} - DC`,
          amountUsd: 3000,
          editable: true,
        },
        {
          key: "logistics",
          label: `${t.barExamLogistics} - DC`,
          amountUsd: 800,
          editable: true,
        },
      ],
    },
    {
      id: "wa",
      label: "Washington State",
      eligibilityNote: notes.wa,
      items: [
        {
          key: "barExam",
          label: "Washington Bar Exam - application/exam",
          amountUsd: 740,
        },
        { key: "mpre", label: t.mpreFee, amountUsd: 185 },
        {
          key: "prep",
          label: `${t.barPrep} - Washington`,
          amountUsd: 3000,
          editable: true,
        },
        {
          key: "logistics",
          label: `${t.barExamLogistics} - Washington`,
          amountUsd: 1200,
          editable: true,
        },
      ],
    },
    {
      id: "wi",
      label: "Wisconsin",
      eligibilityNote: notes.wi,
      items: [
        {
          key: "barExam",
          label: "Wisconsin Bar Exam - application/exam",
          amountUsd: 450,
        },
        { key: "laptop", label: "Wisconsin Bar Exam - laptop", amountUsd: 163 },
        { key: "mpre", label: t.mpreFee, amountUsd: 185 },
        {
          key: "prep",
          label: `${t.barPrep} - Wisconsin`,
          amountUsd: 3000,
          editable: true,
        },
        {
          key: "logistics",
          label: `${t.barExamLogistics} - Wisconsin`,
          amountUsd: 900,
          editable: true,
        },
      ],
    },
  ]
}

const DEFAULT_HEALTH_INSURANCE_USD = 2800
const DEFAULT_FLIGHTS_USD = 1200
const DEFAULT_FRENCH_UNIVERSITY_FEES_USD = 700
const USD_TO_EUR_RATE = 0.879

export type CostSimulatorOriginConfig = {
  flights: Record<UiLanguage, string>
  universityFees: Record<UiLanguage, string>
  universityFeesHelp: Record<UiLanguage, string>
  universityFeesUsd: number
}

function isInsuranceComponent(label: string) {
  const normalized = cleanText(label).toLowerCase()
  return (
    normalized.includes("assurance") ||
    normalized.includes("insurance") ||
    normalized.includes("seguro")
  )
}

function isFlightsComponent(label: string) {
  const normalized = cleanText(label).toLowerCase()
  return (
    normalized.includes("billet") ||
    normalized.includes("avion") ||
    normalized.includes("flight") ||
    normalized.includes("vuelos")
  )
}

function isBarPrepComponent(label: string) {
  const normalized = cleanText(label).toLowerCase()
  return (
    normalized.includes("préparation") ||
    normalized.includes("preparation") ||
    normalized.includes("bar prep") ||
    normalized.includes("preparación")
  )
}

function isOriginUniversityFeesComponent(
  label: string,
  originConfig?: CostSimulatorOriginConfig,
) {
  const normalized = cleanText(label).toLowerCase()
  return (
    normalized.includes("universite francaise") ||
    normalized.includes("université française") ||
    normalized.includes("french university") ||
    normalized.includes("universidad francesa") ||
    normalized.includes("universite allemande") ||
    normalized.includes("universität") ||
    normalized.includes("german university") ||
    normalized.includes("universidad alemana") ||
    Object.values(originConfig?.universityFees || {}).some(
      (configuredLabel) =>
        cleanText(configuredLabel).toLowerCase() === normalized,
    )
  )
}

function getSupplementalCostComponents(
  components: CostComponent[],
  language: UiLanguage,
  barJurisdiction: BarJurisdictionOption,
  originConfig?: CostSimulatorOriginConfig,
): CostComponent[] {
  const t = copy[language]
  const supplemental: CostComponent[] = []

  if (!components.some((component) => isInsuranceComponent(component.label))) {
    supplemental.push({
      label: t.healthInsurance,
      amountUsd: DEFAULT_HEALTH_INSURANCE_USD,
      kind: "other",
    })
  }

  if (!components.some((component) => isFlightsComponent(component.label))) {
    supplemental.push({
      label: originConfig?.flights[language] ?? t.flights,
      amountUsd: DEFAULT_FLIGHTS_USD,
      kind: "other",
    })
  }

  supplemental.push({
    label: originConfig?.universityFees[language] ?? t.frenchUniversityFees,
    amountUsd:
      originConfig?.universityFeesUsd ??
      DEFAULT_FRENCH_UNIVERSITY_FEES_USD,
    kind: "other",
  })

  for (const item of barJurisdiction.items) {
    supplemental.push({
      label: item.label,
      amountUsd: item.amountUsd,
      kind: "other",
    })
  }

  return supplemental
}

function isBooksComponent(label: string) {
  const normalized = cleanText(label).toLowerCase()
  return normalized.includes("livres") || normalized.includes("books")
}

function BooksHelpTooltip({ text }: { text: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-7 sm:w-7"
          aria-label={text}
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        role="tooltip"
        side="top"
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="w-[min(19rem,calc(100vw-2rem))] border bg-popover p-3.5 text-left text-xs leading-5 text-popover-foreground"
      >
        {text}
      </PopoverContent>
    </Popover>
  )
}

function getCostHelpText(
  label: string,
  language: UiLanguage,
  originConfig?: CostSimulatorOriginConfig,
) {
  const t = copy[language]
  const normalized = cleanText(label).toLowerCase()

  if (normalized.includes("nyle")) return t.nyleHelp
  if (normalized.includes("mpre")) return t.mpreHelp
  if (
    normalized.includes("ordinateur") ||
    normalized.includes("laptop") ||
    normalized.includes("software") ||
    normalized.includes("ordenador")
  )
    return t.laptopHelp
  if (isBarPrepComponent(label)) return t.barPrepHelp
  if (isOriginUniversityFeesComponent(label, originConfig))
    return (
      originConfig?.universityFeesHelp[language] ??
      t.frenchUniversityFeesHelp
    )
  if (isBooksComponent(label)) return t.booksHelp

  return undefined
}

function isTuitionComponent(component: CostComponent) {
  return component.kind === "tuition"
}

function isEditableLivingComponent(
  component: CostComponent,
  originConfig?: CostSimulatorOriginConfig,
) {
  const label = cleanText(component.label).toLowerCase()
  if (component.kind === "tuition" || isBooksComponent(label)) return false
  if (label.includes("frais universitaire") || label.includes("activity fee"))
    return false
  if (
    label.includes("loan fee") ||
    label.includes("mbe support") ||
    label.includes("health services fee")
  )
    return false

  return (
    label.includes("logement") ||
    label.includes("nourriture") ||
    label.includes("repas") ||
    label.includes("transport") ||
    isInsuranceComponent(label) ||
    isFlightsComponent(label) ||
    isOriginUniversityFeesComponent(label, originConfig) ||
    isBarPrepComponent(label) ||
    label.includes("personal") ||
    label.includes("personnelles") ||
    label.includes("housing") ||
    label.includes("food") ||
    label.includes("meal")
  )
}

function formatEurFromUsd(amountUsd: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(amountUsd * USD_TO_EUR_RATE))
}

function sliderMin(amount: number) {
  return Math.max(0, Math.round((amount * 0.55) / 100) * 100)
}

function sliderMax(amount: number) {
  return Math.max(1000, Math.round((amount * 1.65) / 100) * 100)
}

export function CostSimulator({
  partnerships,
  language = "fr",
  originConfig,
}: {
  partnerships: Partnership[]
  language?: UiLanguage
  originConfig?: CostSimulatorOriginConfig
}) {
  const t = copy[language]
  const tr = (value: unknown) => translateDataText(value, language)
  const meta = React.useMemo(() => getCostEstimatesMeta(), [])
  const resolutions = React.useMemo(
    () => getPartnershipCostResolutions(partnerships),
    [partnerships],
  )
  const cities = React.useMemo(
    () => getScopedDisplayCities(partnerships),
    [partnerships],
  )
  const barJurisdictionOptions = React.useMemo(
    () => getBarJurisdictionOptions(language),
    [language],
  )

  const [selectedCity, setSelectedCity] = React.useState(cities[0] ?? "")
  const [selectedBarJurisdictionId, setSelectedBarJurisdictionId] =
    React.useState("ny")
  const cityEstimates = React.useMemo(
    () => getEstimatesForDisplayCity(selectedCity),
    [selectedCity],
  )
  const [selectedEstimateId, setSelectedEstimateId] = React.useState(
    cityEstimates[0]?.id ?? "",
  )

  React.useEffect(() => {
    if (!cityEstimates.some((estimate) => estimate.id === selectedEstimateId)) {
      setSelectedEstimateId(cityEstimates[0]?.id ?? "")
    }
  }, [cityEstimates, selectedEstimateId])

  const selectedEstimate =
    cityEstimates.find((estimate) => estimate.id === selectedEstimateId) ||
    cityEstimates[0]
  const selectedBarJurisdiction =
    barJurisdictionOptions.find(
      (option) => option.id === selectedBarJurisdictionId,
    ) || barJurisdictionOptions[0]
  const estimateComponents = React.useMemo(
    () =>
      selectedEstimate
        ? [
            ...selectedEstimate.components,
            ...getSupplementalCostComponents(
              selectedEstimate.components,
              language,
              selectedBarJurisdiction,
              originConfig,
            ),
          ]
        : [],
    [selectedEstimate, language, selectedBarJurisdiction, originConfig],
  )

  const partnershipsInCity = React.useMemo(
    () =>
      resolutions
        .filter((resolution) => resolution.displayCity === selectedCity)
        .map((resolution) => resolution.partnership),
    [resolutions, selectedCity],
  )

  const [selectedPartnershipId, setSelectedPartnershipId] = React.useState("")
  const [selectedOfferId, setSelectedOfferId] = React.useState("public")
  const [selectedVisaId, setSelectedVisaId] = React.useState("f1-initial")
  const [showTotalsInEur, setShowTotalsInEur] = React.useState(false)
  const [customCosts, setCustomCosts] = React.useState<Record<string, number>>(
    {},
  )

  React.useEffect(() => {
    const first = partnershipsInCity[0]
    setSelectedPartnershipId(first?.id ?? "")
  }, [partnershipsInCity])

  const selectedPartnership = partnershipsInCity.find(
    (partnership) => partnership.id === selectedPartnershipId,
  )

  const normalTuition = estimateComponents
    .filter(isTuitionComponent)
    .reduce((total, component) => total + component.amountUsd, 0)
  const offerOptions = React.useMemo(
    () => inferOfferOptions(selectedPartnership, normalTuition, language),
    [selectedPartnership, normalTuition, language],
  )
  const selectedOffer =
    offerOptions.find((offer) => offer.id === selectedOfferId) ||
    offerOptions[0]
  const visaOptions = React.useMemo(() => getVisaOptions(language), [language])
  const selectedVisa =
    visaOptions.find((option) => option.id === selectedVisaId) || visaOptions[0]

  React.useEffect(() => {
    setSelectedOfferId("public")
  }, [offerOptions])

  const fixedComponents = React.useMemo(
    () =>
      estimateComponents.filter(
        (component) =>
          !isTuitionComponent(component) &&
          !isEditableLivingComponent(component, originConfig),
      ),
    [estimateComponents, originConfig],
  )
  const editableComponents = React.useMemo(
    () =>
      estimateComponents.filter((component) =>
        isEditableLivingComponent(component, originConfig),
      ),
    [estimateComponents, originConfig],
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

  if (!selectedEstimate || !selectedOffer) {
    if (!selectedCity) return null

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
                  <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                    {t.title}
                  </CardTitle>
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {t.intro}
                  </p>
                </div>

                <div className="grid gap-3 rounded-2xl border bg-secondary/45 p-3 sm:p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t.city}
                      </label>
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
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
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full justify-start"
                        aria-label={t.school}
                        disabled
                      >
                        {t.unsupportedSchool}
                      </Button>
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
                          <SelectItem
                            key={partnership.id}
                            value={partnership.id}
                            data-partnership-id={partnership.id}
                          >
                            {tr(partnership.frenchUniversity)} →{" "}
                            {tr(partnership.partnerUniversity)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    role="status"
                    className="rounded-xl border border-dashed bg-background/70 p-3 text-sm leading-6 text-muted-foreground"
                  >
                    {t.unsupportedEstimate}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    )
  }

  const fixedOtherCosts = fixedComponents.reduce(
    (total, component) => total + component.amountUsd,
    0,
  )
  const editableOtherCosts = editableComponents.reduce(
    (total, component) =>
      total + (customCosts[component.label] ?? component.amountUsd),
    0,
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
    new Set(
      partnershipsInCity.map((partnership) =>
        cleanText(partnership.partnerUniversity),
      ),
    ),
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
                <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                  {t.title}
                </CardTitle>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  {t.intro}
                </p>
              </div>

              <div className="grid gap-3 rounded-2xl border bg-secondary/45 p-3 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      {t.city}
                    </label>
                    <Select
                      value={selectedCity}
                      onValueChange={setSelectedCity}
                    >
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
                    <Select
                      value={selectedEstimate.id}
                      onValueChange={setSelectedEstimateId}
                    >
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
                        <SelectItem
                          key={partnership.id}
                          value={partnership.id}
                          data-partnership-id={partnership.id}
                        >
                          {tr(partnership.frenchUniversity)} →{" "}
                          {tr(partnership.partnerUniversity)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.offer}
                  </label>
                  <Select
                    value={selectedOffer.id}
                    onValueChange={setSelectedOfferId}
                  >
                    <SelectTrigger className="h-11" aria-label={t.offer}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {offerOptions.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.label} - {formatUsd(offer.tuitionUsd)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedOffer.note ? (
                    <p className="text-xs leading-5 text-muted-foreground">
                      {tr(selectedOffer.note)}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.visa}
                  </label>
                  <Select
                    value={selectedVisa.id}
                    onValueChange={setSelectedVisaId}
                  >
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
                  <p className="text-xs leading-5 text-muted-foreground">
                    {t.visaNote}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.barJurisdiction}
                  </label>
                  <Select
                    value={selectedBarJurisdiction.id}
                    onValueChange={setSelectedBarJurisdictionId}
                  >
                    <SelectTrigger
                      className="h-11"
                      aria-label={t.barJurisdiction}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {barJurisdictionOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {selectedBarJurisdiction.eligibilityNote}{" "}
                    {t.barJurisdictionNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">
                  {t.publicTuition}
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  {formatUsd(normalTuition)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {t.publicRate}
                </div>
              </div>
              <div className="rounded-xl border border-primary/15 bg-primary/10 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">
                  {t.partnerTuition}
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  {formatUsd(partnerTuition)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {t.partnerRate}
                </div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">{t.savings}</div>
                <div className="mt-2 text-2xl font-semibold text-success">
                  {formatUsd(savings)}
                </div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">
                  {t.livingCosts}
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  {livingCostsLabel}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {t.fixedCosts} : {fixedCostsLabel}
                </div>
              </div>
              <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
                <div className="text-xs text-muted-foreground">
                  {t.visaCosts}
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  {formatUsd(visaCosts)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {selectedVisa.label}
                </div>
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
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t.studentCostsHelp}
                  </p>

                  <div className="mt-5 space-y-5">
                    {editableComponents.map((component) => {
                      const value =
                        customCosts[component.label] ?? component.amountUsd
                      const min = sliderMin(component.amountUsd)
                      const max = sliderMax(component.amountUsd)
                      const helpText = getCostHelpText(
                        component.label,
                        language,
                        originConfig,
                      )
                      return (
                        <div
                          key={component.label}
                          className="block rounded-xl border bg-card/80 p-4"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <span>{tr(component.label)}</span>
                                {helpText ? (
                                  <BooksHelpTooltip text={helpText} />
                                ) : null}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {t.reference} : {formatUsd(component.amountUsd)}
                              </div>
                            </div>
                            <div className="font-mono-ui text-sm font-semibold text-primary">
                              {formatUsd(value)}
                            </div>
                          </div>
                          <input
                            type="range"
                            aria-label={tr(component.label)}
                            min={min}
                            max={max}
                            step={100}
                            value={value}
                            onChange={(event) =>
                              setCustomCosts((current) => ({
                                ...current,
                                [component.label]: Number(event.target.value),
                              }))
                            }
                            className="w-full accent-primary"
                          />
                          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                            <span>{t.lean}</span>
                            <span>{t.reference}</span>
                            <span>{t.comfortable}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-muted-foreground">
                      {showTotalsInEur ? t.euroEstimateNote : t.fixedHint}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-full rounded-full px-4 text-xs sm:w-auto"
                      aria-pressed={showTotalsInEur}
                      onClick={() => setShowTotalsInEur((current) => !current)}
                    >
                      {showTotalsInEur ? t.showDollars : t.showEuros}
                    </Button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card/80 p-4">
                      <div className="text-xs text-muted-foreground">
                        {t.publicTotal}
                      </div>
                      <div className="mt-2 text-xl font-semibold">
                        {showTotalsInEur
                          ? formatEurFromUsd(normalTotal)
                          : formatUsd(normalTotal)}
                      </div>
                      {showTotalsInEur ? (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {formatUsd(normalTotal)}
                        </div>
                      ) : null}
                    </div>
                    <div className="rounded-xl border border-primary/15 bg-primary/10 p-4">
                      <div className="text-xs text-muted-foreground">
                        {t.partnerTotal}
                      </div>
                      <div className="mt-2 text-xl font-semibold">
                        {showTotalsInEur
                          ? formatEurFromUsd(partnerTotal)
                          : formatUsd(partnerTotal)}
                      </div>
                      {showTotalsInEur ? (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {formatUsd(partnerTotal)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    {t.costBreakdown}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {t.fixedHint}
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                    {estimateComponents.map((component) => {
                      const editable = isEditableLivingComponent(
                        component,
                        originConfig,
                      )
                      const amount = editable
                        ? (customCosts[component.label] ?? component.amountUsd)
                        : component.amountUsd
                      const helpText = getCostHelpText(
                        component.label,
                        language,
                        originConfig,
                      )
                      return (
                        <div
                          key={`${selectedEstimate.id}-${component.label}`}
                          className="rounded-xl border bg-card/80 p-3 motion-pop sm:p-4"
                        >
                          <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
                            <span>{tr(component.label)}</span>
                            {helpText ? (
                              <BooksHelpTooltip text={helpText} />
                            ) : editable ? (
                              <Badge
                                variant="outline"
                                className="rounded-full text-[10px]"
                              >
                                {t.livingCosts}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="mt-2 text-lg font-semibold">
                            {formatUsd(amount)}
                          </div>
                        </div>
                      )
                    })}
                    <div className="rounded-xl border bg-card/80 p-3 motion-pop sm:p-4">
                      <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
                        <span>{t.visaCosts}</span>
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px]"
                        >
                          {t.fixedCosts}
                        </Badge>
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        {formatUsd(visaCosts)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {selectedVisa.label}
                      </div>
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
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {tr(selectedEstimate.methodologyNote)}
                  </p>
                  {selectedEstimate.optionalNotes?.length ? (
                    <div className="mt-3 space-y-2">
                      {selectedEstimate.optionalNotes.map((note) => (
                        <div
                          key={note}
                          className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
                        >
                          {tr(note)}
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
                      <Badge
                        key={university}
                        variant="outline"
                        className="rounded-full bg-card"
                      >
                        {tr(university)}
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
                          {tr(cost.label)}
                          {isBooksComponent(cost.label) ? (
                            <HelpCircle
                              className="h-3.5 w-3.5 text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tr(cost.description)}
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
                        <span>{tr(source.label)}</span>
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
