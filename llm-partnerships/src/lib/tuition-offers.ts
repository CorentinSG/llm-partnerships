import type { Partnership } from "@/lib/types"
import { cleanText, type UiLanguage } from "@/lib/text-utils"
import { formatUsd } from "@/lib/us-cost-estimates"

export type OfferOption = {
  id: string
  label: string
  tuitionUsd: number
  note?: string
}

const copy = {
  fr: {
    noOffer: "Tarif public",
    savings: "Économie sur la tuition",
    freeSeat: "Place sans frais de scolarité partenaire",
    reducedSeat: "Place à frais réduits",
    scholarshipSeat: "Bourse ou remise possible",
    percentSeat: "Remise de {percent}%",
    referenceAmount: "montant indiqué",
    publicRate: "Prix public normal",
    partnerRate: "Prix après partenariat",
    scenario: "Scénario — {label}",
  },
  en: {
    noOffer: "Public rate",
    savings: "Tuition savings",
    freeSeat: "Partner tuition-free seat",
    reducedSeat: "Reduced tuition seat",
    scholarshipSeat: "Scholarship or discount possible",
    percentSeat: "{percent}% discount",
    referenceAmount: "published amount",
    publicRate: "Normal public price",
    partnerRate: "Price after partnership",
    scenario: "Scenario — {label}",
  },
  es: {
    noOffer: "Tarifa pública",
    savings: "Ahorro en matrícula",
    freeSeat: "Plaza sin matrícula de la universidad asociada",
    reducedSeat: "Plaza con matrícula reducida",
    scholarshipSeat: "Beca o reducción posible",
    percentSeat: "Reducción de {percent}%",
    referenceAmount: "importe indicado",
    publicRate: "Precio público normal",
    partnerRate: "Precio tras convenio",
    scenario: "Escenario — {label}",
  },
  de: {
    noOffer: "Öffentlicher Tarif",
    savings: "Studiengebührenersparnis",
    freeSeat: "Partnersitz ohne Unterrichtsgebühren",
    reducedSeat: "Reduzierter Studienplatz",
    scholarshipSeat: "Stipendium oder Rabatt möglich",
    percentSeat: "{percent} % Rabatt",
    referenceAmount: "veröffentlichter Betrag",
    publicRate: "Normaler öffentlicher Preis",
    partnerRate: "Preis nach Partnerschaft",
    scenario: "Szenario – {label}",
  },
  it: {
    noOffer: "Tariffa pubblica",
    savings: "Risparmio sulle tasse universitarie",
    freeSeat: "Posto senza tasse universitarie presso il partner",
    reducedSeat: "Posto con tasse universitarie ridotte",
    scholarshipSeat: "Borsa di studio o sconto possibile",
    percentSeat: "Sconto del {percent}%",
    referenceAmount: "importo pubblicato",
    publicRate: "Prezzo pubblico normale",
    partnerRate: "Prezzo dopo la partnership",
    scenario: "Scenario: {etichetta}",
  },
} as const

function parseDollarAmounts(text: string) {
  const amounts: number[] = []
  const matches = text.matchAll(
    /(?:\$|usd|dollars?)\s*([0-9][0-9\s.,]*)|([0-9][0-9\s.,]*)\s*(?:\$|usd|dollars?)/gi,
  )
  for (const match of matches) {
    const raw = match[1] || match[2]
    const value = Number(raw.replace(/[\s,]/g, ""))
    if (Number.isFinite(value) && value > 0) amounts.push(value)
  }
  return amounts
}

function getSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\s+[;•]\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function sentenceHasAny(sentence: string, keywords: string[]) {
  return keywords.some((keyword) => sentence.includes(keyword))
}

function parseDiscountAmounts(text: string, normalTuition: number) {
  const discountKeywords = [
    "bourse",
    "scholarship",
    "remise",
    "discount",
    "reduction",
    "réduction",
    "reduit",
    "réduit",
  ]
  const excludedKeywords = [
    "assurance",
    "insurance",
    "livres",
    "books",
    "manual",
    "manuels",
    "acceptation",
    "application",
    "dossier",
    "fee",
    "frais de 250",
    "frais apres acceptation",
    "frais après acceptation",
  ]

  return Array.from(
    new Set(
      getSentences(text)
        .filter((sentence) => sentenceHasAny(sentence, discountKeywords))
        .filter((sentence) => !sentenceHasAny(sentence, excludedKeywords))
        .flatMap(parseDollarAmounts)
        .filter((amount) => amount > 0 && amount < normalTuition),
    ),
  )
}

