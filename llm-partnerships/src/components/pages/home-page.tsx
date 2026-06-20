"use client"

import * as React from "react"
import { ArrowRight, Filter, Search } from "lucide-react"

import { CostSimulator } from "@/components/cost-simulator"
import { FiltersPanel } from "@/components/filters/filters-panel"
import { FranceMap } from "@/components/france-map"
import { PartnershipCard } from "@/components/partnership-card"
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

  const activeLabels = [
    filters.frenchUniversity,
    filters.partnerCountry,
    filters.partnerState,
    filters.programType,
    filters.partnershipType,
    filters.tuitionCategory,
    filters.reliabilityStatus,
    ...(filters.specialties || []),
    ...(filters.languageTests || [])
  ].filter(Boolean) as string[]

  function resetAll() {
    setSearchQuery("")
    setFilters(emptyFilters())
  }

  return (
    <main>
      <div className="scroll-progress" aria-hidden="true" />
      <section className="container py-6 sm:py-9">
        <div className="motion-rise max-w-5xl space-y-5">
            <div className="font-mono-ui inline-flex w-fit items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-[0_1px_1px_hsl(222_47%_10%/0.04)]">
              Barreau de New York
              <span className="h-1.5 w-1.5 rounded-full bg-accent motion-glow" aria-hidden="true" />
              LL.M aux Etats-Unis
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[56px]">
                Trouve ton LL.M americain via une fac francaise.
              </h1>
              <p className="max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Le LL.M US est souvent la voie vers le barreau de New York.
                Annuaire des partenariats entre facs francaises et law schools US.
              </p>
            </div>
            <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
              <Button asChild className="h-11 rounded-xl">
                <a href="#workspace">
                  Rechercher un partenariat
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="secondary" className="h-11 rounded-xl">
                <a href="#cost-estimator">Estimer le cout</a>
              </Button>
            </div>
          </div>
      </section>

      <section className="pb-14">
        <div id="workspace" className="container scroll-mt-24 pt-0">
          <div className="glass-panel motion-rise rounded-2xl p-3 sm:p-5 lg:sticky lg:top-[76px] lg:z-30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-3xl space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Recherche globale</div>
                    <div className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                      Cherche une ville, une ecole ou un test, puis affine avec les filtres.
                    </div>
                  </div>
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
                    placeholder="Universite, pays, test, programme..."
                    className="h-12 rounded-xl pl-9 text-base sm:text-sm"
                    aria-label="Recherche globale"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {activeLabels.length > 0 ? (
                    activeLabels.slice(0, 5).map((label) => (
                      <span
                        key={label}
                        className="rounded-full border bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:px-2.5 sm:py-1 sm:text-[11px]"
                      >
                        {label}
                      </span>
                    ))
                  ) : (
                    <>
                      <button
                        type="button"
                        className="glass-button rounded-full px-3 py-1.5 text-xs text-muted-foreground sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() => setSearchQuery("TOEFL")}
                      >
                        TOEFL
                      </button>
                      <button
                        type="button"
                        className="glass-button rounded-full px-3 py-1.5 text-xs text-muted-foreground sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            tuitionCategory: "frais réduits"
                          }))
                        }
                      >
                        frais reduits
                      </button>
                      <button
                        type="button"
                        className="glass-button rounded-full px-3 py-1.5 text-xs text-muted-foreground sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            reliabilityStatus: "confirmed"
                          }))
                        }
                      >
                        confirmes
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="h-11 lg:hidden">
                      <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                      Filtres {activeCount > 0 ? `(${activeCount})` : ""}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[92vw] overflow-y-auto sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                      <SheetDescription>
                        Affine les resultats. Reinitialise a tout moment.
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

                <Button variant="outline" className="h-11" onClick={resetAll}>
                  Reinitialiser
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[400px_minmax(0,1fr)]">
            <div className="order-2 space-y-5 motion-stagger lg:order-1">
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
                  Etats-Unis
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
                      Reinitialiser
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

            <div className="order-1 space-y-4 motion-rise lg:order-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  <span className="metric-figure font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  resultat(s)
                </div>
                <div className="font-mono-ui rounded-full border bg-card/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                  Modal rapide · page dediee · source officielle
                </div>
              </div>

              <ScrollArea className="glass-panel h-[64dvh] rounded-2xl sm:h-[70dvh] lg:h-[78dvh]">
                <div className="space-y-3 p-2 motion-stagger sm:p-3">
                  {filtered.map((p) => (
                    <PartnershipCard key={p.id} partnership={p} />
                  ))}
                  {filtered.length === 0 ? (
                    <div className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
                      Aucun resultat. Essaie d&apos;enlever des filtres ou d&apos;elargir la recherche.
                    </div>
                  ) : null}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <div id="cost-estimator" className="scroll-mt-24 pt-10 sm:pt-14">
          <CostSimulator partnerships={all} />
        </div>
      </section>
    </main>
  )
}
