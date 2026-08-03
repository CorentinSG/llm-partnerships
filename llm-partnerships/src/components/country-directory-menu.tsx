"use client"

import { usePathname, useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type CountryDirectory = {
  href: string
  label: string
}

export function CountryDirectoryMenu({
  label,
  directories,
  mobile = false,
  onNavigate,
}: {
  label: string
  directories: CountryDirectory[]
  mobile?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const activeDirectory = directories.find(({ href }) => pathname === href)

  function navigate(href: string) {
    onNavigate?.()
    router.push(href)
  }

  return (
    <Select value={activeDirectory?.href ?? ""} onValueChange={navigate}>
      <SelectTrigger
        aria-label={`${label}: ${activeDirectory?.label ?? label}`}
        className={cn(
          "border-0 bg-transparent shadow-none",
          mobile
            ? "min-h-11 w-full rounded-xl border bg-card/70 px-3 text-left"
            : "h-8 w-auto max-w-[17rem] gap-2 rounded-lg px-2 text-xs hover:bg-secondary",
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span aria-hidden="true" className="text-muted-foreground/55">·</span>
          <span className="min-w-0 truncate font-medium text-foreground">
            <SelectValue placeholder={label} />
          </span>
        </span>
      </SelectTrigger>
      <SelectContent
        align={mobile ? "start" : "end"}
        sideOffset={6}
        className="max-h-[min(22rem,var(--radix-select-content-available-height))] max-w-[calc(100vw-2rem)]"
      >
        {directories.map((directory) => (
          <SelectItem
            key={directory.href}
            value={directory.href}
            className="min-h-11 whitespace-normal py-2.5 pr-3 leading-snug"
          >
            {directory.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
