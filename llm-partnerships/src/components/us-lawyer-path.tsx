"use client"

import * as React from "react"
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Step = {
  title: string
  subtitle: string
  content: string[]
  footnote?: string
}

const steps: Step[] = [
  {
    title: "1) Clarifier l’objectif (Bar / carrière)",
    subtitle: "Choisir un État et comprendre les règles du barreau visé.",
    content: [
      "Définir l’État ciblé (New York, California, etc.) et vérifier l’éligibilité avec un cursus français + LL.M.",
      "Identifier si un LL.M « bar-eligible » est nécessaire et quelles matières/crédits sont exigés.",
      "Évaluer le budget total (tuition, assurance, visa, logement)."
    ],
    footnote:
      "Ce bloc est informatif : les règles varient selon l’État et évoluent."
  },
  {
    title: "2) Trouver un LL.M adapté (partenariat vs candidature libre)",
    subtitle:
      "Les partenariats peuvent réduire fortement le coût d’un LL.M américain.",
    content: [
      "Comparer : places réservées, réduction de tuition, frais fixes, bourses potentielles.",
      "Vérifier les conditions : niveau requis, tests de langue, dates limites, processus (sélection interne / LSAC).",
      "Prioriser les programmes pertinents pour l’objectif (bar track, transnational practice, etc.)."
    ]
  },
  {
    title: "3) Candidater (sélection interne / LSAC)",
    subtitle:
      "Deux logiques : dossier géré par l’université française, ou dépôt sur une plateforme.",
    content: [
      "Préparer dossier : relevés, CV, lettres, personal statement, tests (TOEFL/IELTS/… selon l’école).",
      "Si LSAC est requis : anticiper le délai de traitement des documents.",
      "Respecter les deadlines (souvent tôt : décembre–février)."
    ]
  },
  {
    title: "4) Suivre le LL.M et valider les crédits",
    subtitle:
      "Optimiser les cours pour l’objectif « bar » (si applicable).",
    content: [
      "Choisir les matières compatibles avec les exigences de l’État (si bar visé).",
      "Gérer l’administratif : assurance, visa, inscription, coûts annexes.",
      "Conserver des preuves : syllabus, crédits, attestations (utile pour la suite)."
    ]
  },
  {
    title: "5) Option : préparation du Bar (selon l’État)",
    subtitle:
      "Dans certains cas, un semestre supplémentaire ou un programme dédié est utile.",
    content: [
      "Vérifier les prérequis précis (crédits, cours obligatoires, timing).",
      "Préparer l’examen : bar prep, calendrier, budget, logistique.",
      "Déposer la demande d’éligibilité selon les règles de l’État visé."
    ]
  }
]

export function UsLawyerPath({ className }: { className?: string }) {
  const [openIndex, setOpenIndex] = React.useState<number>(0)

  return (
    <section className={cn("mt-16", className)} aria-label="Parcours avocat aux États-Unis">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs font-medium tracking-wide text-muted-foreground">
            Guide (MVP)
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            De juriste français à avocat aux États-Unis : le parcours type
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Une vue d’ensemble claire, pensée pour être comprise en 2 minutes.
            Les étapes sont interactives : clique pour dérouler le détail.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {steps.map((step, idx) => {
            const open = idx === openIndex
            return (
              <Card
                key={step.title}
                className={cn(
                  "transition-[border-color,box-shadow,transform]",
                  open ? "border-primary/25" : ""
                )}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base sm:text-lg">
                        {step.title}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">{step.subtitle}</div>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 text-muted-foreground">
                      <span className="hidden text-xs sm:inline">
                        {open ? "Réduire" : "Détails"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          open ? "rotate-180" : "rotate-0"
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </CardHeader>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <CardContent className="pt-0">
                      <div className="grid gap-2">
                        {step.content.map((line) => (
                          <div key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                            <span>{line}</span>
                          </div>
                        ))}
                        {step.footnote ? (
                          <div className="mt-2 rounded-xl border bg-secondary/45 p-3 text-xs text-muted-foreground">
                            {step.footnote}
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Footer intentionally omitted (MVP). */}
      </div>
    </section>
  )
}
