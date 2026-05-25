"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { AlternativeCard } from "@/components/alternative-card"
import { Input } from "@/components/ui/input"
import { getAlternativeItems, searchAlternativeItems } from "@/lib/alternatives"

export function AlternativesPage() {
  const items = React.useMemo(() => getAlternativeItems(), [])
  const [query, setQuery] = React.useState("")
  const filtered = React.useMemo(
    () => searchAlternativeItems(items, query),
    [items, query]
  )

  return (
    <main className="container pb-14 pt-10">
      <div className="max-w-3xl">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Parcours alternatifs vers la common law nord-américaine
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Cette section présente des programmes (souvent francophones ou non-américains)
            pouvant intéresser des étudiants français souhaitant se former à la common law
            nord-américaine — sans être des LL.M américains ni des partenariats directs
            France → États-Unis.
          </p>
        </div>

        <div className="mt-6 glass-panel rounded-3xl p-5 sm:p-6">
          <div className="text-sm font-medium">Recherche</div>
          <div className="mt-2 relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher : université, programme, pays, matières…"
              className="h-11 rounded-xl pl-9"
              aria-label="Recherche (parcours alternatifs)"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {filtered.map((item) => (
          <AlternativeCard key={item.id} item={item} />
        ))}
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-6 text-sm text-muted-foreground">
            Aucun résultat.
          </div>
        ) : null}
      </div>
    </main>
  )
}

