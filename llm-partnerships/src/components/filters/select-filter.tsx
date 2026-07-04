"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { translateDataText } from "@/lib/text-utils"

export function SelectFilter({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string
  placeholder: string
  value?: string
  options: string[]
  onChange: (next: string | undefined) => void
}) {
  const { language } = useLanguage()

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <Select
        value={value ?? "__all__"}
        onValueChange={(v: string) => onChange(v === "__all__" ? undefined : v)}
      >
        <SelectTrigger className="h-10 rounded-xl border-input bg-card/90 shadow-[0_1px_0_hsl(0_0%_100%/0.05)] transition-colors hover:border-ring/40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{placeholder}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {translateDataText(o, language)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
