"use client"

import Link from "next/link"
import { Languages, Menu, Send } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { UiLanguage } from "@/lib/text-utils"
import { cn } from "@/lib/utils"

const languageLabels: Record<UiLanguage, string> = {
  fr: "FR",
  en: "EN",
  es: "ES"
}

const languageNames: Record<UiLanguage, string> = {
  fr: "Français",
  en: "English",
  es: "Español"
}

function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className={cn(
        "glass-panel inline-flex items-center gap-1 rounded-xl p-1",
        compact ? "w-full justify-between" : "h-9"
      )}
      aria-label="Changer la langue"
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 text-xs text-muted-foreground",
          compact ? "min-w-20" : ""
        )}
      >
        <Languages className="h-3.5 w-3.5" aria-hidden="true" />
        {compact ? "Langue" : null}
      </span>
      <div className="flex items-center gap-1">
        {(["fr", "en", "es"] as UiLanguage[]).map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-ring",
              language === item
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              compact ? "min-w-14" : ""
            )}
            aria-pressed={language === item}
            aria-label={languageNames[item]}
            onClick={() => setLanguage(item)}
          >
            {compact ? languageNames[item] : languageLabels[item]}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/76",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 rounded-xl focus-ring">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_-18px_hsl(var(--primary)/0.95)] transition-transform duration-150 ease-out group-hover:scale-[1.03]">
            <LogoMark className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">LL.M Partnerships</div>
            <div className="font-mono-ui text-[11px] text-muted-foreground">Annuaire des partenariats</div>
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
              <Link href="/alternatives">Parcours alternatifs</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/submit">
                <Send className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Proposer une info
              </Link>
            </Button>
            <LanguageSwitch />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="default" size="sm" className="h-9 px-3">
              <Link href="/submit">Proposer</Link>
            </Button>
            <ThemeToggle />

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
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
                    <Link href="/alternatives">Parcours alternatifs</Link>
                  </Button>
                  <div className="pt-3">
                    <LanguageSwitch compact />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
