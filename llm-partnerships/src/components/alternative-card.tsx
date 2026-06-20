"use client"

import Link from "next/link"
import { ExternalLink, ShieldAlert } from "lucide-react"

import type { AlternativeItem } from "@/lib/alternatives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AlternativeCard({ item }: { item: AlternativeItem }) {
  return (
    <div className="glass-panel interactive-lift rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Parcours alternatif</Badge>
            <Badge variant="secondary">Alternative common law route</Badge>
            <Badge variant="muted">Not a U.S. LL.M.</Badge>
          </div>
          <div className="text-lg font-semibold tracking-tight sm:text-xl">
            {item.programName}
          </div>
          <div className="text-sm text-muted-foreground">
            {item.institution} — {item.faculty} • {item.city}, {item.country}
          </div>
        </div>

        {item.officialLink ? (
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="h-10 shrink-0 sm:h-9"
          >
            <Link href={item.officialLink} target="_blank" rel="noreferrer">
              Source officielle
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Résumé
          </div>
          <div className="mt-1 text-sm leading-relaxed">
            {item.shortDescription}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Pourquoi c’est pertinent
          </div>
          <div className="mt-1 text-sm leading-relaxed">{item.whyRelevant}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Format
          </div>
          <div className="mt-1 text-sm">
            {item.programType} • {item.credits}
          </div>
        </div>
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Langue
          </div>
          <div className="mt-1 text-sm">{item.language}</div>
        </div>
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Rythme
          </div>
          <div className="mt-1 text-sm">{item.studyMode.join(" • ")}</div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-500/15 p-1.5 text-amber-800 dark:text-amber-200">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Avertissement (barreau)</div>
            <div className="text-sm text-muted-foreground">
              {item.barEligibilityWarning}
            </div>
            <div className="text-xs text-muted-foreground/80">
              {item.displayWarning}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-sm font-medium">
            Conditions d’admission (extrait)
          </div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{item.admissionConditions.degreeRequirement}</li>
            <li>{item.admissionConditions.minimumAverage}</li>
            <li>{item.admissionConditions.languageRequirement}</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-sm font-medium">
            Frais (estimations officielles)
          </div>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground/80">
                Étudiants FR/BE francophones :
              </span>{" "}
              {item.tuition.frenchOrBelgianFrancophoneStudents}
            </div>
            <div>
              <span className="font-medium text-foreground/80">
                Internationaux :
              </span>{" "}
              {item.tuition.internationalStudents}
            </div>
            <div className="text-xs text-muted-foreground/80">
              {item.tuition.note}
            </div>
          </div>
        </div>
      </div>

      {item.missingInformation?.length ? (
        <div className="mt-5 rounded-xl border bg-secondary/45 p-4">
          <div className="text-sm font-medium">À compléter</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {item.missingInformation.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
