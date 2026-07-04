"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"
import { PartnershipDetails } from "@/components/partnership-details"
import { Button } from "@/components/ui/button"
import type { Partnership } from "@/lib/types"

const copy = {
  fr: { back: "Retour à la recherche" },
  en: { back: "Back to search" },
  es: { back: "Volver a la búsqueda" },
} as const

export function PartnershipDetailPage({
  partnership,
}: {
  partnership: Partnership
}) {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <PageShell
      title={partnership.partnerUniversity}
      description={`${partnership.frenchUniversity} • ${partnership.partnerCountry}`}
      actions={
        <Button asChild variant="secondary">
          <Link href="/">{t.back}</Link>
        </Button>
      }
    >
      <PartnershipDetails partnership={partnership} />
    </PageShell>
  )
}
