"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown, GraduationCap, Scale, UserRound } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type FaqItem = {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "Comment es-tu devenu avocat à New York ?",
    answer:
      "J’ai fait une licence de droit à Nancy, un Erasmus en Suède en L3, un M1 Droit des affaires à Nancy, puis un M2 Droit des affaires internationales à Paris Dauphine avec un Erasmus à Tilburg aux Pays-Bas. J’ai ensuite effectué un LL.M. à Case Western Reserve University grâce à un partenariat avec Dauphine. Après cela, j’ai passé le barreau de New York, que j’ai réussi à la deuxième tentative, et je suis aujourd’hui avocat à New York.",
  },
  {
    question: "Est-ce qu’un LL.M. suffit pour passer le barreau de New York ?",
    answer:
      "Pour un juriste français, le LL.M. doit en général s’ajouter à une formation juridique complète dans le pays d’origine. En pratique, la plupart des candidats français ont au minimum un M1, et souvent un M2, avant le LL.M. Il faut toujours vérifier son éligibilité directement auprès du New York Board of Law Examiners.",
  },
  {
    question: "Faut-il faire un JD ou un LL.M. ?",
    answer:
      "Le JD est la voie la plus solide pour faire carrière aux États-Unis, car c’est le diplôme américain classique. Le LL.M. est plus court et moins coûteux. Si l’objectif est la Big Law américaine, le JD est souvent préférable. Si l’objectif est d’obtenir rapidement le barreau de New York à un coût plus raisonnable, le LL.M. est une excellente option.",
  },
  {
    question: "Est-ce que les LL.M. sont très sélectifs ?",
    answer:
      "Cela dépend énormément des universités. Les notes comptent, mais aussi la motivation, la cohérence du projet, les expériences internationales, le niveau d’anglais et le dossier global. Si l’on est prêt à payer le plein tarif, beaucoup de LL.M. sont plus accessibles qu’on ne l’imagine.",
  },
  {
    question: "Comment réduire le coût d’un LL.M. ?",
    answer:
      "La meilleure solution est souvent de passer par un partenariat entre une université française et une université américaine. Il existe aussi des bourses universitaires, des aides externes comme Fulbright et parfois des exonérations partielles ou totales des frais d’inscription.",
  },
  {
    question:
      "Est-ce difficile de trouver un travail aux États-Unis après le LL.M. et le barreau ?",
    answer:
      "Oui, c’est probablement l’une des parties les plus difficiles du parcours. Il faut énormément networker, participer à des événements, parler à beaucoup de personnes, utiliser LinkedIn et saisir les opportunités lorsqu’elles se présentent. Les questions de visa ajoutent également une difficulté supplémentaire.",
  },
  {
    question:
      "Peut-on faire un stage dans un cabinet américain avec un parcours de droit français ?",
    answer:
      "C’est très compliqué, surtout en licence ou en début de cursus. Les cabinets américains recrutent principalement des étudiants formés en droit américain, ou des profils très ciblés déjà avancés dans leur projet américain.",
  },
  {
    question:
      "Faut-il passer le barreau français avant ou après le barreau de New York ?",
    answer:
      "Si l’objectif principal est New York, il est souvent plus simple de faire M2, LL.M., barreau de New York puis éventuellement l’examen de l’article 100 pour exercer en France. Cela évite les difficultés d’articulation entre le CRFPA, l’école d’avocats, le LL.M. et le barreau américain.",
  },
  {
    question: "Peut-on partir aux États-Unis directement après la licence ?",
    answer:
      "C’est possible dans certains cas, notamment pour certains JD. En revanche, pour viser le barreau de New York via un LL.M., il est généralement préférable d’avoir une formation juridique complète en France, donc au moins un M1 et souvent un M2.",
  },
  {
    question: "Quels masters choisir si l’on vise les États-Unis ?",
    answer:
      "Le plus important est de choisir un bon master cohérent avec son projet et, si possible, un master qui dispose de partenariats LL.M. avec des universités américaines. La cohérence du parcours compte davantage que le seul nom du master.",
  },
  {
    question:
      "Comment est-ce possible de partir en LL.M. via un partenariat alors qu’on n’est plus étudiant de l’université française une fois aux États-Unis ?",
    answer:
      "La sélection a généralement lieu pendant le M2, ou avant l’obtention du diplôme. L’université française désigne ensuite les étudiants retenus auprès de l’université américaine partenaire. Même si le diplôme français est terminé au moment du départ, le bénéfice du partenariat a été acquis pendant la scolarité.",
  },
  {
    question:
      "Comment se déroulent les sélections pour les LL.M. dans le cadre des partenariats entre universités françaises et américaines ?",
    answer:
      "Cela dépend beaucoup des universités et du partenariat concerné. Certaines universités françaises organisent une présélection interne puis transmettent les candidatures retenues à l’université américaine. D’autres demandent une candidature directe auprès de l’université partenaire, parfois via LSAC. Les critères portent souvent sur les notes, le niveau d’anglais, la motivation, la cohérence du projet, les expériences internationales et parfois un entretien.",
  },
  {
    question: "Quels sont les moyens de faire un LL.M. aux États-Unis ?",
    answer:
      "Il existe principalement trois voies : les partenariats entre universités françaises et américaines, les candidatures directes auprès des universités américaines, et, pour certaines écoles, la plateforme LSAC qui centralise une partie du dossier. Chaque voie a ses avantages en coût, sélectivité et démarches administratives.",
  },
  {
    question: "Quel niveau d’anglais faut-il avoir pour réussir un LL.M. ?",
    answer:
      "Il faut un bon niveau d’anglais, mais pas nécessairement être bilingue. Les universités demandent généralement un score TOEFL ou IELTS. Beaucoup d’étudiants français arrivent avec un bon niveau académique sans être parfaitement bilingues et progressent très vite sur place.",
  },
  {
    question: "Le barreau de New York est-il difficile ?",
    answer:
      "Oui, c’est un vrai examen exigeant. Le LL.M. lui-même est souvent plus accessible que le bar exam, qui demande plusieurs mois de préparation intensive. Cela dit, malgré sa réputation, le barreau de New York est souvent perçu par les candidats français comme plus lisible que le barreau de Paris : deux sessions par an, pas d’oral, pas d’école d’avocats d’un an et demi après l’examen.",
  },
  {
    question:
      "Combien de temps à l’avance faut-il préparer sa candidature au LL.M. ?",
    answer:
      "Idéalement, il faut commencer à s’y intéresser entre 8 et 12 mois avant le départ. Cela laisse le temps de préparer les tests d’anglais, les lettres de recommandation, les dossiers, les bourses et les éventuels partenariats.",
  },
  {
    question:
      "Existe-t-il une école d’avocats après avoir réussi le barreau de New York ?",
    answer:
      "Non. Contrairement à la France, il n’existe pas d’équivalent de l’école d’avocats. Une fois l’examen réussi et les autres conditions remplies — MPRE, Character and Fitness, serment — on peut être admis au barreau.",
  },
  {
    question:
      "Peut-on exercer dans les autres États après avoir passé le barreau de New York ?",
    answer:
      "Pas automatiquement. Chaque État a ses propres règles. Certains permettent de transférer le score UBE, d’autres imposent un nouvel examen ou des conditions complémentaires. Il faut vérifier État par État.",
  },
  {
    question:
      "Existe-t-il une équivalence pour devenir avocat en France après avoir obtenu le barreau de New York ?",
    answer:
      "Oui. Un avocat inscrit à New York peut passer l’examen prévu par l’article 100 pour accéder au barreau français. Ce n’est pas une équivalence automatique, mais une passerelle spécifique réservée aux avocats étrangers.",
  },
  {
    question:
      "Est-il possible d’obtenir un visa et de rester travailler aux États-Unis après le LL.M. et le barreau ?",
    answer:
      "Oui, mais rien n’est jamais garanti. Obtenir un emploi ne suffit pas : il faut aussi une solution de visa adaptée. Les questions d’immigration sont souvent l’un des principaux défis du projet américain.",
  },
  {
    question: "Comment concrètement se déroule le barreau de New York ?",
    answer:
      "Le parcours se déroule en plusieurs étapes. Il faut d’abord vérifier son éligibilité auprès du New York Board of Law Examiners. Pour les juristes français, cela passe souvent par un LL.M. américain répondant à certaines exigences académiques. Ensuite vient la préparation de l’examen, souvent entre 2 et 4 mois à temps plein avec des organismes comme Barbri ou Themis, auxquels beaucoup ajoutent Adaptibar pour le MBE. L’examen dure deux jours : le premier pour les essays (MEE) et les exercices pratiques (MPT), le second pour le MBE, un QCM de 200 questions. Après la réussite, il faut aussi valider le MPRE, suivre le NYLC, réussir le NYLE, puis déposer le dossier de Character and Fitness avant de prêter serment et d’être officiellement admis au barreau.",
  },
]

