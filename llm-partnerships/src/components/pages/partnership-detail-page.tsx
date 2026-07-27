"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"
import { PartnershipDetails } from "@/components/partnership-details"
import { Button } from "@/components/ui/button"
import type { Partnership } from "@/lib/types"
import { translateDataText } from "@/lib/text-utils"

const copy = {
  fr: { back: "Retour à la recherche" },
  en: { back: "Back to search" },
  es: { back: "Volver a la búsqueda" },
  de: { back: "Zurück zur Suche" },
} as const

export function PartnershipDetailPage({
  partnership,
  origin = "france",
}: {
  partnership: Partnership
  origin?: "france" | "germany"
}) {
  const { language } = useLanguage()
  const t = copy[language]
  const backHref = origin === "germany" ? "/germany" : "/"

  return (
    <PageShell
      title={translateDataText(partnership.partnerUniversity, language)}
      description={`${translateDataText(
        partnership.frenchUniversity,
        language,
      )} • ${translateDataText(partnership.partnerCountry, language)}`}
      actions={
        <Button asChild variant="secondary">
          <Link href={backHref}>{t.back}</Link>
        </Button>
      }
    >
      <PartnershipDetails partnership={partnership} />
    </PageShell>
  )
}
