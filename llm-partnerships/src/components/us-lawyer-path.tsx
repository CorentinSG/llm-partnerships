"use client"

import * as React from "react"
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Step = {
  title: string
  subtitle: string
  content: string[]
  footnote?: string
}

const stepsFr: Step[] = [
  {
    title: "1) Clarifier l’objectif (Bar / carrière)",
    subtitle: "Choisir un État et comprendre les règles du barreau visé.",
    content: [
      "Définir l’État ciblé (New York, California, etc.) et vérifier l’éligibilité avec un cursus français + LL.M.",
      "Identifier si un LL.M « bar-eligible » est nécessaire et quelles matières/crédits sont exigés.",
      "Évaluer le budget total (tuition, assurance, visa, logement).",
    ],
    footnote:
      "Ce bloc est informatif : les règles varient selon l’État et évoluent.",
  },
  {
    title: "2) Trouver un LL.M adapté (partenariat vs candidature libre)",
    subtitle:
      "Les partenariats peuvent réduire fortement le coût d’un LL.M américain.",
    content: [
      "Comparer : places réservées, réduction de tuition, frais fixes, bourses potentielles.",
      "Vérifier les conditions : niveau requis, tests de langue, dates limites, processus (sélection interne / LSAC).",
      "Prioriser les programmes pertinents pour l’objectif (bar track, transnational practice, etc.).",
    ],
  },
  {
    title: "3) Candidater (sélection interne / LSAC)",
    subtitle:
      "Deux logiques : dossier géré par l’université française, ou dépôt sur une plateforme.",
    content: [
      "Préparer dossier : relevés, CV, lettres, personal statement, tests (TOEFL/IELTS/… selon l’école).",
      "Si LSAC est requis : anticiper le délai de traitement des documents.",
      "Respecter les deadlines (souvent tôt : décembre–février).",
    ],
  },
  {
    title: "4) Suivre le LL.M et valider les crédits",
    subtitle: "Optimiser les cours pour l’objectif « bar » (si applicable).",
    content: [
      "Choisir les matières compatibles avec les exigences de l’État (si bar visé).",
      "Gérer l’administratif : assurance, visa, inscription, coûts annexes.",
      "Conserver des preuves : syllabus, crédits, attestations (utile pour la suite).",
    ],
  },
  {
    title: "5) Option : préparation du Bar (selon l’État)",
    subtitle:
      "Dans certains cas, un semestre supplémentaire ou un programme dédié est utile.",
    content: [
      "Vérifier les prérequis précis (crédits, cours obligatoires, timing).",
      "Préparer l’examen : bar prep, calendrier, budget, logistique.",
      "Déposer la demande d’éligibilité selon les règles de l’État visé.",
    ],
  },
]

