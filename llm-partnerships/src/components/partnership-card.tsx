"use client"

import Link from "next/link"
import { ExternalLink, FileText, Info } from "lucide-react"

import { PartnershipDialog } from "@/components/partnership-dialog"
import { ReliabilityBadge } from "@/components/reliability-badge"
import { TuitionBadges } from "@/components/tuition-badges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Partnership } from "@/lib/types"
import { cleanText, type UiLanguage } from "@/lib/text-utils"

const copy = {
  fr: {
    level: "Niveau",
    seats: "Places",
    language: "Langue",
    application: "Candidature",
    details: "Détails",
    open: "Ouvrir",
    source: "Source",
    notShared: "Non communiqué",
    studentSource: "À confirmer - source étudiante non officielle",
    internal: "Interne"
  },
  en: {
    level: "Level",
    seats: "Seats",
    language: "Language",
    application: "Application",
    details: "Details",
    open: "Open",
    source: "Source",
    notShared: "Not disclosed",
    studentSource: "To confirm - unofficial student source",
    internal: "Internal"
  },
  es: {
    level: "Nivel",
    seats: "Plazas",
    language: "Idioma",
    application: "Solicitud",
    details: "Detalles",
    open: "Abrir",
    source: "Fuente",
    notShared: "No comunicado",
    studentSource: "Por confirmar - fuente estudiantil no oficial",
    internal: "Interna"
  }
} as const

export function PartnershipCard({
  partnership,
  language = "fr"
}: {
  partnership: Partnership
  language?: UiLanguage
}) {
  const t = copy[language]
  const showStudentSourceBadge = (partnership.sourceType || "").includes(
    "student_shared_unofficial_document"
  )

  const tests =
    partnership.languageTests?.length > 0
      ? partnership.languageTests
          .map((test) => cleanText(test.test))
          .filter((test) => test && test !== "Non communiqué")
      : []

  const testsBadges = tests.slice(0, 2).map((test) => (
    <span
      key={test}
      className="rounded-full border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
    >
      {test}
    </span>
  ))

  const applicationProcess =
    partnership.applicationProcess === "internal"
      ? t.internal
      : partnership.applicationProcess === "lsac"
        ? "LSAC"
        : t.notShared

  return (
    <Card className="group result-card interactive-lift">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
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
          <div className="flex flex-wrap gap-2">
            <TuitionBadges
              tuitionCategory={partnership.tuitionCategory}
              language={language}
            />
            {testsBadges}
          </div>
        </div>
        <CardTitle className="text-[16px] leading-snug tracking-tight transition-colors group-hover:text-primary">
          {cleanText(partnership.frenchUniversity)} {"\u2194"}{" "}
          {cleanText(partnership.partnerUniversity)}
        </CardTitle>
        <div className="font-mono-ui text-[11px] text-muted-foreground">
          {cleanText(partnership.partnerCountry)}
          {partnership.partnerCity ? ` (${cleanText(partnership.partnerCity)})` : ""} ·{" "}
          {cleanText(partnership.continent)} · {cleanText(partnership.programType)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {cleanText(partnership.shortDescription)}
        </p>
        <div className="soft-divider" />
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <span className="rounded-lg bg-secondary/55 px-2.5 py-2">
            {t.level} :{" "}
            <span className="text-foreground">{cleanText(partnership.requiredLevel)}</span>
          </span>
          <span className="rounded-lg bg-secondary/55 px-2.5 py-2">
            {t.seats} :{" "}
            <span className="text-foreground">
              {partnership.availableSeatsDisplay
                ? cleanText(partnership.availableSeatsDisplay)
                : cleanText(partnership.availableSeats)}
            </span>
          </span>
          <span className="rounded-lg bg-secondary/55 px-2.5 py-2">
            {t.language} :{" "}
            <span className="text-foreground">{cleanText(partnership.programLanguage)}</span>
          </span>
          <span className="rounded-lg bg-secondary/55 px-2.5 py-2">
            {t.application} : <span className="text-foreground">{applicationProcess}</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <PartnershipDialog partnership={partnership}>
            <Button variant="secondary" size="sm">
              <Info className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.details}
            </Button>
          </PartnershipDialog>
          <Button asChild variant="outline" size="sm">
            <Link href={`/partnership/${partnership.id}`}>{t.open}</Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {partnership.attachments && partnership.attachments.length > 0 ? (
            <Button asChild variant="ghost" size="sm">
              <a
                href={partnership.attachments[0].url}
                target="_blank"
                rel="noreferrer"
                title={cleanText(partnership.attachments[0].label)}
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                PDF
              </a>
            </Button>
          ) : null}
          {partnership.officialLink ? (
            <Button asChild variant="ghost" size="sm">
              <a href={partnership.officialLink} target="_blank" rel="noreferrer">
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
