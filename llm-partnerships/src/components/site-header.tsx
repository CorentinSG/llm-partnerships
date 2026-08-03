"use client"

import Link from "next/link"
import { Languages, Menu, Send } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { UiLanguage } from "@/lib/text-utils"
import { cn } from "@/lib/utils"

const languageLabels: Record<UiLanguage, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
  de: "DE",
  it: "IT",
}

const languageNames: Record<UiLanguage, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
}

function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()
  const copy = {
    fr: { aria: "Changer la langue", label: "Langue" },
    en: { aria: "Change language", label: "Language" },
    es: { aria: "Cambiar idioma", label: "Idioma" },
    de: { aria: "Sprache ändern", label: "Sprache" },
    it: { aria: "Cambia lingua", label: "Lingua" },
  }[language]

  return (
    <div
      className={cn(
        "glass-panel inline-flex items-center gap-1 rounded-xl p-1",
        compact ? "w-full justify-between" : "h-9",
      )}
      aria-label={copy.aria}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 text-xs text-muted-foreground",
          compact ? "min-w-20" : "",
        )}
      >
        <Languages className="h-3.5 w-3.5" aria-hidden="true" />
        {compact ? copy.label : null}
      </span>
      <div className="flex items-center gap-1">
        {(["fr", "en", "es", "de", "it"] as UiLanguage[]).map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-ring",
              language === item
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              compact ? "min-w-14" : "",
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
  const { language } = useLanguage()
  const t = {
    fr: {
      subtitle: "Annuaire des partenariats",
      about: "À propos",
      guide: "Guide USA",
      alternatives: "Parcours alternatifs",
      submit: "Proposer une info",
      submitShort: "Proposer",
      franceUs: "France–États-Unis",
      germanyUs: "Allemagne–États-Unis",
      italyUs: "Italie–États-Unis",
      ukUs: "Royaume-Uni–États-Unis",
      menu: "Menu",
    },
    en: {
      subtitle: "Partnership directory",
      about: "About",
      guide: "U.S. guide",
      alternatives: "Alternative paths",
      submit: "Submit information",
      submitShort: "Submit",
      franceUs: "France–United States",
      germanyUs: "Germany–United States",
      italyUs: "Italy–United States",
      ukUs: "United Kingdom–United States",
      menu: "Menu",
    },
    es: {
      subtitle: "Directorio de convenios",
      about: "Acerca del proyecto",
      guide: "Guía EE. UU.",
      alternatives: "Vías alternativas",
      submit: "Proponer información",
      submitShort: "Proponer",
      franceUs: "Francia–Estados Unidos",
      germanyUs: "Alemania–Estados Unidos",
      italyUs: "Italia–Estados Unidos",
      ukUs: "Reino Unido–Estados Unidos",
      menu: "Menú",
    },
    de: {
      subtitle: "Verzeichnis der Partnerschaften",
      about: "Über das Projekt",
      guide: "USA-Ratgeber",
      alternatives: "Alternative Wege",
      submit: "Information einreichen",
      submitShort: "Einreichen",
      franceUs: "Frankreich–USA",
      germanyUs: "Deutschland–USA",
      italyUs: "Italien–USA",
      ukUs: "Vereinigtes Königreich–USA",
      menu: "Menü",
    },
    it: {
      subtitle: "Elenco dei partenariati",
      about: "Informazioni sul progetto",
      guide: "Guida americana",
      alternatives: "Percorsi alternativi",
      submit: "Invia informazioni",
      submitShort: "Invia",
      franceUs: "Francia–Stati Uniti",
      germanyUs: "Germania–Stati Uniti",
      italyUs: "Italia–Stati Uniti",
      ukUs: "Regno Unito–Stati Uniti",
      menu: "Menu",
    },
  }[language]

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/76",
        className,
      )}
    >
      <div className="flex min-h-16 w-full items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-xl focus-ring"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_-18px_hsl(var(--primary)/0.95)] transition-transform duration-150 ease-out group-hover:scale-[1.03]">
            <LogoMark className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              LL.M Partnerships
            </div>
            <div className="font-mono-ui text-[11px] text-muted-foreground">
              {t.subtitle}
            </div>
          </div>
        </Link>

        <nav className="flex min-w-0 items-center gap-2">
          <div className="hidden items-center gap-1 min-[1400px]:flex">
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/">{t.franceUs}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/germany">{t.germanyUs}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/italy">{t.italyUs}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/uk">{t.ukUs}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/about">{t.about}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/guide">{t.guide}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/alternatives">{t.alternatives}</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/submit">
                <Send className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                {t.submitShort}
              </Link>
            </Button>
            <LanguageSwitch />
            <ThemeToggle />
          </div>

          <div className="flex min-w-0 items-center gap-1.5 min-[1400px]:hidden">
            <Button asChild variant="default" size="sm" className="h-11 px-3">
              <Link href="/submit">{t.submitShort}</Link>
            </Button>
            <ThemeToggle />

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 min-h-10 w-10 min-w-10 rounded-xl sm:h-11 sm:min-h-11 sm:w-11 sm:min-w-11"
                  aria-label={t.menu}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle>{t.menu}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/">{t.franceUs}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/germany">{t.germanyUs}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/italy">{t.italyUs}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/uk">{t.ukUs}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/about">{t.about}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/guide">{t.guide}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/alternatives">{t.alternatives}</Link>
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