const guideCopy = {
  fr: {
    eyebrow: "Guide",
    title: "De juriste français à avocat aux États-Unis : le parcours type",
    intro:
      "Une vue d’ensemble claire, pensée pour être comprise en 2 minutes. Les étapes sont interactives : clique pour dérouler le détail.",
    details: "Détails",
    collapse: "Réduire",
    aria: "Parcours avocat aux États-Unis",
    steps: stepsFr,
  },
  en: {
    eyebrow: "Guide",
    title: "From French law graduate to U.S. attorney: a typical path",
    intro:
      "A clear two-minute overview. Open each interactive step for more detail.",
    details: "Details",
    collapse: "Collapse",
    aria: "Path to becoming a U.S. attorney",
    steps: [
      {
        title: "1) Define the objective",
        subtitle: "Choose a jurisdiction and understand its bar rules.",
        content: [
          "Identify the target jurisdiction and confirm eligibility with a French degree plus a U.S. LL.M.",
          "Determine whether a bar-eligible LL.M and specific courses or credits are required.",
          "Estimate the full budget, including tuition, insurance, visa, and housing.",
        ],
        footnote: "Bar admission rules vary by jurisdiction and may change.",
      },
      {
        title: "2) Find the right LL.M",
        subtitle:
          "Partnerships can significantly reduce the cost of a U.S. LL.M.",
        content: [
          "Compare reserved seats, tuition reductions, fixed fees, and scholarships.",
          "Check academic level, language tests, deadlines, and application process.",
          "Prioritize programs aligned with the target bar and career plan.",
        ],
      },
      {
        title: "3) Apply",
        subtitle:
          "Applications may be managed by the French university or submitted through LSAC.",
        content: [
          "Prepare transcripts, CV, recommendations, personal statement, and language tests.",
          "Allow enough time for LSAC document processing where required.",
          "Respect early deadlines, often between December and February.",
        ],
      },
      {
        title: "4) Complete the LL.M",
        subtitle: "Choose courses that support bar eligibility where relevant.",
        content: [
          "Select courses compatible with the target jurisdiction’s requirements.",
          "Manage insurance, visa, registration, and additional costs.",
          "Keep syllabi, credit records, and official certificates.",
        ],
      },
      {
        title: "5) Prepare for the bar exam",
        subtitle:
          "A dedicated preparation program or extra semester may be useful.",
        content: [
          "Confirm exact credit, course, and timing requirements.",
          "Plan bar preparation, schedule, budget, and logistics.",
          "Submit the eligibility application under the target jurisdiction’s rules.",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Guía",
    title: "De jurista francés a abogado en Estados Unidos",
    intro:
      "Una visión clara de dos minutos. Abre cada etapa para ver los detalles.",
    details: "Detalles",
    collapse: "Reducir",
    aria: "Recorrido para ser abogado en Estados Unidos",
    steps: [
      {
        title: "1) Definir el objetivo",
        subtitle: "Elegir un estado y comprender sus reglas de admisión.",
        content: [
          "Identificar el estado objetivo y verificar la elegibilidad con estudios franceses y un LL.M.",
          "Determinar si se exige un LL.M bar-eligible y materias o créditos concretos.",
          "Estimar el presupuesto completo: matrícula, seguro, visa y vivienda.",
        ],
        footnote: "Las reglas cambian según el estado y pueden evolucionar.",
      },
      {
        title: "2) Encontrar el LL.M adecuado",
        subtitle:
          "Los convenios pueden reducir considerablemente el coste del LL.M.",
        content: [
          "Comparar plazas reservadas, reducciones, tasas y becas.",
          "Comprobar nivel, idioma, fechas y proceso de candidatura.",
          "Priorizar programas compatibles con el bar exam y el proyecto profesional.",
        ],
      },
      {
        title: "3) Presentar la candidatura",
        subtitle:
          "La universidad francesa puede gestionar el expediente o requerirse LSAC.",
        content: [
          "Preparar notas, CV, recomendaciones, personal statement y pruebas de idioma.",
          "Anticipar el procesamiento de documentos por LSAC.",
          "Respetar fechas límite, a menudo entre diciembre y febrero.",
        ],
      },
      {
        title: "4) Completar el LL.M",
        subtitle:
          "Elegir asignaturas compatibles con el bar exam cuando sea necesario.",
        content: [
          "Seleccionar materias exigidas por el estado objetivo.",
          "Gestionar seguro, visa, matrícula y costes adicionales.",
          "Conservar programas, créditos y certificados oficiales.",
        ],
      },
      {
        title: "5) Preparar el bar exam",
        subtitle:
          "Puede ser útil un programa específico o un semestre adicional.",
        content: [
          "Confirmar créditos, cursos y plazos exactos.",
          "Planificar preparación, calendario, presupuesto y logística.",
          "Presentar la solicitud de elegibilidad según las reglas del estado.",
        ],
      },
    ],
  },
  de: {
    eyebrow: "Führung",
    title: "Vom französischen Jurastudenten zum US-Anwalt: ein typischer Weg",
    intro:
      "Ein klarer zweiminütiger Überblick. Öffnen Sie jeden interaktiven Schritt für weitere Details.",
    details: "Einzelheiten",
    collapse: "Zusammenbruch",
    aria: "Weg zum US-Anwalt",
    steps: [
      {
        title: "1) Definieren Sie das Ziel",
        subtitle: "Wählen Sie eine Gerichtsbarkeit und machen Sie sich mit deren Anwaltsregeln vertraut.",
        content: [
          "Identifizieren Sie die Zieljurisdiktion und bestätigen Sie die Berechtigung mit einem französischen Abschluss und einem US-amerikanischen LL.M.",
          "Stellen Sie fest, ob ein berufsbegleitender LL.M und bestimmte Kurse oder Credits erforderlich sind.",
          "Schätzen Sie das Gesamtbudget, einschließlich Studiengebühren, Versicherung, Visum und Unterkunft.",
        ],
        footnote: "Die Zulassungsregeln für Rechtsanwälte variieren je nach Gerichtsbarkeit und können sich ändern.",
      },
      {
        title: "2) Finden Sie den richtigen LL.M",
        subtitle:
          "Partnerschaften können die Kosten eines US-amerikanischen LL.M. erheblich senken",
        content: [
          "Vergleichen Sie reservierte Plätze, Studiengebührenermäßigungen, feste Gebühren und Stipendien.",
          "Überprüfen Sie das akademische Niveau, die Sprachtests, die Fristen und den Bewerbungsprozess.",
          "Priorisieren Sie Programme, die auf die Zielvorgabe und den Karriereplan abgestimmt sind.",
        ],
      },
      {
        title: "3) Bewerben",
        subtitle:
          "Bewerbungen können von der französischen Universität verwaltet oder über LSAC eingereicht werden.",
        content: [
          "Bereiten Sie Zeugnisse, Lebensläufe, Empfehlungen, persönliche Stellungnahmen und Sprachtests vor.",
          "Planen Sie bei Bedarf ausreichend Zeit für die Bearbeitung der Dokumente ein.",
          "Halten Sie frühe Fristen ein, oft zwischen Dezember und Februar.",
        ],
      },
      {
        title: "4) Vervollständigen Sie LL.M",
        subtitle: "Wählen Sie gegebenenfalls Kurse aus, die die Anwaltsberechtigung unterstützen.",
        content: [
          "Wählen Sie Kurse aus, die mit den Anforderungen der Zielgerichtsbarkeit kompatibel sind.",
          "Verwalten Sie Versicherungen, Visa, Registrierung und zusätzliche Kosten.",
          "Bewahren Sie Lehrpläne, Kreditunterlagen und offizielle Zertifikate auf.",
        ],
      },
      {
        title: "5) Bereiten Sie sich auf das bar exam vor",
        subtitle:
          "Ein spezielles Vorbereitungsprogramm oder ein zusätzliches Semester kann hilfreich sein.",
        content: [
          "Bestätigen Sie die genauen Kredit-, Kurs- und Zeitanforderungen.",
          "Planen Sie die Barvorbereitung, den Zeitplan, das Budget und die Logistik.",
          "Reichen Sie den Zulassungsantrag gemäß den Regeln der Zieljurisdiktion ein.",
        ],
      },
    ],
  },
} as const

export function UsLawyerPath({ className }: { className?: string }) {
  const { language } = useLanguage()
  const t = guideCopy[language]
  const [openIndex, setOpenIndex] = React.useState<number>(0)

  return (
    <section className={cn("mt-16", className)} aria-label={t.aria}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs font-medium tracking-wide text-muted-foreground">
            {t.eyebrow}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {t.steps.map((step, idx) => {
            const open = idx === openIndex
            return (
              <Card
                key={step.title}
                className={cn(
                  "transition-[border-color,box-shadow,transform]",
                  open ? "border-primary/25" : "",
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
                      <div className="text-sm text-muted-foreground">
                        {step.subtitle}
                      </div>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 text-muted-foreground">
                      <span className="hidden text-xs sm:inline">
                        {open ? t.collapse : t.details}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          open ? "rotate-180" : "rotate-0",
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </CardHeader>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <CardContent className="pt-0">
                      <div className="grid gap-2">
                        {step.content.map((line) => (
                          <div
                            key={line}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 text-primary"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </div>
                        ))}
                        {"footnote" in step && step.footnote ? (
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