function parsePartnerTuitionAmounts(text: string, normalTuition: number) {
  const priceKeywords = [
    "prix",
    "cout",
    "coût",
    "tuition",
    "scolarite",
    "scolarité",
    "frais reduits",
    "frais réduits",
    "a verser",
    "à verser",
    "payant",
    "tarif",
  ]
  const excludedKeywords = [
    "bourse",
    "scholarship",
    "remise",
    "discount",
    "assurance",
    "insurance",
    "livres",
    "books",
    "acceptation",
    "application",
    "dossier",
    "lsac",
  ]

  return Array.from(
    new Set(
      getSentences(text)
        .filter((sentence) => sentenceHasAny(sentence, priceKeywords))
        .filter((sentence) => !sentenceHasAny(sentence, excludedKeywords))
        .flatMap(parseDollarAmounts)
        .filter((amount) => amount > 0 && amount < normalTuition),
    ),
  )
}

function parsePercent(text: string) {
  const match = text.match(/(\d{1,3})\s*%/)
  if (!match) return undefined
  return Math.min(Math.max(Number(match[1]), 0), 100)
}

function isExchangeOnly(partnership: Partnership) {
  const programType = cleanText(partnership.programType).toLowerCase()
  return (
    partnership.tuitionBenefitScope === "exchange_only" ||
    programType.includes("échange créditable") ||
    programType.includes("creditable exchange") ||
    programType.includes("intercambio con créditos")
  )
}

export function inferOfferOptions(
  partnership: Partnership | undefined,
  normalTuition: number,
  language: UiLanguage,
) {
  const t = copy[language]
  const options: OfferOption[] = [
    {
      id: "public",
      label: t.noOffer,
      tuitionUsd: normalTuition,
      note: t.publicRate,
    },
  ]

  if (!partnership || isExchangeOnly(partnership)) return options

  const scenario = (label: string) => t.scenario.replace("{label}", label)
  const category = cleanText(partnership.tuitionCategory).toLowerCase()
  const text = cleanText(
    [
      partnership.availableSeatsDisplay,
      partnership.tuitionDisplay,
      partnership.financialAid,
      partnership.shortDescription,
      partnership.notes,
    ].join(" "),
  )
  const lower = text.toLowerCase()
  const partnerTuitionAmounts = parsePartnerTuitionAmounts(
    lower,
    normalTuition,
  )
  const discountAmounts = parseDiscountAmounts(lower, normalTuition)
  const percent = parsePercent(lower)

  if (
    category === "sans frais" ||
    lower.includes("sans frais") ||
    lower.includes("full scholarship")
  ) {
    options.push({
      id: "free",
      label: scenario(t.freeSeat),
      tuitionUsd: 0,
      note: cleanText(
        partnership.availableSeatsDisplay || partnership.tuitionDisplay,
      ),
    })
  }

  if (percent && percent > 0 && percent < 100) {
    options.push({
      id: `percent-${percent}`,
      label: scenario(t.percentSeat.replace("{percent}", String(percent))),
      tuitionUsd: Math.round(normalTuition * (1 - percent / 100)),
      note: cleanText(partnership.financialAid || partnership.tuitionDisplay),
    })
  }

  partnerTuitionAmounts
    .sort((a, b) => a - b)
    .slice(0, 3)
    .forEach((amount, index) => {
      options.push({
        id: `amount-${index}-${amount}`,
        label: scenario(
          category.includes("bourse") ? t.scholarshipSeat : t.reducedSeat,
        ),
        tuitionUsd: Math.round(amount),
        note: `${formatUsd(amount)} ${t.referenceAmount}`,
      })
    })

  discountAmounts
    .sort((a, b) => b - a)
    .slice(0, 3)
    .forEach((amount, index) => {
      options.push({
        id: `discount-${index}-${amount}`,
        label: scenario(t.scholarshipSeat),
        tuitionUsd: Math.max(0, Math.round(normalTuition - amount)),
        note: `${formatUsd(amount)} ${t.savings.toLowerCase()}`,
      })
    })

  if (
    options.length === 1 &&
    (category.includes("réduits") ||
      category.includes("reduit") ||
      category.includes("bourse"))
  ) {
    const fallbackPercent = category.includes("bourse") ? 25 : 50
    options.push({
      id: `fallback-${fallbackPercent}`,
      label: scenario(
        category.includes("bourse") ? t.scholarshipSeat : t.reducedSeat,
      ),
      tuitionUsd: Math.round(normalTuition * (1 - fallbackPercent / 100)),
      note: t.partnerRate,
    })
  }

  return options.filter(
    (option, index, all) =>
      all.findIndex(
        (item) =>
          item.tuitionUsd === option.tuitionUsd && item.label === option.label,
      ) === index,
  )
}
