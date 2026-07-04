"use client"

import * as React from "react"
import { ChevronDown, GraduationCap, Scale, UserRound } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type FaqItem = {
  question: string
  answer: string
}

const faqItemsFr: FaqItem[] = [
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

const questionsEn = [
  "How did you become a lawyer in New York?",
  "Is an LL.M enough to sit for the New York Bar?",
  "Should I pursue a JD or an LL.M?",
  "Are LL.M programs highly selective?",
  "How can I reduce the cost of an LL.M?",
  "Is it difficult to find work in the U.S. after the LL.M and bar exam?",
  "Can a French law student intern at a U.S. law firm?",
  "Should I take the French or New York bar first?",
  "Can I move to the U.S. directly after a French bachelor’s degree?",
  "Which master’s degree should I choose for a U.S. project?",
  "How can a partnership apply after I leave the French university?",
  "How are partnership LL.M applicants selected?",
  "What are the main ways to pursue a U.S. LL.M?",
  "What English level is required for an LL.M?",
  "Is the New York Bar difficult?",
  "How early should I prepare an LL.M application?",
  "Is there a professional school after passing the New York Bar?",
  "Can I practice in other states after passing the New York Bar?",
  "Can a New York lawyer qualify in France?",
  "Can I obtain a visa and remain in the U.S. after the LL.M?",
  "What are the concrete steps of the New York Bar process?",
]

const answersEn = [
  "I studied law in Nancy, completed exchanges in Sweden and the Netherlands, earned an M2 at Paris Dauphine, then completed an LL.M at Case Western Reserve through Dauphine’s partnership. I passed the New York Bar on my second attempt and now practice in New York.",
  "Usually not by itself. A French applicant generally needs a complete prior legal education plus a qualifying U.S. LL.M. Eligibility must always be confirmed with the New York Board of Law Examiners.",
  "The JD is the standard U.S. degree and strongest route for a long-term U.S. career. The LL.M is shorter and less expensive, and can be a good route to New York Bar eligibility.",
  "It depends on the university. Grades matter, but so do motivation, project consistency, international experience, English, and the overall application.",
  "University partnerships are often the best option. University scholarships, Fulbright support, and partial or full tuition waivers may also be available.",
  "Yes. Networking, events, LinkedIn, and sustained outreach are essential. Immigration and visa constraints create an additional challenge.",
  "It is difficult, especially early in a French law degree. U.S. firms mainly recruit students trained in U.S. law or profiles already advanced in a U.S. qualification plan.",
  "If New York is the main objective, one possible sequence is M2, LL.M, New York Bar, then the French Article 100 examination if desired.",
  "It can be possible for some JD programs. For New York eligibility through an LL.M, completing at least an M1 and often an M2 in France is usually safer.",
  "Choose a strong degree aligned with your project, ideally one offering U.S. LL.M partnerships. Overall consistency matters more than the degree title alone.",
  "Selection usually occurs during the M2. The French university nominates selected students before graduation, so the partnership benefit is secured while they are still enrolled.",
  "Some universities run an internal preselection; others require a direct or LSAC application. Criteria often include grades, English, motivation, international experience, and interviews.",
  "The main routes are university partnerships, direct applications to U.S. universities, and LSAC-based applications where required.",
  "A strong academic level is needed, usually demonstrated through TOEFL or IELTS. Perfect bilingual fluency is not required, and students improve quickly on site.",
  "Yes. It requires several months of intensive preparation. The LL.M itself is often less difficult than the bar examination.",
  "Start 8 to 12 months before departure to prepare language tests, recommendations, applications, scholarships, and partnership procedures.",
  "No. Once the exam and other requirements such as MPRE and Character and Fitness are completed, applicants can be admitted without a French-style professional school.",
  "Not automatically. Each state has its own rules. Some accept UBE score transfers, while others require another exam or additional conditions.",
  "A New York lawyer may use the French Article 100 examination route. It is a specific pathway, not an automatic equivalence.",
  "It is possible but never guaranteed. A job offer and an appropriate immigration route are both necessary.",
  "First confirm eligibility. Then prepare for the two-day exam, complete the MPRE, NYLC and NYLE, submit Character and Fitness materials, and take the oath after approval.",
]

const questionsEs = [
  "¿Cómo te convertiste en abogado en Nueva York?",
  "¿Basta un LL.M para presentarse al New York Bar?",
  "¿Es mejor un JD o un LL.M?",
  "¿Son muy selectivos los programas LL.M?",
  "¿Cómo reducir el coste de un LL.M?",
  "¿Es difícil encontrar trabajo en EE. UU. después del LL.M y el bar exam?",
  "¿Puede un estudiante francés hacer prácticas en un despacho estadounidense?",
  "¿Conviene pasar primero el examen francés o el de Nueva York?",
  "¿Se puede ir a EE. UU. directamente después de la licence?",
  "¿Qué máster elegir para un proyecto estadounidense?",
  "¿Cómo funciona el convenio después de dejar la universidad francesa?",
  "¿Cómo se seleccionan los candidatos de convenios LL.M?",
  "¿Cuáles son las vías principales para hacer un LL.M?",
  "¿Qué nivel de inglés se necesita?",
  "¿Es difícil el New York Bar?",
  "¿Con cuánta antelación hay que preparar la candidatura?",
  "¿Existe una escuela profesional después del New York Bar?",
  "¿Se puede ejercer en otros estados con el New York Bar?",
  "¿Puede un abogado de Nueva York ejercer en Francia?",
  "¿Se puede obtener una visa y quedarse después del LL.M?",
  "¿Cuáles son las etapas concretas del New York Bar?",
]

const answersEs = [
  "Estudié derecho en Nancy, hice intercambios en Suecia y Países Bajos, un M2 en Paris Dauphine y un LL.M en Case Western Reserve mediante el convenio de Dauphine. Aprobé el New York Bar en el segundo intento y hoy ejerzo en Nueva York.",
  "Normalmente no basta por sí solo. Un candidato francés suele necesitar estudios jurídicos completos y un LL.M estadounidense que cumpla las reglas. Hay que confirmar la elegibilidad con el New York Board of Law Examiners.",
  "El JD es el título estadounidense estándar y la vía más sólida para una carrera duradera. El LL.M es más corto y económico, y puede permitir acceder al New York Bar.",
  "Depende de la universidad. Importan las notas, la motivación, la coherencia del proyecto, la experiencia internacional y el nivel de inglés.",
  "Los convenios universitarios suelen ser la mejor opción. También existen becas universitarias, Fulbright y exenciones parciales o totales.",
  "Sí. Es esencial hacer networking, asistir a eventos, usar LinkedIn y mantener contactos. Las restricciones de visa añaden dificultad.",
  "Es complicado, especialmente al inicio de los estudios. Los despachos reclutan principalmente estudiantes formados en derecho estadounidense.",
  "Si Nueva York es el objetivo principal, una secuencia posible es M2, LL.M, New York Bar y después el examen francés del artículo 100.",
  "Puede ser posible para ciertos JD. Para acceder al New York Bar mediante un LL.M suele ser más seguro completar al menos un M1 y, a menudo, un M2.",
  "Elige un buen máster coherente con el proyecto y, si es posible, con convenios LL.M estadounidenses. La coherencia global importa más que el nombre.",
  "La selección suele realizarse durante el M2. La universidad francesa designa a los estudiantes antes de la graduación.",
  "Algunas universidades hacen preselección interna; otras exigen candidatura directa o mediante LSAC. Se valoran notas, inglés, motivación y experiencia.",
  "Las vías principales son los convenios, la candidatura directa y LSAC cuando la universidad lo exige.",
  "Se necesita un buen nivel académico, normalmente acreditado por TOEFL o IELTS. No es imprescindible ser bilingüe.",
  "Sí. Requiere varios meses de preparación intensiva y suele ser más difícil que el propio LL.M.",
  "Conviene empezar entre 8 y 12 meses antes para preparar idioma, recomendaciones, expedientes, becas y convenios.",
  "No. Tras aprobar el examen y completar MPRE, Character and Fitness y los demás requisitos, se puede solicitar la admisión.",
  "No automáticamente. Cada estado tiene sus reglas; algunos aceptan transferencias UBE y otros exigen otro examen.",
  "Un abogado de Nueva York puede utilizar la vía del examen francés del artículo 100. No es una equivalencia automática.",
  "Es posible, pero nunca está garantizado. Se necesita tanto un empleo como una vía migratoria adecuada.",
  "Primero se verifica la elegibilidad. Después se prepara el examen de dos días, se completan MPRE, NYLC y NYLE, Character and Fitness y finalmente el juramento.",
]

const faqCopy = {
  fr: {
    aria: "FAQ sur le parcours LL.M et New York Bar",
    title: "Questions fréquentes sur mon parcours, le LL.M. et le New York Bar",
    intro:
      "Cette FAQ répond aux questions que l’on me pose le plus souvent sur mon parcours, les LL.M. américains, le coût, la sélection et le barreau de New York.",
    journey: "Mon parcours en bref",
    journeyParagraphs: [
      "Licence de droit à Nancy, Erasmus en Suède en L3, M1 Droit des affaires à Nancy, puis M2 Droit des affaires internationales à Paris Dauphine avec un Erasmus à Tilburg.",
      "J’ai ensuite effectué un LL.M. à Case Western Reserve University grâce à un partenariat avec Dauphine, puis passé le barreau de New York.",
      "Aujourd’hui, je suis avocat à New York et ce site a été créé pour rendre ce parcours plus lisible pour les étudiants en droit français.",
    ],
    items: faqItemsFr,
  },
  en: {
    aria: "FAQ about LL.M pathways and the New York Bar",
    title: "Frequently asked questions about my path, the LL.M, and New York",
    intro:
      "Answers to common questions about my background, U.S. LL.M programs, cost, selection, and the New York Bar.",
    journey: "My path at a glance",
    journeyParagraphs: [
      "Law degree in Nancy, Erasmus in Sweden, business law studies in Nancy, then an international business law M2 at Paris Dauphine with an exchange in Tilburg.",
      "I then completed an LL.M at Case Western Reserve University through Dauphine’s partnership and passed the New York Bar.",
      "I now practice in New York and created this website to make the path clearer for French law students.",
    ],
    items: questionsEn.map((question, index) => ({
      question,
      answer: answersEn[index],
    })),
  },
  es: {
    aria: "Preguntas sobre LL.M y el New York Bar",
    title: "Preguntas frecuentes sobre mi recorrido, el LL.M y Nueva York",
    intro:
      "Respuestas a preguntas habituales sobre mi experiencia, los LL.M estadounidenses, el coste, la selección y el New York Bar.",
    journey: "Mi recorrido en breve",
    journeyParagraphs: [
      "Estudios de derecho en Nancy, Erasmus en Suecia, derecho empresarial en Nancy y un M2 de derecho empresarial internacional en Paris Dauphine con intercambio en Tilburg.",
      "Después cursé un LL.M en Case Western Reserve University mediante el convenio de Dauphine y aprobé el New York Bar.",
      "Hoy ejerzo en Nueva York y creé este sitio para facilitar este recorrido a los estudiantes franceses.",
    ],
    items: questionsEs.map((question, index) => ({
      question,
      answer: answersEs[index],
    })),
  },
} as const

export function FounderFaq() {
  const { language } = useLanguage()
  const t = faqCopy[language]
  const [openIndex, setOpenIndex] = React.useState<number>(0)

  return (
    <section
      id="faq"
      className="relative mt-12 scroll-mt-24 overflow-hidden rounded-[28px] border bg-card/72 px-4 py-8 shadow-[0_28px_90px_-62px_hsl(var(--primary)/0.72)] sm:px-6 lg:px-8"
      aria-label={t.aria}
    >
      <div className="relative space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            FAQ — Corentin Saint-Girons
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t.intro}
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
                {t.journey}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              {t.journeyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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
              {t.items.map((item, index) => {
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
