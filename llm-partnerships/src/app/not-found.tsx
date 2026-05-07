import Link from "next/link"

import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <PageShell
      title="Introuvable"
      description="Cette page n'existe pas."
      actions={
        <Button asChild variant="secondary">
          <Link href="/">Retour à l’accueil</Link>
        </Button>
      }
    >
      <div className="text-sm text-muted-foreground">
        Vérifie l’URL ou reviens à la liste.
      </div>
    </PageShell>
  )
}
