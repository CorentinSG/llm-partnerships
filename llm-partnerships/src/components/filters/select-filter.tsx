"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SelectFilter({
  label,
  placeholder,
  value,
  options,
  onChange
}: {
  label: string
  placeholder: string
  value?: string
  options: string[]
  onChange: (next: string | undefined) => void
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <Select
        value={value ?? "__all__"}
        onValueChange={(v: string) => onChange(v === "__all__" ? undefined : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tous</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
