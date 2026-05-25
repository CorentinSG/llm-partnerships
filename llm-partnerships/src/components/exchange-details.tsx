"use client"

import Link from "next/link"
import { ExternalLink, ShieldAlert } from "lucide-react"

import type { InternationalExchange } from "@/lib/exchanges"
import { PageShell } from "@/components/page-shell"
import { ReliabilityBadge } from "@/components/reliability-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ExchangeDetails({ item }: { item: InternationalExchange }) {
  return (
    <PageShell
      title={`${item.frenchUniversity} → ${item.partnerUniversity}`}
      description={item.mobilityType}
    >
      <div className="space-y-4">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-rose-400/30 bg-rose-400/10 text-rose-200"
                >
                  Ce programme n’est pas un LL.M
                </Badge>
                <ReliabilityBadge
                  status={item.reliabilityStatus as any}
                  sourceType={item.sourceType}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {item.frenchFaculty} • {item.frenchProgram || "Non communiqué"}
              </div>
              <div className="text-sm text-muted-foreground">
                Partenaire : {item.partnerUniversity} • {item.partnerProgram || "Non communiqué"} •{" "}
                {item.partnerCity}, {item.partnerCountry}
              </div>
            </div>

            {item.officialLink ? (
              <Button asChild variant="secondary" size="sm">
                <Link href={item.officialLink} target="_blank" rel="noreferrer">
                  Source officielle
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-400/20 p-1.5 text-amber-200">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Avertissement</div>
              <div className="text-sm text-muted-foreground">
                {item.barEligibilityWarning ||
                  "Attention : ce programme n’est pas un LL.M américain. Il s’agit d’une mobilité académique permettant de suivre des cours dans une université américaine. Il ne doit pas être confondu avec un LL.M et ne rend pas automatiquement éligible à un barreau américain."}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-panel rounded-3xl p-6">
            <div className="text-sm font-medium">Informations clés</div>
            <dl className="mt-3 grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Durée</dt>
                <dd className="font-medium">{item.duration}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Semestre</dt>
                <dd className="font-medium">{item.semester || "Non communiqué"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Niveau requis</dt>
                <dd className="font-medium">{item.requiredLevel}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Diplômant</dt>
                <dd className="font-medium">{item.isDegreeGranting ? "Oui" : "Non"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Langue</dt>
                <dd className="font-medium">{item.programLanguage}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Coût (estimé)</dt>
                <dd className="font-medium">{item.tuitionDisplay || "Non communiqué"}</dd>
              </div>
            </dl>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className="text-sm font-medium">Description</div>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>{item.shortDescription}</p>
              {item.importantClarification ? (
                <p className="text-foreground/80">{item.importantClarification}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-panel rounded-3xl p-6">
            <div className="text-sm font-medium">Admission & sélection</div>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground/80">Conditions :</span>{" "}
                {item.admissionConditions}
              </p>
              <p>
                <span className="font-medium text-foreground/80">Processus :</span>{" "}
                {item.selectionProcess || "Non communiqué"}
              </p>
              <p>
                <span className="font-medium text-foreground/80">Aide :</span>{" "}
                {item.financialAid || "Non communiqué"}
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className="text-sm font-medium">Informations manquantes</div>
            {item.missingInformation?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {item.missingInformation.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">Aucune.</div>
            )}
          </div>
        </div>

        {item.notes ? (
          <div className="glass-panel rounded-3xl p-6">
            <div className="text-sm font-medium">Remarques</div>
            <div className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.notes}</div>
          </div>
        ) : null}
      </div>
    </PageShell>
  )
}
