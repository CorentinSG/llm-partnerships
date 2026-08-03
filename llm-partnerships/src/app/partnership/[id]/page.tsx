import { notFound } from "next/navigation"

import { PartnershipDetailPage as PartnershipDetailContent } from "@/components/pages/partnership-detail-page"
import { getAnyPartnershipById } from "@/lib/data"
import { getGermanPartnershipById } from "@/lib/germany-data"
import { getItalianPartnershipById } from "@/lib/italy-data"

export default async function PartnershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partnership =
    getAnyPartnershipById(id) ?? getItalianPartnershipById(id)
  if (!partnership) notFound()

  return (
    <PartnershipDetailContent
      partnership={partnership}
      origin={
        getGermanPartnershipById(id)
          ? "germany"
          : getItalianPartnershipById(id)
            ? "italy"
            : "france"
      }
    />
  )
}
