import Link from "next/link"
import { Globe2 } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/55 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45",
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/90 text-primary-foreground shadow-sm ring-1 ring-white/15">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">LL.M Partnerships</div>
            <div className="text-xs text-muted-foreground">Annuaire des partenariats</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">À propos</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/submit">Proposer une info</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
