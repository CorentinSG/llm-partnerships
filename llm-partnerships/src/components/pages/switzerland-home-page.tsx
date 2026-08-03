"use client"

import * as React from "react"
import { ArrowRight, Filter, HelpCircle, Search } from "lucide-react"

import {
  CostSimulator,
  type CostSimulatorOriginConfig,
} from "@/components/cost-simulator"
import { FiltersPanel } from "@/components/filters/filters-panel"
import { SwitzerlandMap } from "@/components/switzerland-map"
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
  getAllSwissPartnerships,
  getSwissFilterOptions,
  getSwissUniversitiesPoints,
} from "@/lib/switzerland-data"
import {
  reliabilityCopy,
  translateDataText,
  type UiLanguage,
} from "@/lib/text-utils"
import type { Partnership } from "@/lib/types"

const RESULTS_PAGE_SIZE = 12

function getLocalizedSearchText(
  partnership: Partnership,
  language: UiLanguage,
) {
  const textValues: string[] = []

  function collectText(value: unknown) {
    if (typeof value === "string") {
      textValues.push(translateDataText(value, language))
      return
    }
    if (Array.isArray(value)) {
      value.forEach(collectText)
      return
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach(collectText)
    }
  }

  collectText(partnership)
  return textValues.join(" ")
}

const swissCostSimulatorOrigin = {
  flights: {
    fr: "Billets d'avion Suisse - États-Unis",
    en: "Switzerland - U.S. flights",
    es: "Vuelos Suiza - Estados Unidos",
    de: "Flüge von der Schweiz in die USA",
    it: "Voli Svizzera-USA",
  },
  universityFees: {
    fr: "Frais éventuels à l'université suisse",
    en: "Possible fees at the Swiss university",
    es: "Posibles tasas en la universidad suiza",
    de: "Mögliche Gebühren an der Schweizer Universität",
    it: "Possibili tasse presso l'università svizzera",
  },
  universityFeesHelp: {
    fr: "Estimation des frais qui peuvent rester dus à l'université suisse selon l'établissement et le partenariat. Aucun montant n'est supposé par défaut et ce poste ne correspond pas à la tuition américaine.",
    en: "Estimate for fees that may remain payable to the Swiss university, depending on the institution and partnership. No amount is assumed by default, and this is not U.S. tuition.",
    es: "Estimación de las tasas que podrían seguir debiéndose a la universidad suiza según la institución y el convenio. No se presupone ningún importe y no corresponde a la matrícula estadounidense.",
    de: "Schätzung der Gebühren, die je nach Einrichtung und Partnerschaft noch an die Schweizer Universität zu zahlen sein können. Standardmäßig wird kein Betrag angenommen; dies sind keine US-Studiengebühren.",
    it: "Stima delle spese che potrebbero rimanere dovute all'università svizzera, a seconda dell'istituzione e della partnership. Nessun importo viene assunto e non si tratta della retta statunitense.",
  },
  universityFeesUsd: 0,
} satisfies CostSimulatorOriginConfig

