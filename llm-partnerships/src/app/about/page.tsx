import { PageShell } from "@/components/page-shell"

export default function AboutPage() {
  return (
    <PageShell
      title="À propos"
      description="Objectif du projet et comment contribuer."
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Ce projet vise à rendre les informations sur les partenariats LL.M
          faciles à trouver, comparer et vérifier pour les étudiants en droit.
        </p>
        <p>
          <strong>Périmètre actuel :</strong> le site est, pour le moment,
          destiné aux partenariats entre universités françaises et{" "}
          <strong>universités américaines</strong> pour des LL.M. L’objectif est
          de centraliser une information aujourd’hui dispersée, difficile à
          comparer, et parfois peu explicitée.
        </p>
        <p>
          Un LL.M aux États-Unis étant généralement très coûteux, les
          partenariats (places réservées, réductions, traitement préférentiel,
          etc.) peuvent constituer une voie plus accessible. Pour certains
          profils, ils peuvent aussi s’inscrire dans un projet de passage du
          barreau dans un État américain.
        </p>
        <p>
          Principe central : ne jamais inventer. Si une information n’est pas
          disponible via une source fiable, elle est affichée{" "}
          <strong>« Non communiqué »</strong>. Si elle semble probable mais non
          vérifiée, elle est marquée <strong>« À confirmer »</strong>. Si trop
          d’éléments manquent, l’entrée est{" "}
          <strong>« Information incomplète »</strong>.
        </p>
        <p>
          Étudiants, équipes pédagogiques ou universités peuvent proposer des
          sources et corrections via la page « Proposer une info ».
        </p>
      </div>
    </PageShell>
  )
}
