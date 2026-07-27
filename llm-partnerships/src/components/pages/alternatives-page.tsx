"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { AlternativeCard } from "@/components/alternative-card"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { getAlternativeItems, searchAlternativeItems } from "@/lib/alternatives"

const copy = {
  fr: {
    title: "Parcours alternatifs vers la common law nord-américaine",
    intro:
      "Cette section présente des programmes, souvent francophones ou non américains, pouvant intéresser des étudiants français souhaitant se former à la common law nord-américaine sans être des LL.M américains ni des partenariats directs France–États-Unis.",
    search: "Recherche",
    placeholder: "Université, programme, pays, matières…",
    aria: "Recherche dans les parcours alternatifs",
    empty: "Aucun résultat.",
  },
  en: {
    title: "Alternative paths into North American common law",
    intro:
      "This section presents programs, often French-speaking or outside the United States, for French students interested in North American common law without pursuing a U.S. LL.M or a direct France–U.S. partnership.",
    search: "Search",
    placeholder: "University, program, country, subjects…",
    aria: "Search alternative programs",
    empty: "No results.",
  },
  es: {
    title: "Vías alternativas hacia el common law norteamericano",
    intro:
      "Esta sección presenta programas, a menudo francófonos o fuera de Estados Unidos, para estudiantes franceses interesados en el common law norteamericano sin cursar un LL.M estadounidense ni un convenio directo Francia–Estados Unidos.",
    search: "Buscar",
    placeholder: "Universidad, programa, país, materias…",
    aria: "Buscar programas alternativos",
    empty: "No hay resultados.",
  },
  de: {
    title: "Alternative Wege zum nordamerikanischen Common Law",
    intro:
      "Dieser Bereich stellt häufig französischsprachige oder außerhalb der USA angebotene Programme vor. Sie richten sich an Studierende, die sich mit dem nordamerikanischen Common Law befassen möchten, ohne dass es sich um einen US-amerikanischen LL.M. oder eine direkte Partnerschaft Frankreich–USA handelt.",
    search: "Suchen",
    placeholder: "Universität, Programm, Land, Fächer…",
    aria: "Suchen Sie nach alternativen Programmen",
    empty: "Keine Ergebnisse.",
  },
} as const

export function AlternativesPage() {
  const { language } = useLanguage()
  const t = copy[language]
  const items = React.useMemo(() => getAlternativeItems(), [])
  const [query, setQuery] = React.useState("")
  const filtered = React.useMemo(
    () => searchAlternativeItems(items, query),
    [items, query],
  )

  return (
    <main className="container pb-14 pt-10">
      <div className="max-w-3xl">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t.intro}
          </p>
        </div>

        <div className="mt-6 glass-panel rounded-2xl p-5 motion-rise sm:p-6">
          <div className="text-sm font-medium">{t.search}</div>
          <div className="mt-2 relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="h-11 rounded-xl pl-9"
              aria-label={t.aria}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {filtered.map((item) => (
          <AlternativeCard key={item.id} item={item} />
        ))}
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
            {t.empty}
          </div>
        ) : null}
      </div>
    </main>
  )
}
