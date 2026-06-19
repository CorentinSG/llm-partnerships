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

export function PartnershipCard({ partnership }: { partnership: Partnership }) {
  const showStudentSourceBadge = (partnership.sourceType || "").includes(
    "student_shared_unofficial_document"
  )

  const tests =
    partnership.languageTests?.length > 0
      ? partnership.languageTests
          .map((t) => (t.test === "Non communiqué" ? "Non communiqué" : t.test))
          .filter(Boolean)
      : []

  const testsBadges = tests
    .filter((t) => t !== "Non communiqué")
    .slice(0, 2)
    .map((t) => (
      <span
        key={t}
        className="rounded-full border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
      >
        {t}
      </span>
    ))

  return (
    <Card className="group">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ReliabilityBadge
            status={partnership.reliabilityStatus}
            sourceType={partnership.sourceType}
          />
          {showStudentSourceBadge ? (
            <Badge
              variant="outline"
              className="border-amber-500/35 bg-amber-500/12 text-amber-800 dark:text-amber-200"
            >
              À confirmer - source étudiante non officielle
            </Badge>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <TuitionBadges tuitionCategory={partnership.tuitionCategory} />
            {testsBadges}
          </div>
        </div>
        <CardTitle className="text-[16px] leading-snug tracking-tight transition-colors group-hover:text-primary">
          {partnership.frenchUniversity} ↔ {partnership.partnerUniversity}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {partnership.partnerCountry}
          {partnership.partnerCity ? ` (${partnership.partnerCity})` : ""} ·{" "}
          {partnership.continent} · {partnership.programType}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {partnership.shortDescription}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>Niveau : {String(partnership.requiredLevel)}</span>
          <span aria-hidden="true">·</span>
          <span>
            Places :{" "}
            {partnership.availableSeatsDisplay
              ? partnership.availableSeatsDisplay
              : String(partnership.availableSeats)}
          </span>
          <span aria-hidden="true">·</span>
          <span>Langue : {partnership.programLanguage}</span>
          <span aria-hidden="true">·</span>
          <span>
            Candidature :{" "}
            {partnership.applicationProcess === "internal"
              ? "Interne"
              : partnership.applicationProcess === "lsac"
                ? "LSAC"
                : "Non communiqué"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <PartnershipDialog partnership={partnership}>
            <Button variant="secondary" size="sm">
              <Info className="mr-2 h-4 w-4" aria-hidden="true" />
              Détails
            </Button>
          </PartnershipDialog>
          <Button asChild variant="outline" size="sm">
            <Link href={`/partnership/${partnership.id}`}>Ouvrir</Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {partnership.attachments && partnership.attachments.length > 0 ? (
            <Button asChild variant="ghost" size="sm">
              <a
                href={partnership.attachments[0].url}
                target="_blank"
                rel="noreferrer"
                title={partnership.attachments[0].label}
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
                Source
              </a>
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  )
}
