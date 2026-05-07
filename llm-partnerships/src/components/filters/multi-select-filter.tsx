"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function MultiSelectFilter({
  label,
  placeholder,
  values,
  options,
  onChange
}: {
  label: string
  placeholder: string
  values: string[]
  options: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selected = new Set(values.filter(Boolean))

  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate text-left">
              {values.length > 0
                ? `${values.length} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Rechercher (${label.toLowerCase()})…`} />
            <CommandList>
              <CommandEmpty>Aucun résultat.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.has(option)
                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        const next = new Set(selected)
                        if (isSelected) next.delete(option)
                        else next.add(option)
                        onChange(Array.from(next))
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t p-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange([])
                setOpen(false)
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