const pageCopy = {
  fr: {
    chipA: "Objectif barreau US",
    chipB: "LL.M partenaire",
    title: "Trouvez un LL.M américain via une université suisse.",
    intro:
      "Un LL.M effectué aux États-Unis est un diplôme de droit d’un an qui peut permettre aux juristes formés à l’étranger de présenter certains barreaux américains, notamment New York.",
    intro2:
      "Cette page présente 7 partenariats entre établissements suisses et law schools américaines. Les avantages, coûts et effets sur l'accès aux barreaux sont distingués sans présumer l'éligibilité individuelle.",
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
    quickReduced: "Frais réduits",
    quickConfirmed: "Confirmés",
    switzerland: "Suisse",
    unitedStates: "États-Unis",
    swissUniversity: "Université suisse",
    sheetHint: "Affine les résultats. Réinitialise à tout moment.",
  },
  en: {
    chipA: "US bar pathway",
    chipB: "Partner LL.M",
    title: "Find a U.S. LL.M. through a Swiss university.",
    intro:
      "A U.S. LL.M. is a one-year law degree that can allow foreign-trained lawyers to sit for certain U.S. bar exams, especially New York.",
    intro2:
      "This page presents 7 partnerships between Swiss institutions and U.S. law schools. Benefits, costs, and bar-exam implications are separated without assuming individual eligibility.",
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
    quickReduced: "Reduced tuition",
    quickConfirmed: "Confirmed",
    switzerland: "Switzerland",
    unitedStates: "United States",
    swissUniversity: "Swiss university",
    sheetHint: "Refine results. Reset at any time.",
  },
  es: {
    chipA: "Objetivo barra de EE. UU.",
    chipB: "LL.M con convenio",
    title:
      "Encuentra un LL.M estadounidense a través de una universidad suiza.",
    intro:
      "Un LL.M en Estados Unidos es un título jurídico de un año que puede permitir a juristas formados en el extranjero presentarse a ciertos colegios de abogados estadounidenses, especialmente Nueva York.",
    intro2:
      "Esta página presenta 7 convenios entre instituciones suizas y law schools estadounidenses. Las ventajas, los costes y los efectos sobre el acceso a los bar exams se distinguen sin presumir la elegibilidad individual.",
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
    quickReduced: "Matrícula reducida",
    quickConfirmed: "Confirmados",
    switzerland: "Suiza",
    unitedStates: "Estados Unidos",
    swissUniversity: "Universidad suiza",
    sheetHint: "Afina los resultados. Reinicia cuando quieras.",
  },
  de: {
    chipA: "Weg zur US-Anwaltszulassung",
    chipB: "Partner-LL.M.",
    title: "Finden Sie einen US-amerikanischen LL.M. über eine Schweizer Universität.",
    intro:
      "Ein LL.M. in den USA ist ein einjähriger juristischer Abschluss, der im Ausland ausgebildeten Juristinnen und Juristen die Teilnahme an bestimmten US-amerikanischen Anwaltsprüfungen ermöglichen kann, insbesondere in New York.",
    intro2:
      "Diese Seite zeigt 7 Partnerschaften zwischen Schweizer Institutionen und US-Law-Schools. Vorteile, Kosten und Auswirkungen auf die Anwaltszulassung werden getrennt dargestellt, ohne die individuelle Zulässigkeit vorauszusetzen.",
    searchCta: "Suchen Sie nach Partnerschaften",
    costCta: "Jahresbudget berechnen",
    faqCta: "FAQ öffnen",
    searchTitle: "Globale Suche",
    searchHint: "Suchen Sie nach Stadt, Schule oder Prüfung und verfeinern Sie die Suche anschließend mit Filtern.",
    searchPlaceholder: "Universität, Land, Test, Programm...",
    filters: "Filter",
    reset: "Zurücksetzen",
    noFilter: "Kein aktiver Filter",
    activeFilters: "aktive(r) Filter",
    results: "Ergebnis(se)",
    shown: "gezeigt von",
    naturalScroll: "Natürliches Scrollen der Seite",
    backToSearch: "Zurück zur Suche",
    morePrefix: "",
    moreSuffix: "verbleibende(n) Ergebnis(se).",
    showMore: "12 weitere anzeigen",
    allShown: "Alle passenden Ergebnisse werden angezeigt.",
    noResult: "Kein Ergebnis. Versuchen Sie, Filter zu entfernen oder die Suche zu erweitern.",
    legendTitle: "Legende zum Angebotsstatus",
    quickReduced: "Ermäßigte Studiengebühren",
    quickConfirmed: "Bestätigt",
    switzerland: "Schweiz",
    unitedStates: "Vereinigte Staaten",
    swissUniversity: "Schweizer Universität",
    sheetHint: "Ergebnisse verfeinern. Jederzeit zurücksetzen.",
  },
  it: {
    chipA: "Obiettivo abilitazione USA",
    chipB: "LL.M. partner",
    title: "Trova un LL.M. statunitense tramite un'università svizzera.",
    intro:
      "Un LL.M. negli Stati Uniti è un titolo giuridico post-laurea di un anno che può consentire ai giuristi formati all’estero di accedere ad alcuni esami di abilitazione, in particolare quello di New York.",
    intro2:
      "Questa pagina presenta 7 partnership tra istituzioni svizzere e law school statunitensi. Vantaggi, costi ed effetti sull'accesso agli esami di abilitazione sono distinti senza presumere l'idoneità individuale.",
    searchCta: "Cerca una partnership",
    costCta: "Calcola il budget annuale",
    faqCta: "Apri le domande frequenti",
    searchTitle: "Ricerca globale",
    searchHint: "Cerca per città, scuola o test, quindi perfeziona con i filtri.",
    searchPlaceholder: "Università, paese, test, programma...",
    filters: "Filtri",
    reset: "Reimposta",
    noFilter: "Nessun filtro attivo",
    activeFilters: "filtri attivi",
    results: "risultati",
    shown: "mostrato di",
    naturalScroll: "Scorrimento naturale delle pagine",
    backToSearch: "Torna alla ricerca",
    morePrefix: "",
    moreSuffix: "risultato/i rimanente/i.",
    showMore: "Mostrane altri 12",
    allShown: "Vengono visualizzati tutti i risultati corrispondenti.",
    noResult: "Nessun risultato. Prova a rimuovere alcuni filtri o ad ampliare la ricerca.",
    legendTitle: "Legenda dello stato dell'offerta",
    quickReduced: "Retta ridotta",
    quickConfirmed: "Confermato",
    switzerland: "Svizzera",
    unitedStates: "Stati Uniti",
    swissUniversity: "Università svizzera",
    sheetHint: "Perfezionare i risultati. Reimposta in qualsiasi momento.",
  },
} as const

