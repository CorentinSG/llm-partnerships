"use client"

import Link from "next/link"
import { ExternalLink, ShieldAlert } from "lucide-react"

import type { InternationalExchange } from "@/lib/exchanges"
import { ReliabilityBadge } from "@/components/reliability-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ExchangeCard({ item }: { item: InternationalExchange }) {
  const showStudentBadge = (item.sourceType || "").includes("student_shared_unofficial_document")
  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-rose-400/30 bg-rose-400/10 text-rose-200"
            >
              Pas un LL.M
            </Badge>
            <Badge variant="outline">Échange</Badge>
            <ReliabilityBadge status={item.reliabilityStatus as any} sourceType={item.sourceType} />
            {showStudentBadge ? (
              <Badge
                variant="outline"
                className="border-amber-400/30 bg-amber-400/10 text-amber-200"
              >
                À confirmer – source étudiante
              </Badge>
            ) : null}
          </div>
          <div className="text-lg font-semibold tracking-tight sm:text-xl">
            {item.frenchUniversity} → {item.partnerUniversity}
          </div>
          <div className="text-sm text-muted-foreground">
            {item.mobilityType} • {item.duration} • Niveau : {item.requiredLevel}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link href={`/exchanges/${encodeURIComponent(item.id)}`}>Détails</Link>
          </Button>
          {item.officialLink ? (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href={item.officialLink} target="_blank" rel="noreferrer">
                Source
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Résumé</div>
          <div className="mt-1 text-sm leading-relaxed">{item.shortDescription}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">Coût (estimation)</div>
          <div className="mt-1 text-sm leading-relaxed">
            {item.tuitionDisplay || "Non communiqué"}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Note : mobilité non diplômante, à distinguer d’un LL.M.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-400/20 p-1.5 text-amber-200">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Avertissement</div>
            <div className="text-sm text-muted-foreground">
              Ce programme n’est pas un LL.M et ne rend pas automatiquement éligible à un
              barreau américain.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
