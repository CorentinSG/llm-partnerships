"use client"

import Image from "next/image"

import { useLanguage } from "@/components/language-provider"

const copy = {
  fr: {
    warning: "Avertissement :",
    disclaimer:
      "ce site est un MVP informatif consacré aux partenariats LL.M vers des law schools américaines. Les informations peuvent être incomplètes ou évoluer. Vérifie toujours les sources officielles (universités, LSAC, barreaux) avant toute candidature. Ce contenu ne constitue pas un conseil juridique.",
    author: "Créé par Corentin Saint-Girons, avocat au barreau de New York.",
  },
  en: {
    warning: "Disclaimer:",
    disclaimer:
      "this website is an informational MVP focused on LL.M partnerships with U.S. law schools. Information may be incomplete or change over time. Always verify official sources (universities, LSAC, bar authorities) before applying. This content is not legal advice.",
    author: "Created by Corentin Saint-Girons, New York attorney.",
  },
  es: {
    warning: "Aviso:",
    disclaimer:
      "este sitio es un MVP informativo centrado en convenios LL.M con law schools estadounidenses. La información puede estar incompleta o cambiar. Verifica siempre las fuentes oficiales (universidades, LSAC y autoridades colegiales) antes de presentar una candidatura. Este contenido no constituye asesoramiento jurídico.",
    author:
      "Creado por Corentin Saint-Girons, abogado del estado de Nueva York.",
  },
  de: {
    warning: "Haftungsausschluss:",
    disclaimer:
      "Diese Website ist ein Informations-MVP, der sich auf LL.M-Partnerschaften mit US-amerikanischen Rechtsschulen konzentriert. Informationen können unvollständig sein oder sich im Laufe der Zeit ändern. Überprüfen Sie immer offizielle Quellen (Universitäten, LSAC, Anwaltsbehörden), bevor Sie sich bewerben. Bei diesem Inhalt handelt es sich nicht um eine Rechtsberatung.",
    author: "Erstellt von Corentin Saint-Girons, New Yorker Anwalt.",
  },
  it: {
    warning: "Disclaimer:",
    disclaimer:
      "questo sito Web è un MVP informativo incentrato sulle partnership LL.M con le scuole di diritto statunitensi. Le informazioni potrebbero essere incomplete o cambiare nel tempo. Verificare sempre le fonti ufficiali (università, LSAC, autorità forensi) prima di presentare domanda. Questo contenuto non costituisce consulenza legale.",
    author: "Creato da Corentin Saint-Girons, avvocato di New York.",
  },
} as const

export function SiteFooter() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <footer className="container pb-10 pt-12">
      <div className="rounded-2xl border bg-card/82 px-5 py-4 text-xs leading-relaxed text-muted-foreground shadow-[0_1px_1px_hsl(222_47%_10%/0.04)]">
        <span className="font-medium text-foreground/80">{t.warning}</span>{" "}
        {t.disclaimer}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3 text-[11px]">
          <span className="inline-flex items-center gap-2 text-foreground/75">
            <span className="relative inline-flex h-8 w-8 shrink-0 overflow-hidden rounded-full border bg-secondary shadow-[0_0_0_1px_hsl(var(--ring)/0.08)]">
              <Image
                src="/images/corentin-faq-background.webp"
                alt=""
                fill
                loading="eager"
                sizes="32px"
                className="object-cover object-[58%_10%] grayscale"
              />
            </span>
            {t.author}
          </span>
          <span className="hidden text-muted-foreground/60 sm:inline">•</span>
          <a
            className="inline-flex min-h-10 items-center underline underline-offset-4 hover:text-foreground sm:min-h-0"
            href="https://www.instagram.com/corentin_sg/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <span className="hidden text-muted-foreground/60 sm:inline">•</span>
          <a
            className="inline-flex min-h-10 items-center underline underline-offset-4 hover:text-foreground sm:min-h-0"
            href="https://www.linkedin.com/in/corentin-saint-girons/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
