"use client"

import * as React from "react"
import { Filter, Search } from "lucide-react"

import { FranceMap } from "@/components/france-map"
import { ExchangeCard } from "@/components/exchange-card"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFrenchUniversitiesPoints } from "@/lib/data"
import { filterExchanges, getAllExchanges, getExchangeFilterOptions, getExchangeMeta, type ExchangesFilters } from "@/lib/exchanges"

function emptyFilters(): ExchangesFilters {
  return {}
}

export function ExchangesPage() {
  const all = React.useMemo(() => getAllExchanges(), [])
  const meta = React.useMemo(() => getExchangeMeta(), [])
  const points = React.useMemo(() => getFrenchUniversitiesPoints(), [])
  const options = React.useMemo(() => getExchangeFilterOptions(all), [all])

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<ExchangesFilters>(() => emptyFilters())

  const filtered = React.useMemo(
    () => filterExchanges(all, query, filters),
    [all, query, filters]
  )

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <main className="container pb-14 pt-10">
      <div className="max-w-4xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {meta.sectionName}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {meta.description}
        </p>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-muted-foreground">
          {meta.warning}
        </div>
      </div>

      <div className="mt-8 glass-panel rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-2xl space-y-2">
            <div className="text-sm font-medium">Recherche</div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher : universités, ville, type de mobilité, notes…"
                className="h-11 rounded-xl pl-9"
                aria-label="Recherche (échanges)"
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
                  <SheetDescription>Affiner les échanges affichés.</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersUI
                    options={options}
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(emptyFilters())}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              onClick={() => {
                setQuery("")
                setFilters(emptyFilters())
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-7 lg:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <FranceMap
            points={points}
            selectedFrenchUniversity={filters.frenchUniversity}
            onSelect={(u) => setFilters((prev) => ({ ...prev, frenchUniversity: u }))}
          />

          <div className="hidden lg:block">
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Filtres</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Filtre pour comparer rapidement.
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters(emptyFilters())}
                >
                  Réinitialiser
                </Button>
              </div>
              <Separator className="my-4" />
              <FiltersUI
                options={options}
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(emptyFilters())}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span>{" "}
              échange(s)
            </div>
          </div>

          <ScrollArea className="glass-panel h-[78dvh] rounded-3xl">
            <div className="space-y-3 p-3">
              {filtered.map((it) => (
                <ExchangeCard key={it.id} item={it} />
              ))}
              {filtered.length === 0 ? (
                <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
                  Aucun résultat.
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </div>
    </main>
  )
}

function FiltersUI({
  options,
  filters,
  onChange,
  onReset
}: {
  options: ReturnType<typeof getExchangeFilterOptions>
  filters: ExchangesFilters
  onChange: (next: ExchangesFilters) => void
  onReset: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Université française</Label>
          <Select
            value={filters.frenchUniversity || ""}
            onValueChange={(v) => onChange({ ...filters, frenchUniversity: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              {options.frenchUniversities.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Université partenaire</Label>
          <Select
            value={filters.partnerUniversity || ""}
            onValueChange={(v) => onChange({ ...filters, partnerUniversity: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              {options.partnerUniversities.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pays</Label>
          <Select
            value={filters.partnerCountry || ""}
            onValueChange={(v) => onChange({ ...filters, partnerCountry: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {options.partnerCountries.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ville partenaire</Label>
          <Select
            value={filters.partnerCity || ""}
            onValueChange={(v) => onChange({ ...filters, partnerCity: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              {options.partnerCities.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type de mobilité</Label>
          <Select
            value={filters.mobilityType || ""}
            onValueChange={(v) => onChange({ ...filters, mobilityType: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {options.mobilityTypes.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Durée</Label>
          <Select
            value={filters.duration || ""}
            onValueChange={(v) => onChange({ ...filters, duration: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              {options.durations.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Niveau requis</Label>
          <Select
            value={filters.requiredLevel || ""}
            onValueChange={(v) => onChange({ ...filters, requiredLevel: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {options.requiredLevels.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Semestre</Label>
          <Select
            value={filters.semester || ""}
            onValueChange={(v) => onChange({ ...filters, semester: v || undefined })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {options.semesters
                .filter(Boolean)
                .map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Programme diplômant</Label>
          <Select
            value={filters.isDegreeGranting || ""}
            onValueChange={(v) =>
              onChange({
                ...filters,
                isDegreeGranting: (v as any) || undefined
              })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              <SelectItem value="non">Non diplômant</SelectItem>
              <SelectItem value="oui">Diplômant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fiabilité</Label>
          <Select
            value={filters.reliabilityStatus || ""}
            onValueChange={(v) =>
              onChange({ ...filters, reliabilityStatus: (v as any) || undefined })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="to_confirm">À confirmer</SelectItem>
              <SelectItem value="incomplete">Information incomplète</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button variant="secondary" onClick={onReset} className="w-full">
        Réinitialiser les filtres
      </Button>
    </div>
  )
}

