import Link from "next/link"
import { Menu } from "lucide-react"

import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/55 shadow-[0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 dark:shadow-none",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/90 text-primary-foreground shadow-sm ring-1 ring-white/15">
            <LogoMark className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">LL.M Partnerships</div>
            <div className="text-xs text-muted-foreground">Annuaire des partenariats</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/about">À propos</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/guide">Guide USA</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/exchanges">Échanges</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/alternatives">Parcours alternatifs</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/submit">Proposer une info</Link>
            </Button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="secondary" size="sm" className="h-9 rounded-full px-3">
              <Link href="/submit">Proposer</Link>
            </Button>
            <ThemeToggle />

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-2">
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/">Accueil</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/about">À propos</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/guide">Guide USA</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/exchanges">Échanges</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/alternatives">Parcours alternatifs</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
