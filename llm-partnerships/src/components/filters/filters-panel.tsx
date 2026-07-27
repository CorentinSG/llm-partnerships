"use client"

import {
  BadgeDollarSign,
  GraduationCap,
  MapPinned,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
} from "lucide-react"

import type { FiltersState } from "@/lib/filters"
import type { ReliabilityStatus } from "@/lib/types"

import { useLanguage } from "@/components/language-provider"
import { MultiSelectFilter } from "@/components/filters/multi-select-filter"
import { SelectFilter } from "@/components/filters/select-filter"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FiltersPanel({
  options,
  filters,
  onChange,
  onReset,
  showFrenchUniversityFilter = true,
  originUniversityLabel,
}: {
  options: {
    frenchUniversities: string[]
    partnerCountries: string[]
    partnerStates: string[]
    continents: string[]
    partnerUniversities: string[]
    programTypes: string[]
    partnershipTypes: string[]
    specialties: string[]
    requiredLevels: string[]
    programLanguages: string[]
    languageTests: string[]
    tuitionCategories: string[]
    seats: string[]
    reliabilityStatuses: string[]
  }
  filters: FiltersState
  onChange: (next: FiltersState) => void
  onReset: () => void
  showFrenchUniversityFilter?: boolean
  originUniversityLabel?: string
}) {
  const { language } = useLanguage()
  const t = {
    fr: {
      title: "Filtres de recherche",
      hint: "Affine par destination, programme, admission et conditions financières.",
      active: "actifs",
      none: "Aucun actif",
      destination: "Destination",
      frenchUniversity: "Université française",
      partnerCountry: "Pays partenaire",
      continent: "Continent",
      partnerUniversity: "Université partenaire",
      state: "État (USA)",
      program: "Programme",
      programType: "Type de programme",
      partnershipType: "Type de partenariat",
      specialties: "Spécialités",
      admission: "Admission",
      level: "Niveau requis",
      programLanguage: "Langue du programme",
      languageTest: "Test de langue",
      cost: "Coût et fiabilité",
      fees: "Frais",
      seats: "Nombre de places",
      reliability: "Statut de fiabilité",
      all: "Tous",
      allFeminine: "Toutes",
      confirmed: "Confirmé",
      toConfirm: "À confirmer",
      incomplete: "Information incomplète",
      reset: "Réinitialiser",
      tip: "Conseil : la recherche globale couvre tous les champs.",
    },
    en: {
      title: "Search filters",
      hint: "Refine by destination, program, admission, and financial terms.",
      active: "active",
      none: "None active",
      destination: "Destination",
      frenchUniversity: "French university",
      partnerCountry: "Partner country",
      continent: "Continent",
      partnerUniversity: "Partner university",
      state: "State (USA)",
      program: "Program",
      programType: "Program type",
      partnershipType: "Partnership type",
      specialties: "Specialties",
      admission: "Admission",
      level: "Required level",
      programLanguage: "Program language",
      languageTest: "Language test",
      cost: "Cost and reliability",
      fees: "Fees",
      seats: "Number of seats",
      reliability: "Reliability status",
      all: "All",
      allFeminine: "All",
      confirmed: "Confirmed",
      toConfirm: "To confirm",
      incomplete: "Incomplete information",
      reset: "Reset",
      tip: "Tip: global search covers every field.",
    },
    es: {
      title: "Filtros de búsqueda",
      hint: "Afina por destino, programa, admisión y condiciones económicas.",
      active: "activos",
      none: "Ninguno activo",
      destination: "Destino",
      frenchUniversity: "Universidad francesa",
      partnerCountry: "País asociado",
      continent: "Continente",
      partnerUniversity: "Universidad asociada",
      state: "Estado (EE. UU.)",
      program: "Programa",
      programType: "Tipo de programa",
      partnershipType: "Tipo de convenio",
      specialties: "Especialidades",
      admission: "Admisión",
      level: "Nivel requerido",
      programLanguage: "Idioma del programa",
      languageTest: "Prueba de idioma",
      cost: "Coste y fiabilidad",
      fees: "Costes",
      seats: "Número de plazas",
      reliability: "Estado de fiabilidad",
      all: "Todos",
      allFeminine: "Todas",
      confirmed: "Confirmado",
      toConfirm: "Por confirmar",
      incomplete: "Información incompleta",
      reset: "Reiniciar",
      tip: "Consejo: la búsqueda global cubre todos los campos.",
    },
  }[language]
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

  return (
    <div className="rounded-2xl border bg-card/72 p-3 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)]">
      <div className="mb-4 rounded-xl border bg-secondary/50 px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SearchCheck
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              {t.title}
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {t.hint}
            </p>
          </div>
          <div className="rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {activeCount > 0 ? `${activeCount} ${t.active}` : t.none}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <section className="rounded-xl border bg-background/58 p-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
            <MapPinned
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            {t.destination}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {showFrenchUniversityFilter ? (
              <SelectFilter
                label={originUniversityLabel ?? t.frenchUniversity}
                placeholder={t.all}
                value={filters.frenchUniversity}
                options={options.frenchUniversities}
                onChange={(v) => onChange({ ...filters, frenchUniversity: v })}
              />
            ) : null}
            <SelectFilter
              label={t.partnerCountry}
              placeholder={t.all}
              value={filters.partnerCountry}
              options={options.partnerCountries}
              onChange={(v) => onChange({ ...filters, partnerCountry: v })}
            />
            <SelectFilter
              label={t.continent}
              placeholder={t.all}
              value={filters.continent}
              options={options.continents}
              onChange={(v) => onChange({ ...filters, continent: v })}
            />
            <SelectFilter
              label={t.partnerUniversity}
              placeholder={t.all}
              value={filters.partnerUniversity}
              options={options.partnerUniversities}
              onChange={(v) => onChange({ ...filters, partnerUniversity: v })}
            />
            <SelectFilter
              label={t.state}
              placeholder={t.all}
              value={filters.partnerState}
              options={options.partnerStates}
              onChange={(v) => onChange({ ...filters, partnerState: v })}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-background/58 p-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
            <GraduationCap
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            {t.program}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectFilter
              label={t.programType}
              placeholder={t.all}
              value={filters.programType}
              options={options.programTypes}
              onChange={(v) => onChange({ ...filters, programType: v })}
            />
            <SelectFilter
              label={t.partnershipType}
              placeholder={t.all}
              value={filters.partnershipType}
              options={options.partnershipTypes}
              onChange={(v) => onChange({ ...filters, partnershipType: v })}
            />
            <MultiSelectFilter
              label={t.specialties}
              placeholder={t.allFeminine}
              values={filters.specialties || []}
              options={options.specialties}
              onChange={(v) => onChange({ ...filters, specialties: v })}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-background/58 p-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldCheck
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            {t.admission}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectFilter
              label={t.level}
              placeholder={t.all}
              value={filters.requiredLevel}
              options={options.requiredLevels}
              onChange={(v) => onChange({ ...filters, requiredLevel: v })}
            />
            <SelectFilter
              label={t.programLanguage}
              placeholder={t.all}
              value={filters.programLanguage}
              options={options.programLanguages}
              onChange={(v) => onChange({ ...filters, programLanguage: v })}
            />
            <MultiSelectFilter
              label={t.languageTest}
              placeholder={t.all}
              values={filters.languageTests || []}
              options={options.languageTests}
              onChange={(v) => onChange({ ...filters, languageTests: v })}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-background/58 p-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
            <BadgeDollarSign
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            {t.cost}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectFilter
              label={t.fees}
              placeholder={t.all}
              value={filters.tuitionCategory}
              options={options.tuitionCategories}
              onChange={(v) => onChange({ ...filters, tuitionCategory: v })}
            />
            <SelectFilter
              label={t.seats}
              placeholder={t.all}
              value={filters.availableSeats}
              options={options.seats}
              onChange={(v) => onChange({ ...filters, availableSeats: v })}
            />
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                {t.reliability}
              </div>
              <Select
                value={(filters.reliabilityStatus ?? "__all__") as string}
                onValueChange={(v: string) =>
                  onChange({
                    ...filters,
                    reliabilityStatus:
                      v === "__all__" ? undefined : (v as ReliabilityStatus),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t.all}</SelectItem>
                  <SelectItem value="confirmed">{t.confirmed}</SelectItem>
                  <SelectItem value="to_confirm">{t.toConfirm}</SelectItem>
                  <SelectItem value="incomplete">{t.incomplete}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border bg-secondary/45 p-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          className="h-10 justify-center gap-2"
          onClick={onReset}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {t.reset}
        </Button>
        <div className="text-xs leading-5 text-muted-foreground">{t.tip}</div>
      </div>
    </div>
  )
}
