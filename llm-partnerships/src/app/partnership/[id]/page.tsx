import Link from "next/link"
import { notFound } from "next/navigation"

import { PageShell } from "@/components/page-shell"
import { PartnershipDetails } from "@/components/partnership-details"
import { Button } from "@/components/ui/button"
import { getPartnershipById } from "@/lib/data"

export default async function PartnershipDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partnership = getPartnershipById(id)
  if (!partnership) notFound()

  return (
    <PageShell
      title={partnership.partnerUniversity}
      description={`${partnership.frenchUniversity} • ${partnership.partnerCountry}`}
      actions={
        <Button asChild variant="secondary">
          <Link href="/">Retour à la recherche</Link>
        </Button>
      }
    >
      <PartnershipDetails partnership={partnership} />
    </PageShell>
  )
}
