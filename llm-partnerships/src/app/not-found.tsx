"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"

const copy = {
  fr: {
    title: "Introuvable",
    description: "Cette page n’existe pas.",
    action: "Retour à l’accueil",
    body: "Vérifie l’URL ou reviens à la liste.",
  },
  en: {
    title: "Not found",
    description: "This page does not exist.",
    action: "Back to home",
    body: "Check the URL or return to the directory.",
  },
  es: {
    title: "Página no encontrada",
    description: "Esta página no existe.",
    action: "Volver al inicio",
    body: "Comprueba la URL o vuelve al directorio.",
  },
  de: {
    title: "Nicht gefunden",
    description: "Diese Seite existiert nicht.",
    action: "Zurück nach Hause",
    body: "Überprüfen Sie die URL oder kehren Sie zum Verzeichnis zurück.",
  },
  it: {
    title: "Non trovato",
    description: "Questa pagina non esiste",
    action: "Torna alla home",
    body: "Controlla l'URL o torna alla directory.",
  },
} as const

export default function NotFound() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <PageShell
      title={t.title}
      description={t.description}
      actions={
        <Button asChild variant="secondary">
          <Link href="/">{t.action}</Link>
        </Button>
      }
    >
      <div className="text-sm text-muted-foreground">{t.body}</div>
    </PageShell>
  )
}
