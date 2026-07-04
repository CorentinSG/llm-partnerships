"use client"

import Link from "next/link"
import { ExternalLink, ShieldAlert } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import type { AlternativeItem } from "@/lib/alternatives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { translateDataText } from "@/lib/text-utils"

const copy = {
  fr: {
    route: "Parcours alternatif",
    source: "Source officielle",
    summary: "Résumé",
    relevance: "Pourquoi c’est pertinent",
    format: "Format",
    language: "Langue",
    pace: "Rythme",
    warning: "Avertissement (barreau)",
    admission: "Conditions d’admission (extrait)",
    fees: "Frais (estimations officielles)",
    francophone: "Étudiants FR/BE francophones :",
    international: "Internationaux :",
    missing: "À compléter",
  },
  en: {
    route: "Alternative route",
    source: "Official source",
    summary: "Summary",
    relevance: "Why it may be relevant",
    format: "Format",
    language: "Language",
    pace: "Study pace",
    warning: "Bar admission warning",
    admission: "Admission requirements (excerpt)",
    fees: "Fees (official estimates)",
    francophone: "French/Belgian French-speaking students:",
    international: "International students:",
    missing: "Missing information",
  },
  es: {
    route: "Vía alternativa",
    source: "Fuente oficial",
    summary: "Resumen",
    relevance: "Por qué puede ser relevante",
    format: "Formato",
    language: "Idioma",
    pace: "Ritmo",
    warning: "Aviso sobre admisión al colegio",
    admission: "Requisitos de admisión (extracto)",
    fees: "Costes (estimaciones oficiales)",
    francophone: "Estudiantes francófonos de Francia/Bélgica:",
    international: "Estudiantes internacionales:",
    missing: "Información pendiente",
  },
} as const

export function AlternativeCard({ item }: { item: AlternativeItem }) {
  const { language } = useLanguage()
  const t = copy[language]
  const tr = (value: unknown) => translateDataText(value, language)

  return (
    <div className="glass-panel interactive-lift rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{t.route}</Badge>
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
              {t.source}
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            {t.summary}
          </div>
          <div className="mt-1 text-sm leading-relaxed">
            {tr(item.shortDescription)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            {t.relevance}
          </div>
          <div className="mt-1 text-sm leading-relaxed">
            {tr(item.whyRelevant)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-xs font-medium text-muted-foreground">
            {t.format}
          </div>
          <div className="mt-1 text-sm">
            {tr(item.programType)} • {tr(item.credits)}
          </div>
        </div>
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-xs font-medium text-muted-foreground">
            {t.language}
          </div>
          <div className="mt-1 text-sm">{tr(item.language)}</div>
        </div>
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-xs font-medium text-muted-foreground">
            {t.pace}
          </div>
          <div className="mt-1 text-sm">
            {item.studyMode.map((mode) => tr(mode)).join(" • ")}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-500/15 p-1.5 text-amber-800 dark:text-amber-200">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">{t.warning}</div>
            <div className="text-sm text-muted-foreground">
              {tr(item.barEligibilityWarning)}
            </div>
            <div className="text-xs text-muted-foreground/80">
              {tr(item.displayWarning)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-sm font-medium">{t.admission}</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{tr(item.admissionConditions.degreeRequirement)}</li>
            <li>{tr(item.admissionConditions.minimumAverage)}</li>
            <li>{tr(item.admissionConditions.languageRequirement)}</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-secondary/45 p-4">
          <div className="text-sm font-medium">{t.fees}</div>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground/80">
                {t.francophone}
              </span>{" "}
              {tr(item.tuition.frenchOrBelgianFrancophoneStudents)}
            </div>
            <div>
              <span className="font-medium text-foreground/80">
                {t.international}
              </span>{" "}
              {tr(item.tuition.internationalStudents)}
            </div>
            <div className="text-xs text-muted-foreground/80">
              {tr(item.tuition.note)}
            </div>
          </div>
        </div>
      </div>

      {item.missingInformation?.length ? (
        <div className="mt-5 rounded-xl border bg-secondary/45 p-4">
          <div className="text-sm font-medium">{t.missing}</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {item.missingInformation.map((m) => (
              <li key={m}>{tr(m)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