export function FounderFaq() {
  const [openIndex, setOpenIndex] = React.useState<number>(0)

  return (
    <section
      className="relative mt-12 overflow-hidden rounded-[28px] border bg-card/72 px-4 py-8 shadow-[0_28px_90px_-62px_hsl(var(--primary)/0.72)] sm:px-6 lg:px-8"
      aria-label="FAQ sur le parcours LL.M et New York Bar"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(620px_360px_at_82%_4%,hsl(var(--accent)/0.18),transparent_64%),linear-gradient(135deg,hsl(var(--card)/0.97),hsl(var(--secondary)/0.78))]" />
        <div className="absolute -right-16 -top-12 h-[460px] w-[118%] opacity-80 [mask-image:radial-gradient(ellipse_at_68%_22%,black_0%,black_38%,transparent_72%)] sm:-right-4 sm:h-[520px] sm:w-[min(58vw,600px)] sm:min-w-[380px] sm:opacity-55 sm:[mask-image:radial-gradient(ellipse_at_center,black_0%,black_44%,transparent_74%)] lg:-right-2">
          <Image
            src="/images/corentin-faq-background.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 600px, 118vw"
            className="object-cover object-[58%_4%] opacity-[0.34] grayscale contrast-125 saturate-50 dark:opacity-[0.48] sm:opacity-[0.26] sm:dark:opacity-[0.36]"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--card)/0.62)_0%,hsl(var(--card)/0.88)_38%,hsl(var(--card)/0.98)_72%)] sm:bg-[linear-gradient(90deg,hsl(var(--card)/0.98)_0%,hsl(var(--card)/0.91)_42%,hsl(var(--card)/0.62)_100%)] dark:bg-[linear-gradient(180deg,hsl(var(--card)/0.46)_0%,hsl(var(--card)/0.78)_38%,hsl(var(--card)/0.96)_72%)] sm:dark:bg-[linear-gradient(90deg,hsl(var(--card)/0.96)_0%,hsl(var(--card)/0.84)_46%,hsl(var(--card)/0.34)_100%)]" />
        <div className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(420px_420px_at_78%_4%,transparent_0%,hsl(var(--card)/0.08)_42%,hsl(var(--card)/0.78)_100%)] sm:w-[58%] sm:bg-[radial-gradient(440px_540px_at_70%_34%,transparent_0%,hsl(var(--card)/0.28)_58%,hsl(var(--card)/0.82)_100%)]" />
      </div>

      <div className="relative space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            FAQ — Corentin Saint-Girons
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions fréquentes sur mon parcours, le LL.M. et le New York Bar
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Cette FAQ répond aux questions que l’on me pose le plus souvent sur
            mon parcours, les LL.M. américains, le coût, la sélection et le
            barreau de New York.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass-panel rounded-3xl border-white/20 bg-card/84 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                Mon parcours en bref
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>
                Licence de droit à Nancy, Erasmus en Suède en L3, M1 Droit des
                affaires à Nancy, puis M2 Droit des affaires internationales à
                Paris Dauphine avec un Erasmus à Tilburg.
              </p>
              <p>
                J’ai ensuite effectué un LL.M. à Case Western Reserve University
                grâce à un partenariat avec Dauphine, puis passé le barreau de
                New York.
              </p>
              <p>
                Aujourd’hui, je suis avocat à New York — et ce site a été créé
                pour rendre ce parcours plus lisible pour les étudiants en droit
                français.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel rounded-3xl border-white/20 bg-card/84 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
                FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index

                return (
                  <div
                    key={item.question}
                    className="rounded-2xl border bg-background/60 transition-colors"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    >
                      <span className="text-sm font-medium leading-6">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                          isOpen ? "rotate-180" : "rotate-0",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4 text-sm leading-7 text-muted-foreground">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
