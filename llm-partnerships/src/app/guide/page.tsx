"use client"

import { FounderFaq } from "@/components/founder-faq"
import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"
import { UsLawyerPath } from "@/components/us-lawyer-path"

const copy = {
  fr: {
    title: "Guide : devenir avocat aux États-Unis",
    description:
      "Un parcours type pour comprendre les étapes clés après des études de droit en France.",
  },
  en: {
    title: "Guide: becoming a lawyer in the United States",
    description:
      "A typical path through the key steps after completing legal studies in France.",
  },
  es: {
    title: "Guía: convertirse en abogado en Estados Unidos",
    description:
      "Un recorrido típico por las etapas clave después de estudiar derecho en Francia.",
  },
  de: {
    title: "Leitfaden: Anwalt in den Vereinigten Staaten werden",
    description:
      "Ein typischer Weg durch die wichtigsten Schritte nach Abschluss des Jurastudiums in Frankreich.",
  },
} as const

export default function GuidePage() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <PageShell title={t.title} description={t.description}>
      <UsLawyerPath className="mt-0" />
      <FounderFaq />
    </PageShell>
  )
}
