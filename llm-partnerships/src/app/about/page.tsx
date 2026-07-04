"use client"

import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"

const copy = {
  fr: {
    title: "À propos",
    description: "Objectif du projet et comment contribuer.",
    paragraphs: [
      "Ce projet vise à rendre les informations sur les partenariats LL.M faciles à trouver, comparer et vérifier pour les étudiants en droit.",
      "Périmètre actuel : le site est consacré aux partenariats entre universités françaises et universités américaines pour des LL.M. L’objectif est de centraliser une information aujourd’hui dispersée, difficile à comparer et parfois peu explicitée.",
      "Un LL.M aux États-Unis étant généralement très coûteux, les partenariats (places réservées, réductions, traitement préférentiel, etc.) peuvent constituer une voie plus accessible. Pour certains profils, ils peuvent aussi s’inscrire dans un projet de passage du barreau dans un État américain.",
      "Principe central : ne jamais inventer. Une information absente d’une source fiable est indiquée comme non communiquée. Une information probable mais non vérifiée est marquée à confirmer. Une entrée trop lacunaire est signalée comme information incomplète.",
      "Étudiants, équipes pédagogiques et universités peuvent proposer des sources ou corrections via la page « Proposer une information ».",
    ],
  },
  en: {
    title: "About",
    description: "The project’s purpose and how to contribute.",
    paragraphs: [
      "This project makes LL.M partnership information easier for law students to find, compare, and verify.",
      "Current scope: partnerships between French universities and U.S. universities for LL.M programs. The aim is to centralize information that is currently scattered, difficult to compare, and often poorly explained.",
      "Because a U.S. LL.M is usually very expensive, partnerships offering reserved seats, tuition reductions, or preferential treatment can provide a more accessible route. For some students, they can also support a plan to sit for a U.S. bar exam.",
      "Core principle: never invent information. Missing reliable information is marked as not disclosed. Probable but unverified information is marked for confirmation. Entries with too many missing elements are marked incomplete.",
      "Students, academic teams, and universities can submit sources or corrections through the “Submit information” page.",
    ],
  },
  es: {
    title: "Acerca del proyecto",
    description: "Objetivo del proyecto y cómo contribuir.",
    paragraphs: [
      "Este proyecto facilita a los estudiantes de derecho la búsqueda, comparación y verificación de información sobre convenios LL.M.",
      "Alcance actual: convenios entre universidades francesas y estadounidenses para programas LL.M. El objetivo es centralizar información actualmente dispersa, difícil de comparar y a menudo poco explicada.",
      "Como un LL.M en Estados Unidos suele ser muy costoso, los convenios con plazas reservadas, reducciones de matrícula o trato preferente pueden ofrecer una vía más accesible. Para algunos perfiles, también pueden formar parte de un proyecto para presentarse a un bar exam estadounidense.",
      "Principio central: nunca inventar información. Los datos sin fuente fiable se indican como no comunicados. La información probable pero no verificada se marca por confirmar. Las entradas con demasiados datos ausentes se señalan como incompletas.",
      "Estudiantes, equipos académicos y universidades pueden enviar fuentes o correcciones desde la página «Proponer información».",
    ],
  },
} as const

export default function AboutPage() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <PageShell title={t.title} description={t.description}>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {t.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </PageShell>
  )
}
