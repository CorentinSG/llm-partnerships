import { PageShell } from "@/components/page-shell"
import { UsLawyerPath } from "@/components/us-lawyer-path"

export default function GuidePage() {
  return (
    <PageShell
      title="Guide : devenir avocat aux États-Unis"
      description="Un parcours type (MVP) pour comprendre les étapes clés après des études de droit en France."
    >
      <UsLawyerPath className="mt-0" />
    </PageShell>
  )
}

