"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the real runtime error for debugging.
    // eslint-disable-next-line no-console
    console.error("Exchanges route error:", error)
  }, [error])

  return (
    <main className="container pb-14 pt-10">
      <div className="glass-panel rounded-3xl p-6">
        <div className="text-lg font-semibold">Erreur sur la page Échanges</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur côté navigateur empêche l’affichage. Recharge la page. Si ça persiste,
          ouvre la console et copie-colle le message d’erreur.
        </p>
        <div className="mt-4 rounded-2xl border bg-muted/30 p-3 text-xs text-muted-foreground">
          {error.message || "Erreur inconnue"}{" "}
          {error.digest ? <span>({error.digest})</span> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => reset()}>
            Réessayer
          </Button>
          <Button variant="outline" onClick={() => location.reload()}>
            Recharger
          </Button>
        </div>
      </div>
    </main>
  )
}

