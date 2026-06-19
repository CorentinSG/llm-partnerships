"use client"

import * as React from "react"
import { Filter, Search } from "lucide-react"

import { CostSimulator } from "@/components/cost-simulator"
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
      <section className="container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
          <div className="motion-rise max-w-4xl space-y-6">
            <div className="font-mono-ui inline-flex w-fit items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-[0_1px_1px_hsl(222_47%_10%/0.04)]">
              Annuaire comparatif LL.M
              <span className="h-1.5 w-1.5 rounded-full bg-accent motion-glow" aria-hidden="true" />
              France vers international
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[60px]">
                Comparer les partenariats LL.M sans repartir de zéro.
              </h1>
              <p className="max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                Centralise les universités partenaires, frais, réductions,
                places, tests d&apos;anglais, conditions de sélection et sources
                officielles pour choisir un parcours avec plus de clarté.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="scanline rounded-2xl border bg-card/78 p-4 motion-pop">
                <div className="metric-figure text-2xl font-semibold text-foreground">
                  {all.length}
                </div>
                <div className="mt-1">fiches dans la base</div>
              </div>
              <div className="scanline rounded-2xl border bg-card/78 p-4 motion-pop [animation-delay:80ms]">
                <div className="metric-figure text-2xl font-semibold text-foreground">
                  {activeCount}
                </div>
                <div className="mt-1">filtre(s) actif(s)</div>
              </div>
              <div className="scanline rounded-2xl border bg-card/78 p-4 motion-pop [animation-delay:160ms]">
                <div className="metric-figure text-2xl font-semibold text-foreground">
                  {filtered.length}
                </div>
                <div className="mt-1">résultat(s) visibles</div>
              </div>
            </div>
          </div>

          <div className="motion-glow motion-rise-slow rounded-2xl border bg-card p-4 shadow-[0_24px_70px_-46px_hsl(222_47%_10%/0.48)]">
            <div className="rounded-xl border bg-secondary/45 p-3">
              <div className="font-mono-ui mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Workspace de comparaison</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                  Live filters
                </span>
              </div>
              <div className="space-y-2">
                {["Université française", "Frais", "Test de langue"].map(
                  (label, index) => (
                    <div
                      key={label}
                      className="scanline flex items-center justify-between rounded-lg border bg-card px-3 py-2 motion-pop"
                      style={{ animationDelay: `${index * 70 + 120}ms` }}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <span className="h-2 w-16 rounded-full bg-primary/20" />
                    </div>
                  )
                )}
              </div>
              <div className="mt-3 rounded-lg border bg-card p-3">
                <div className="font-mono-ui mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Signal de fiabilité</span>
                  <span>{filtered.length} lignes</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <span
                      key={index}
                      className="h-8 rounded-md bg-primary/10 motion-pop"
                      style={{
                        animationDelay: `${index * 12}ms`,
                        opacity: index % 5 === 0 ? 1 : 0.42 + (index % 4) * 0.12
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 motion-stagger">
          <StatsBar all={all} />
        </div>
      </section>

      <section className="pb-14">
        <CostSimulator partnerships={all} />

        <div className="container pt-8">
          <div className="glass-panel motion-rise rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-3xl space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">Recherche globale</div>
                  <div className="text-xs text-muted-foreground">
                    {activeCount > 0
                      ? `${activeCount} filtre(s) actif(s)`
                      : "Aucun filtre actif"}
                  </div>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher : universités, pays, programmes, spécialités, remarques..."
                    className="h-12 rounded-xl pl-9"
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

          <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[400px_minmax(0,1fr)]">
            <div className="space-y-5 motion-stagger">
              <div className="glass-panel inline-flex items-center gap-1 rounded-xl p-1">
                <Button
                  variant={mapMode === "fr" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapMode("fr")}
                  className="rounded-lg"
                >
                  France
                </Button>
                <Button
                  variant={mapMode === "us" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapMode("us")}
                  className="rounded-lg"
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
                <CardContent className="p-5">
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

            <div className="space-y-4 motion-rise">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  <span className="metric-figure font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  résultat(s)
                </div>
                <div className="text-xs text-muted-foreground">
                  Ouvre en modal ou sur une page dédiée.
                </div>
              </div>

              <ScrollArea className="glass-panel h-[62dvh] rounded-2xl sm:h-[70dvh] lg:h-[78dvh]">
                <div className="space-y-3 p-3 motion-stagger">
                  {filtered.map((p) => (
                    <PartnershipCard key={p.id} partnership={p} />
                  ))}
                  {filtered.length === 0 ? (
                    <div className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
                      Aucun résultat. Essaie d&apos;enlever des filtres ou d&apos;élargir la recherche.
                    </div>
                  ) : null}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
