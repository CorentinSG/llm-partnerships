"use client"

import * as React from "react"
import { Check, Search } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cleanText, translateDataText } from "@/lib/text-utils"
import { cn } from "@/lib/utils"

export function MultiSelectFilter({
  label,
  placeholder,
  values,
  options,
  onChange,
}: {
  label: string
  placeholder: string
  values: string[]
  options: string[]
  onChange: (next: string[]) => void
}) {
  const { language } = useLanguage()
  const t = {
    fr: {
      selected: "sélectionnée(s)",
      search: "Rechercher",
      empty: "Aucun résultat.",
      reset: "Réinitialiser",
    },
    en: {
      selected: "selected",
      search: "Search",
      empty: "No results.",
      reset: "Reset",
    },
    es: {
      selected: "seleccionada(s)",
      search: "Buscar",
      empty: "No hay resultados.",
      reset: "Reiniciar",
    },
    de: {
      selected: "ausgewählt",
      search: "Suchen",
      empty: "Keine Ergebnisse.",
      reset: "Zurücksetzen",
    },
  }[language]
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const selected = new Set(values.filter(Boolean))
  const normalizedQuery = cleanText(query).toLowerCase()
  const filteredOptions = options.filter((option) =>
    cleanText(option).toLowerCase().includes(normalizedQuery),
  )

  function toggle(option: string) {
    const next = new Set(selected)
    if (next.has(option)) next.delete(option)
    else next.add(option)
    onChange(Array.from(next))
  }

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full justify-between rounded-xl border-input bg-card/90 shadow-[0_1px_0_hsl(0_0%_100%/0.05)] hover:border-ring/40"
          >
            <span className="truncate text-left">
              {values.length > 0
                ? `${values.length} ${t.selected}`
                : placeholder}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">⌄</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[min(340px,calc(100vw-2rem))] p-0"
          align="start"
        >
          <div className="border-b p-2">
            <label className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3">
              <Search
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`${t.search} (${label.toLowerCase()})...`}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          <div className="max-h-72 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selected.has(option)
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                      isSelected && "bg-primary/10 text-primary",
                    )}
                    onClick={() => toggle(option)}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {isSelected ? (
                        <Check className="h-3 w-3" aria-hidden="true" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {translateDataText(option, language)}
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t.empty}
              </div>
            )}
          </div>
          <div className="border-t p-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange([])
                setQuery("")
                setOpen(false)
              }}
            >
              {t.reset}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
