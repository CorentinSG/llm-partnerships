"use client"

import * as React from "react"
import { ArrowRight, Filter, HelpCircle, Search } from "lucide-react"

import { CostSimulator } from "@/components/cost-simulator"
import { FiltersPanel } from "@/components/filters/filters-panel"
import { FranceMap } from "@/components/france-map"
import { useLanguage } from "@/components/language-provider"
import { PartnershipCard } from "@/components/partnership-card"
import { UsMap } from "@/components/us-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  emptyFilters,
  filterPartnerships,
  type FiltersState,
} from "@/lib/filters"
import {
  getAllPartnerships,
  getFilterOptions,
  getFrenchUniversitiesPoints,
} from "@/lib/data"
import { reliabilityCopy, type UiLanguage } from "@/lib/text-utils"

const RESULTS_PAGE_SIZE = 12

const pageCopy = {
  fr: {
    chipA: "Objectif barreau US",
    chipB: "LL.M partenaire",
    title: "Annuaire des partenariats LL.M France–États-Unis",
    intro:
      "Un LL.M effectué aux États-Unis est un diplôme de droit d’un an qui peut permettre aux juristes formés à l’étranger de présenter certains barreaux américains, notamment New York.",
    intro2:
      "Les frais de scolarité sont souvent le premier coût d’un LL.M américain. Ce site recense les partenariats entre universités françaises et law schools américaines permettant d’obtenir des frais réduits, des bourses ou parfois une exonération totale.",
    searchCta: "Rechercher un partenariat",
    costCta: "Calculer mon budget annuel",
    faqCta: "Voir la FAQ",
    searchTitle: "Recherche globale",
    searchHint:
      "Cherche une ville, une école ou un test, puis affine avec les filtres.",
    searchPlaceholder: "Université, pays, test, programme...",
    filters: "Filtres",
    reset: "Réinitialiser",
    noFilter: "Aucun filtre actif",
    activeFilters: "filtre(s) actif(s)",
    results: "résultat(s)",
    shown: "affichés sur",
    naturalScroll: "Défilement naturel de la page",
    backToSearch: "Retour recherche",
    morePrefix: "Encore",
    moreSuffix: "résultat(s) à parcourir.",
    showMore: "Afficher 12 de plus",
    allShown: "Tous les résultats correspondants sont affichés.",
    noResult:
      "Aucun résultat. Essaie d'enlever des filtres ou d'élargir la recherche.",
    legendTitle: "Statuts des offres",
    language: "Langue",
    quickReduced: "Sans frais d'inscription",
    quickConfirmed: "Confirmés",
    france: "France",
    unitedStates: "États-Unis",
    sheetHint: "Affine les résultats. Réinitialise à tout moment.",
  },
  en: {
    chipA: "US bar pathway",
    chipB: "Partner LL.M",
    title: "Find a US LL.M through a French university.",
    intro:
      "A U.S. LL.M. is a one-year law degree that can allow foreign-trained lawyers to sit for certain U.S. bar exams, especially New York.",
    intro2:
      "Tuition is often the main cost of a U.S. LL.M. This site tracks partnerships between French universities and U.S. law schools offering reduced tuition, scholarships, or sometimes full waivers.",
    searchCta: "Search partnerships",
    costCta: "Calculate annual budget",
    faqCta: "Open FAQ",
    searchTitle: "Global search",
    searchHint: "Search by city, school, or test, then refine with filters.",
    searchPlaceholder: "University, country, test, program...",
    filters: "Filters",
    reset: "Reset",
    noFilter: "No active filter",
    activeFilters: "active filter(s)",
    results: "result(s)",
    shown: "shown of",
    naturalScroll: "Natural page scrolling",
    backToSearch: "Back to search",
    morePrefix: "",
    moreSuffix: "result(s) remaining.",
    showMore: "Show 12 more",
    allShown: "All matching results are shown.",
    noResult: "No result. Try removing filters or broadening the search.",
    legendTitle: "Offer status legend",
    language: "Language",
    quickReduced: "No partner tuition",
    quickConfirmed: "Confirmed",
    france: "France",
    unitedStates: "United States",
    sheetHint: "Refine results. Reset at any time.",
  },
  es: {
    chipA: "Objetivo barra de EE. UU.",
    chipB: "LL.M con convenio",
    title: "Encuentra un LL.M estadounidense vía una universidad francesa.",
    intro:
      "Un LL.M en Estados Unidos es un título jurídico de un año que puede permitir a juristas formados en el extranjero presentarse a ciertos colegios de abogados estadounidenses, especialmente Nueva York.",
    intro2:
      "La matrícula suele ser el primer gran coste de un LL.M estadounidense. Este sitio recopila convenios entre universidades francesas y law schools estadounidenses con reducciones, becas o incluso exenciones totales.",
    searchCta: "Buscar convenios",
    costCta: "Calcular presupuesto anual",
    faqCta: "Ver FAQ",
    searchTitle: "Búsqueda global",
    searchHint: "Busca por ciudad, escuela o examen, y afina con filtros.",
    searchPlaceholder: "Universidad, país, examen, programa...",
    filters: "Filtros",
    reset: "Reiniciar",
    noFilter: "Sin filtros activos",
    activeFilters: "filtro(s) activo(s)",
    results: "resultado(s)",
    shown: "mostrados de",
    naturalScroll: "Desplazamiento natural de la página",
    backToSearch: "Volver a búsqueda",
    morePrefix: "Quedan",
    moreSuffix: "resultado(s) por revisar.",
    showMore: "Mostrar 12 más",
    allShown: "Todos los resultados correspondientes están visibles.",
    noResult:
      "No hay resultados. Prueba quitando filtros o ampliando la búsqueda.",
    legendTitle: "Leyenda de estados",
    language: "Idioma",
    quickReduced: "Sin matrícula",
    quickConfirmed: "Confirmados",
    france: "Francia",
    unitedStates: "Estados Unidos",
    sheetHint: "Afina los resultados. Reinicia cuando quieras.",
  },
} as const

