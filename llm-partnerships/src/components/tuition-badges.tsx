import { Badge } from "@/components/ui/badge"
import type { TuitionCategory } from "@/lib/types"
import { cleanText, type UiLanguage } from "@/lib/text-utils"

const labels: Record<UiLanguage, Record<string, string>> = {
  fr: {
    "sans frais": "Sans frais",
    "frais réduits": "Frais réduits",
    "frais complets": "Frais complets",
    "bourse possible": "Bourse possible"
  },
  en: {
    "sans frais": "No tuition",
    "frais réduits": "Reduced tuition",
    "frais complets": "Full tuition",
    "bourse possible": "Scholarship possible"
  },
  es: {
    "sans frais": "Sin matrícula",
    "frais réduits": "Matrícula reducida",
    "frais complets": "Matrícula completa",
    "bourse possible": "Beca posible"
  },
  de: {
    "sans frais": "Kein Unterricht",
    "frais réduits": "Reduzierte Studiengebühren",
    "frais complets": "Voller Unterricht",
    "bourse possible": "Stipendium möglich"
  },
  it: {
    "sans frais": "Senza tasse universitarie",
    "frais réduits": "Tasse universitarie ridotte",
    "frais complets": "Tasse universitarie complete",
    "bourse possible": "Borsa di studio possibile"
  },
}

export function TuitionBadges({
  tuitionCategory,
  language = "fr"
}: {
  tuitionCategory?: TuitionCategory | string
  language?: UiLanguage
}) {
  const normalized = cleanText(tuitionCategory)
  if (!normalized || normalized === "Non communiqué") return null

  const label = labels[language][normalized] || normalized
  const variant =
    normalized === "sans frais"
      ? "default"
      : normalized === "frais réduits"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{label}</Badge>
}
