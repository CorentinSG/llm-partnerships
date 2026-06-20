"use client"

import * as React from "react"
import { Calculator, CircleDollarSign, ExternalLink, House, Info, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Partnership } from "@/lib/types"
import {
  formatUsd,
  getAllCostEstimates,
  getCostEstimatesMeta,
  getEstimateSummary,
  getEstimatesForDisplayCity,
  getPartnershipsInEstimateCity,
  getDisplayCities
} from "@/lib/us-cost-estimates"

export function CostSimulator({ partnerships }: { partnerships: Partnership[] }) {
  const meta = React.useMemo(() => getCostEstimatesMeta(), [])
  const allEstimates = React.useMemo(() => getAllCostEstimates(), [])
  const cities = React.useMemo(() => getDisplayCities(), [])

  const [selectedCity, setSelectedCity] = React.useState(cities[0] ?? "")
  const cityEstimates = React.useMemo(
    () => getEstimatesForDisplayCity(selectedCity),
    [selectedCity]
  )
  const [selectedEstimateId, setSelectedEstimateId] = React.useState(
    cityEstimates[0]?.id ?? ""
  )

  React.useEffect(() => {
    if (!cityEstimates.some((estimate) => estimate.id === selectedEstimateId)) {
      setSelectedEstimateId(cityEstimates[0]?.id ?? "")
    }
  }, [cityEstimates, selectedEstimateId])

  const selectedEstimate =
    cityEstimates.find((estimate) => estimate.id === selectedEstimateId) ||
    cityEstimates[0] ||
    allEstimates[0]

  if (!selectedEstimate) return null

  const summary = getEstimateSummary(selectedEstimate)
  const partnershipsInCity = getPartnershipsInEstimateCity(partnerships, selectedEstimate)
  const uniqueUniversitiesInCity = Array.from(
    new Set(partnershipsInCity.map((partnership) => partnership.partnerUniversity))
  ).sort((a, b) => a.localeCompare(b))

  return (
    <section className="budget-section py-10 sm:py-14">
      <div className="container">
        <Card className="overflow-hidden rounded-2xl border-primary/10">
          <CardHeader className="space-y-5 p-4 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <Badge className="w-fit rounded-full bg-primary/12 px-3 py-1 text-primary shadow-none">
                Budget séparé
              </Badge>
              <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                Coût total estimatif d’un LL.M. aux États-Unis
              </CardTitle>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                Cette section détaille les autres coûts à prévoir au-delà des seuls
                frais d’inscription : logement, nourriture, assurance santé,
                transport, livres et dépenses de vie. Les chiffres ci-dessous sont
                des estimations basées sur des sources officielles.
              </p>
            </div>

            <div className="grid w-full gap-3 rounded-2xl border bg-secondary/45 p-3 sm:max-w-[420px] sm:p-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Ville partenaire
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-11" aria-label="Choisir une ville américaine">
                    <SelectValue placeholder="Choisir une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  École de référence
                </label>
                <Select value={selectedEstimate.id} onValueChange={setSelectedEstimateId}>
                  <SelectTrigger className="h-11" aria-label="Choisir une école de référence">
                    <SelectValue placeholder="Choisir une école" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityEstimates.map((estimate) => (
                      <SelectItem key={estimate.id} value={estimate.id}>
                        {estimate.referenceSchool}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
              <div className="text-xs text-muted-foreground">Frais d’inscription estimés</div>
              <div className="mt-2 text-2xl font-semibold">{formatUsd(summary.tuitionUsd)}</div>
            </div>
            <div className="rounded-xl border bg-card/80 p-4 sm:rounded-2xl">
              <div className="text-xs text-muted-foreground">Autres coûts estimés</div>
              <div className="mt-2 text-2xl font-semibold">{formatUsd(summary.otherCostsUsd)}</div>
            </div>
            <div className="rounded-xl border border-primary/15 bg-primary/10 p-4 sm:rounded-2xl">
              <div className="text-xs text-muted-foreground">Coût total estimatif</div>
              <div className="mt-2 text-2xl font-semibold">{formatUsd(summary.totalUsd)}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-4 pt-0 sm:space-y-6 sm:p-8 sm:pt-0">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  Détail des postes de coût
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                  {selectedEstimate.components.map((component) => (
                    <div
                      key={`${selectedEstimate.id}-${component.label}`}
                      className="rounded-xl border bg-card/80 p-3 motion-pop sm:p-4"
                    >
                      <div className="text-xs text-muted-foreground">{component.label}</div>
                      <div className="mt-2 text-lg font-semibold">
                        {formatUsd(component.amountUsd)}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {component.kind === "tuition" ? "Tuition" : "Hors tuition"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Méthodologie
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {selectedEstimate.methodologyNote}
                </p>
                {selectedEstimate.optionalNotes?.length ? (
                  <div className="mt-3 space-y-2">
                    {selectedEstimate.optionalNotes.map((note) => (
                      <div
                        key={note}
                        className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Ville et partenaires concernés
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{selectedEstimate.displayCity}</span>
                  {" "}• référence : {selectedEstimate.referenceSchool}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {uniqueUniversitiesInCity.map((university) => (
                    <Badge
                      key={university}
                      variant="outline"
                      className="rounded-full bg-card"
                    >
                      {university}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <House className="h-4 w-4 text-muted-foreground" />
                  Autres coûts à prévoir
                </div>
                <div className="mt-4 space-y-3">
                  {meta.commonCosts.map((cost) => (
                    <div key={cost.label}>
                      <div className="text-sm font-medium">{cost.label}</div>
                      <div className="text-sm text-muted-foreground">{cost.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-secondary/45 p-4 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  Sources officielles
                </div>
                <div className="mt-4 space-y-3">
                  {selectedEstimate.sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start justify-between gap-3 rounded-xl border bg-card/80 px-4 py-3 text-sm transition-colors hover:bg-card"
                    >
                      <span>{source.label}</span>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="rounded-xl border bg-secondary/45 px-4 py-4 text-sm leading-7 text-muted-foreground sm:rounded-2xl sm:px-5">
            {meta.disclaimer}
          </div>
        </CardContent>
      </Card>
      </div>
    </section>
  )
}
