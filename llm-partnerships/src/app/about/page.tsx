"use client"

import { useLanguage } from "@/components/language-provider"
import { PageShell } from "@/components/page-shell"

const copy = {
  fr: {
    title: "À propos",
    description: "Objectif du projet et comment contribuer.",
    paragraphs: [
      "Ce projet vise à rendre les informations sur les partenariats LL.M faciles à trouver, comparer et vérifier pour les étudiants en droit.",
      "Le site comprend trois annuaires distincts de partenariats LL.M : France–États-Unis, Allemagne–États-Unis et Italie–États-Unis.",
      "La section France–États-Unis est consacrée aux partenariats entre universités françaises et universités américaines pour des LL.M. L’objectif est de centraliser une information aujourd’hui dispersée, difficile à comparer et parfois peu explicitée.",
      "La section Allemagne–États-Unis recense de la même façon les partenariats entre universités allemandes et universités américaines pour des LL.M.",
      "La section Italie–États-Unis présente selon le même principe les parcours LL.M entre universités italiennes et law schools américaines.",
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
      "The site contains three separate LL.M partnership directories: France–United States, Germany–United States, and Italy–United States.",
      "The France–U.S. section covers partnerships between French universities and U.S. universities for LL.M programs. The aim is to centralize information that is currently scattered, difficult to compare, and often poorly explained.",
      "The Germany–United States section likewise lists partnerships between German universities and U.S. universities for LL.M programs.",
      "The Italy–United States section follows the same approach for LL.M pathways between Italian universities and U.S. law schools.",
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
      "El sitio contiene tres directorios distintos de convenios LL.M: Francia–Estados Unidos, Alemania–Estados Unidos e Italia–Estados Unidos.",
      "La sección Francia–Estados Unidos está dedicada a los convenios entre universidades francesas y estadounidenses para programas LL.M. El objetivo es centralizar información actualmente dispersa, difícil de comparar y a menudo poco explicada.",
      "La sección Alemania–Estados Unidos también recopila convenios entre universidades alemanas y estadounidenses para programas LL.M.",
      "La sección Italia–Estados Unidos sigue el mismo enfoque para los itinerarios LL.M entre universidades italianas y law schools estadounidenses.",
      "Como un LL.M en Estados Unidos suele ser muy costoso, los convenios con plazas reservadas, reducciones de matrícula o trato preferente pueden ofrecer una vía más accesible. Para algunos perfiles, también pueden formar parte de un proyecto para presentarse a un bar exam estadounidense.",
      "Principio central: nunca inventar información. Los datos sin fuente fiable se indican como no comunicados. La información probable pero no verificada se marca por confirmar. Las entradas con demasiados datos ausentes se señalan como incompletas.",
      "Estudiantes, equipos académicos y universidades pueden enviar fuentes o correcciones desde la página «Proponer información».",
    ],
  },
  de: {
    title: "Über das Projekt",
    description: "Der Zweck des Projekts und wie man dazu beitragen kann.",
    paragraphs: [
      "Dieses Projekt erleichtert Jurastudenten das Auffinden, Vergleichen und Überprüfen von LL.M-Partnerschaftsinformationen.",
      "Die Website enthält drei separate LL.M-Partnerschaftsverzeichnisse: Frankreich–USA, Deutschland–USA und Italien–USA.",
      "Der Bereich Frankreich–USA behandelt LL.M.-Partnerschaften zwischen französischen und US-amerikanischen Universitäten. Ziel ist es, Informationen zu bündeln, die derzeit verstreut, schwer vergleichbar und oft unzureichend erklärt sind.",
      "In der Rubrik Deutschland–USA sind für LL.M-Programme ebenfalls Partnerschaften zwischen deutschen und US-amerikanischen Universitäten aufgeführt.",
      "Der Bereich Italien–USA folgt demselben Ansatz für LL.M.-Studienwege zwischen italienischen Universitäten und US-amerikanischen Law Schools.",
      "Da ein LL.M. in den USA meist sehr teuer ist, können Partnerschaften mit reservierten Plätzen, Studiengebührenermäßigungen oder bevorzugter Behandlung einen zugänglicheren Weg eröffnen. Für manche Studierende können sie außerdem Teil des Vorhabens sein, eine US-amerikanische Anwaltsprüfung abzulegen.",
      "Grundprinzip: Niemals Informationen erfinden. Fehlende verlässliche Informationen werden als nicht offengelegt gekennzeichnet. Wahrscheinliche, aber nicht überprüfte Informationen werden zur Bestätigung markiert. Einträge mit zu vielen fehlenden Elementen werden als unvollständig markiert.",
      "Studierende, akademische Teams und Universitäten können über die Seite „Informationen einreichen“ Quellen oder Korrekturen einreichen.",
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
