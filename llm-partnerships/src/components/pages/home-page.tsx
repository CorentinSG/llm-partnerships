"use client"

import * as React from "react"
import { Filter, Search } from "lucide-react"

import { FiltersPanel } from "@/components/filters/filters-panel"
import { FranceMap } from "@/components/france-map"
import { PartnershipCard } from "@/components/partnership-card"
import { StatsBar } from "@/components/stats-bar"
import { UsMap } from "@/components/us-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { emptyFilters, filterPartnerships, type FiltersState } from "@/lib/filters"
import { getAllPartnerships, getFilterOptions, getFrenchUniversitiesPoints } from "@/lib/data"

export function HomePage() {
  const all = React.useMemo(() => getAllPartnerships(), [])
  const options = React.useMemo(() => getFilterOptions(), [])
  const points = React.useMemo(() => getFrenchUniversitiesPoints(), [])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<FiltersState>(() => emptyFilters())
  const [mapMode, setMapMode] = React.useState<"fr" | "us">("fr")

  const filtered = React.useMemo(
    () => filterPartnerships(all, searchQuery, filters),
    [all, searchQuery, filters]
  )

  const activeCount =
    (filters.frenchUniversity ? 1 : 0) +
    (filters.partnerCountry ? 1 : 0) +
    (filters.continent ? 1 : 0) +
    (filters.partnerUniversity ? 1 : 0) +
    (filters.partnerState ? 1 : 0) +
    (filters.programType ? 1 : 0) +
    (filters.partnershipType ? 1 : 0) +
    (filters.requiredLevel ? 1 : 0) +
    (filters.programLanguage ? 1 : 0) +
    (filters.tuitionCategory ? 1 : 0) +
    (filters.availableSeats ? 1 : 0) +
    (filters.reliabilityStatus ? 1 : 0) +
    ((filters.specialties || []).length > 0 ? 1 : 0) +
    ((filters.languageTests || []).length > 0 ? 1 : 0)

  function resetAll() {
    setSearchQuery("")
    setFilters(emptyFilters())
  }

  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute -top-28 left-1/2 h-80 w-[980px] -translate-x-1/2 rounded-full bg-primary/14 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-80 w-[820px] -translate-x-1/2 rounded-full bg-accent/18 blur-3xl" />
        </div>

        <div className="container relative py-14 sm:py-16">
          <div className="max-w-4xl space-y-5">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-6xl leading-[1.06]">
              Explorer les partenariats LL.M des facultés de droit françaises
            </h1>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Le parcours le plus classique pour devenir avocat aux États-Unis
                après des études de droit en France consiste à valider une
                formation juridique française, candidater à un LL.M américain,
                suivre les cours nécessaires pour être éligible au barreau visé.
              </p>
              <p>
                Mais le principal obstacle reste souvent le prix très élevé des
                LL.M aux États-Unis. Certaines formations peuvent coûter
                plusieurs dizaines voir centaines de milliers de dollars. L’une
                des meilleures solutions pour réduire ce coût est de passer par
                les partenariats conclus entre les universités françaises et les
                law schools américaines.
              </p>
              <p>
                Ce site vise à centraliser ces partenariats afin de permettre
                aux étudiants de comparer rapidement les universités
                partenaires, les frais, les réductions possibles, les places
                disponibles, les tests d’anglais requis et les conditions de
                sélection.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <StatsBar all={all} />
          </div>
        </div>
      </section>

      <section className="container pb-14 pt-10">
        <div className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-2xl space-y-2">
              <div className="text-sm font-medium">Recherche globale</div>
              <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher : universités, pays, programmes, spécialités, remarques…"
                className="h-11 rounded-xl pl-9"
                aria-label="Recherche globale"
              />
            </div>
          </div>

            <div className="flex flex-wrap items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                  Filtres {activeCount > 0 ? `(${activeCount})` : ""}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>
                    Affine les résultats. Réinitialise à tout moment.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersPanel
                    options={options}
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(emptyFilters())}
                  />
                </div>
              </SheetContent>
            </Sheet>

              <Button variant="outline" onClick={resetAll}>
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-7 lg:mt-10 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <div className="glass-panel inline-flex items-center gap-1 rounded-full p-1">
              <Button
                variant={mapMode === "fr" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapMode("fr")}
                className="rounded-full"
              >
                France
              </Button>
              <Button
                variant={mapMode === "us" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapMode("us")}
                className="rounded-full"
              >
                États-Unis
              </Button>
            </div>

            {mapMode === "fr" ? (
              <FranceMap
                points={points}
                selectedFrenchUniversity={filters.frenchUniversity}
                onSelect={(u) =>
                  setFilters((prev) => ({ ...prev, frenchUniversity: u }))
                }
              />
            ) : (
              <UsMap
                partnerships={all}
                selectedState={filters.partnerState}
                onSelectState={(state) =>
                  setFilters((prev) => ({
                    ...prev,
                    partnerCountry: "États-Unis",
                    partnerState: state
                  }))
                }
              />
            )}

            <Card className="hidden lg:block">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Filtres</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Filtre pour comparer rapidement.
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={resetAll}>
                    Réinitialiser
                  </Button>
                </div>
                <Separator className="my-4" />
                <FiltersPanel
                  options={options}
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(emptyFilters())}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {filtered.length}
                </span>{" "}
                résultat(s)
              </div>
              <div className="text-xs text-muted-foreground">
                Ouvre en modal ou sur une page dédiée.
              </div>
            </div>

            <ScrollArea className="glass-panel h-[62dvh] rounded-3xl sm:h-[70dvh] lg:h-[78dvh]">
              <div className="space-y-3 p-3">
                {filtered.map((p) => (
                  <PartnershipCard key={p.id} partnership={p} />
                ))}
                {filtered.length === 0 ? (
                  <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
                    Aucun résultat. Essaie d’enlever des filtres ou d’élargir la recherche.
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>
    </main>
  )
}
