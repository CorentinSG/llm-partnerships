"use client"

import Link from "next/link"
import { ExternalLink, FileText, Info } from "lucide-react"

import { PartnershipDialog } from "@/components/partnership-dialog"
import { ReliabilityBadge } from "@/components/reliability-badge"
import { TuitionBadges } from "@/components/tuition-badges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Partnership } from "@/lib/types"
import { cleanText, translateDataText, type UiLanguage } from "@/lib/text-utils"

const copy = {
  fr: {
    fees: "Frais",
    details: "Détails",
    open: "Ouvrir",
    source: "Source",
    notShared: "Non communiqué",
    studentSource: "À confirmer - source étudiante non officielle",
  },
  en: {
    fees: "Fees",
    details: "Details",
    open: "Open",
    source: "Source",
    notShared: "Not disclosed",
    studentSource: "To confirm - unofficial student source",
  },
  es: {
    fees: "Coste",
    details: "Detalles",
    open: "Abrir",
    source: "Fuente",
    notShared: "No comunicado",
    studentSource: "Por confirmar - fuente estudiantil no oficial",
  },
  de: {
    fees: "Gebühren",
    details: "Einzelheiten",
    open: "Offen",
    source: "Quelle",
    notShared: "Nicht bekannt gegeben",
    studentSource: "Zur Bestätigung: inoffizielle Studentenquelle",
  },
  it: {
    fees: "Commissioni",
    details: "Dettagli",
    open: "Aprire",
    source: "Fonte",
    notShared: "Non divulgato",
    studentSource: "Da confermare - fonte studentesca non ufficiale",
  },
} as const

export function PartnershipCard({
  partnership,
  language = "fr",
}: {
  partnership: Partnership
  language?: UiLanguage
}) {
  const t = copy[language]
  const showStudentSourceBadge = (partnership.sourceType || "").includes(
    "student_shared_unofficial_document",
  )
  const feeText = translateDataText(
    partnership.tuitionDisplay || partnership.tuition || t.notShared,
    language,
  )

  return (
    <Card className="group result-card interactive-lift">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <TuitionBadges
            tuitionCategory={partnership.tuitionCategory}
            language={language}
          />
          <ReliabilityBadge
            status={partnership.reliabilityStatus}
            sourceType={partnership.sourceType}
            language={language}
          />
          {showStudentSourceBadge ? (
            <Badge
              variant="outline"
              className="border-amber-500/35 bg-amber-500/12 text-amber-900 dark:text-amber-100"
            >
              {t.studentSource}
            </Badge>
          ) : null}
        </div>

        <CardTitle className="text-[16px] leading-snug tracking-tight transition-colors group-hover:text-primary">
          {translateDataText(partnership.frenchUniversity, language)}{" "}
          {"\u2194"}{" "}
          {translateDataText(partnership.partnerUniversity, language)}
        </CardTitle>

        <div className="font-mono-ui text-[11px] text-muted-foreground">
          {translateDataText(partnership.partnerCountry, language)}
          {partnership.partnerCity
            ? ` (${translateDataText(partnership.partnerCity, language)})`
            : ""}{" "}
          · {translateDataText(partnership.programType, language)}
        </div>

        <div className="text-xs leading-5 text-muted-foreground">
          <span className="font-medium text-foreground">{t.fees} : </span>
          <span className="line-clamp-1 align-bottom">{feeText}</span>
        </div>
      </CardHeader>

      <CardContent className="hidden" />

      <CardFooter className="flex flex-col items-stretch justify-between gap-3 pt-2 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <PartnershipDialog partnership={partnership}>
            <Button variant="secondary" size="sm" className="h-10 sm:h-9">
              <Info className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.details}
            </Button>
          </PartnershipDialog>
          <Button asChild variant="outline" size="sm" className="h-10 sm:h-9">
            <Link href={`/partnership/${partnership.id}`}>{t.open}</Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {partnership.attachments && partnership.attachments.length > 0 ? (
            <Button asChild variant="ghost" size="sm" className="h-10 sm:h-9">
              <a
                href={partnership.attachments[0].url}
                target="_blank"
                rel="noreferrer"
                title={translateDataText(
                  partnership.attachments[0].label,
                  language,
                )}
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                PDF
              </a>
            </Button>
          ) : null}
          {partnership.officialLink ? (
            <Button asChild variant="ghost" size="sm" className="h-10 sm:h-9">
              <a
                href={partnership.officialLink}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                {t.source}
              </a>
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  )
}