export function SwitzerlandHomePage() {
  const all = React.useMemo(() => getAllSwissPartnerships(), [])
  const options = React.useMemo(() => getSwissFilterOptions(), [])
  const points = React.useMemo(() => getSwissUniversitiesPoints(), [])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<FiltersState>(() =>
    emptyFilters(),
  )
  const [mapMode, setMapMode] = React.useState<"switzerland" | "us">("switzerland")
  const [visibleCount, setVisibleCount] = React.useState(RESULTS_PAGE_SIZE)
  const { language } = useLanguage()
  const t = pageCopy[language]

  const filtered = React.useMemo(
    () =>
      filterPartnerships(all, searchQuery, filters, (partnership) =>
        getLocalizedSearchText(partnership, language),
      ),
    [all, searchQuery, filters, language],
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
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="h-12 rounded-xl pl-9 text-base sm:text-sm"
                    aria-label={t.searchTitle}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {activeLabels.length > 0 ? (
                    activeLabels.slice(0, 5).map((label) => (
                      <span
                        key={label}
                        className="rounded-full border bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:px-2.5 sm:py-1 sm:text-[11px]"
                      >
                        {translateDataText(label, language)}
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
                          setFilters((previous) => ({
                            ...previous,
                            tuitionCategory: "frais réduits",
                          }))
                        }
                      >
                        {t.quickReduced}
                      </button>
                      <button
                        type="button"
                        className="glass-button min-h-10 rounded-full px-3.5 py-2 text-xs text-muted-foreground sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[11px]"
                        onClick={() =>
                          setFilters((previous) => ({
                            ...previous,
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
                      <SheetTitle>{t.filters}</SheetTitle>
                      <SheetDescription>{t.sheetHint}</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersPanel
                        options={options}
                        filters={filters}
                        onChange={setFilters}
                        onReset={() => setFilters(emptyFilters())}
                        originUniversityLabel={t.swissUniversity}
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
                  variant={mapMode === "switzerland" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapMode("switzerland")}
                  className="h-10 rounded-lg sm:h-9"
                  aria-pressed={mapMode === "switzerland"}
                >
                  {t.switzerland}
                </Button>
                <Button
                  variant={mapMode === "us" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapMode("us")}
                  className="h-10 rounded-lg sm:h-9"
                  aria-pressed={mapMode === "us"}
                >
                  {t.unitedStates}
                </Button>
              </div>

              {mapMode === "switzerland" ? (
                <SwitzerlandMap
                  points={points}
                  selectedSwissUniversity={filters.frenchUniversity}
                  onSelect={(university) =>
                    setFilters((previous) => ({
                      ...previous,
                      frenchUniversity: university,
                    }))
                  }
                  language={language}
                />
              ) : (
                <UsMap
                  partnerships={all}
                  selectedState={filters.partnerState}
                  onSelectState={(state) =>
                    setFilters((previous) => ({
                      ...previous,
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
                  originUniversityLabel={t.swissUniversity}
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
                  {visiblePartnerships.map((partnership) => (
                    <PartnershipCard
                      key={partnership.id}
                      partnership={partnership}
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
          <CostSimulator
            partnerships={all}
            language={language}
            originConfig={swissCostSimulatorOrigin}
          />
        </div>
      </section>
    </main>
  )
}