export function HomePage() {
  const all = React.useMemo(() => getAllPartnerships(), [])
  const options = React.useMemo(() => getFilterOptions(), [])
  const points = React.useMemo(() => getFrenchUniversitiesPoints(), [])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<FiltersState>(() =>
    emptyFilters(),
  )
  const [mapMode, setMapMode] = React.useState<"fr" | "us">("fr")
  const [visibleCount, setVisibleCount] = React.useState(RESULTS_PAGE_SIZE)
  const { language } = useLanguage()
  const t = pageCopy[language]

  const filtered = React.useMemo(
    () => filterPartnerships(all, searchQuery, filters),
    [all, searchQuery, filters],
  )

  React.useEffect(() => {
    setVisibleCount(RESULTS_PAGE_SIZE)
  }, [searchQuery, filters])

  const visiblePartnerships = filtered.slice(0, visibleCount)
  const remainingCount = Math.max(
    filtered.length - visiblePartnerships.length,
    0,
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
    ...(filters.languageTests || []),
  ].filter(Boolean) as string[]

  function resetAll() {
    setSearchQuery("")
    setFilters(emptyFilters())
  }

  return (
    <main>
      <div className="scroll-progress" aria-hidden="true" />
      <section className="container py-7 sm:py-9">
        <div className="motion-rise max-w-5xl space-y-5">
          <div className="font-mono-ui inline-flex w-fit items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-[0_1px_1px_hsl(222_47%_10%/0.04)]">
            {t.chipA}
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent motion-glow"
              aria-hidden="true"
            />
            {t.chipB}
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-balance text-[32px] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[56px]">
              {t.title}
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {t.intro}
            </p>
            <p className="max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {t.intro2}
            </p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Button asChild className="h-12 rounded-xl sm:h-11">
              <a href="#workspace">
                {t.searchCta}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-xl sm:h-11"
            >
              <a href="#cost-estimator">{t.costCta}</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-12 rounded-xl border bg-background/55 sm:h-11"
            >
              <a href="/guide#faq">
                <HelpCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                {t.faqCta}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div id="workspace" className="container scroll-mt-24 pt-0">
          <div className="glass-panel motion-rise rounded-2xl p-4 sm:p-5 lg:sticky lg:top-[76px] lg:z-30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-3xl space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{t.searchTitle}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                      {t.searchHint}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activeCount > 0
                      ? `${activeCount} ${t.activeFilters}`
                      : t.noFilter}
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
                    placeholder={t.searchPlaceholder}
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
                        className="glass-button min-h-10 rounded-full px-3.5 py-2 text-xs text-muted-foreground sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() => setSearchQuery("TOEFL")}
                      >
                        TOEFL
                      </button>
                      <button
                        type="button"
                        className="glass-button min-h-10 rounded-full px-3.5 py-2 text-xs text-muted-foreground sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            tuitionCategory: "sans frais",
                          }))
                        }
                      >
                        {t.quickReduced}
                      </button>
                      <button
                        type="button"
                        className="glass-button min-h-10 rounded-full px-3.5 py-2 text-xs text-muted-foreground sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            reliabilityStatus: "confirmed",
                          }))
                        }
                      >
                        {t.quickConfirmed}
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
                      {t.filters} {activeCount > 0 ? `(${activeCount})` : ""}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[92vw] overflow-y-auto sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                      <SheetDescription>{t.sheetHint}</SheetDescription>
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
                  {t.reset}
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
                  className="h-10 rounded-lg sm:h-9"
                >
                  {t.france}
                </Button>
                <Button
                  variant={mapMode === "us" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapMode("us")}
                  className="h-10 rounded-lg sm:h-9"
                >
                  {t.unitedStates}
                </Button>
              </div>

              {mapMode === "fr" ? (
                <FranceMap
                  points={points}
                  selectedFrenchUniversity={filters.frenchUniversity}
                  onSelect={(u) =>
                    setFilters((prev) => ({ ...prev, frenchUniversity: u }))
                  }
                  language={language}
                />
              ) : (
                <UsMap
                  partnerships={all}
                  selectedState={filters.partnerState}
                  onSelectState={(state) =>
                    setFilters((prev) => ({
                      ...prev,
                      partnerCountry: "\u00c9tats-Unis",
                      partnerState: state,
                    }))
                  }
                  language={language}
                />
              )}

              <div className="hidden lg:block">
                <FiltersPanel
                  options={options}
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(emptyFilters())}
                />
              </div>
            </div>

            <div className="order-1 space-y-4 motion-rise lg:order-2">
              <div className="rounded-2xl border bg-card/80 p-4">
                <div className="text-sm font-medium">{t.legendTitle}</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(["confirmed", "to_confirm", "incomplete"] as const).map(
                    (status) => (
                      <div
                        key={status}
                        className="rounded-xl border bg-secondary/45 p-3"
                      >
                        <div className="text-xs font-semibold text-foreground">
                          {reliabilityCopy[language][status].label}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-muted-foreground">
                          {reliabilityCopy[language][status].description}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  <span className="metric-figure font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  {t.results}
                </div>
                <div className="font-mono-ui rounded-full border bg-card/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {visiblePartnerships.length} {t.shown} {filtered.length}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-3 sm:p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-secondary/45 px-3 py-2.5 text-xs text-muted-foreground">
                  <span>{t.naturalScroll}</span>
                  <a
                    className="inline-flex min-h-10 items-center font-medium text-foreground hover:text-primary sm:min-h-0"
                    href="#workspace"
                  >
                    {t.backToSearch}
                  </a>
                </div>
                <div className="space-y-3 motion-stagger">
                  {visiblePartnerships.map((p) => (
                    <PartnershipCard
                      key={p.id}
                      partnership={p}
                      language={language}
                    />
                  ))}
                  {filtered.length === 0 ? (
                    <div className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
                      {t.noResult}
                    </div>
                  ) : null}
                </div>
                {remainingCount > 0 ? (
                  <div className="mt-4 flex flex-col gap-2 rounded-xl border bg-secondary/45 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      {t.morePrefix} {remainingCount} {t.moreSuffix}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-11 rounded-xl"
                      onClick={() =>
                        setVisibleCount((count) =>
                          Math.min(count + RESULTS_PAGE_SIZE, filtered.length),
                        )
                      }
                    >
                      {t.showMore}
                    </Button>
                  </div>
                ) : filtered.length > RESULTS_PAGE_SIZE ? (
                  <div className="mt-4 rounded-xl border bg-secondary/45 p-3 text-sm text-muted-foreground">
                    {t.allShown}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div id="cost-estimator" className="scroll-mt-24 pt-10 sm:pt-14">
          <CostSimulator partnerships={all} language={language} />
        </div>
      </section>
    </main>
  )
}
