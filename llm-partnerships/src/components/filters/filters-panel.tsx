"use client"

import type { FiltersState } from "@/lib/filters"

import { MultiSelectFilter } from "@/components/filters/multi-select-filter"
import { SelectFilter } from "@/components/filters/select-filter"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export function FiltersPanel({
  options,
  filters,
  onChange,
  onReset,
  showFrenchUniversityFilter = true
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
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {showFrenchUniversityFilter ? (
          <SelectFilter
            label="Université française"
            placeholder="Tous"
            value={filters.frenchUniversity}
            options={options.frenchUniversities}
            onChange={(v) => onChange({ ...filters, frenchUniversity: v })}
          />
        ) : null}
        <SelectFilter
          label="Pays partenaire"
          placeholder="Tous"
          value={filters.partnerCountry}
          options={options.partnerCountries}
          onChange={(v) => onChange({ ...filters, partnerCountry: v })}
        />
        <SelectFilter
          label="Continent"
          placeholder="Tous"
          value={filters.continent}
          options={options.continents}
          onChange={(v) => onChange({ ...filters, continent: v })}
        />
        <SelectFilter
          label="Université partenaire"
          placeholder="Tous"
          value={filters.partnerUniversity}
          options={options.partnerUniversities}
          onChange={(v) => onChange({ ...filters, partnerUniversity: v })}
        />
        <SelectFilter
          label="État (USA)"
          placeholder="Tous"
          value={filters.partnerState}
          options={options.partnerStates}
          onChange={(v) => onChange({ ...filters, partnerState: v })}
        />
        <SelectFilter
          label="Type de programme"
          placeholder="Tous"
          value={filters.programType}
          options={options.programTypes}
          onChange={(v) => onChange({ ...filters, programType: v })}
        />
        <SelectFilter
          label="Type de partenariat"
          placeholder="Tous"
          value={filters.partnershipType}
          options={options.partnershipTypes}
          onChange={(v) => onChange({ ...filters, partnershipType: v })}
        />
        <MultiSelectFilter
          label="Spécialités"
          placeholder="Toutes"
          values={filters.specialties || []}
          options={options.specialties}
          onChange={(v) => onChange({ ...filters, specialties: v })}
        />
        <SelectFilter
          label="Niveau requis"
          placeholder="Tous"
          value={filters.requiredLevel}
          options={options.requiredLevels}
          onChange={(v) => onChange({ ...filters, requiredLevel: v })}
        />
        <SelectFilter
          label="Langue du programme"
          placeholder="Tous"
          value={filters.programLanguage}
          options={options.programLanguages}
          onChange={(v) => onChange({ ...filters, programLanguage: v })}
        />
        <MultiSelectFilter
          label="Test de langue"
          placeholder="Tous"
          values={filters.languageTests || []}
          options={options.languageTests}
          onChange={(v) => onChange({ ...filters, languageTests: v })}
        />
        <SelectFilter
          label="Frais"
          placeholder="Tous"
          value={filters.tuitionCategory}
          options={options.tuitionCategories}
          onChange={(v) => onChange({ ...filters, tuitionCategory: v })}
        />
        <SelectFilter
          label="Nombre de places"
          placeholder="Tous"
          value={filters.availableSeats}
          options={options.seats}
          onChange={(v) => onChange({ ...filters, availableSeats: v })}
        />
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            Statut de fiabilité
          </div>
          <Select
            value={(filters.reliabilityStatus ?? "__all__") as string}
            onValueChange={(v) =>
              onChange({
                ...filters,
                reliabilityStatus: v === "__all__" ? undefined : (v as any)
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="to_confirm">À confirmer</SelectItem>
              <SelectItem value="incomplete">Information incomplète</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" onClick={onReset}>
          Réinitialiser
        </Button>
        <div className="text-xs text-muted-foreground">
          Conseil : la recherche globale couvre tous les champs.
        </div>
      </div>
    </div>
  )
}
