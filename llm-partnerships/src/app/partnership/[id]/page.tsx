import { notFound } from "next/navigation"

import { PartnershipDetailPage as PartnershipDetailContent } from "@/components/pages/partnership-detail-page"
import { getAnyPartnershipById } from "@/lib/data"
import { getGermanPartnershipById } from "@/lib/germany-data"
import { getItalianPartnershipById } from "@/lib/italy-data"
import { getUkPartnershipById } from "@/lib/uk-data"
import { getSwissPartnershipById } from "@/lib/switzerland-data"

export default async function PartnershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partnership =
    getAnyPartnershipById(id) ??
    getItalianPartnershipById(id) ??
    getUkPartnershipById(id) ??
    getSwissPartnershipById(id)
  if (!partnership) notFound()

  return (
    <PartnershipDetailContent
      partnership={partnership}
      origin={
        getGermanPartnershipById(id)
          ? "germany"
          : getItalianPartnershipById(id)
            ? "italy"
            : getUkPartnershipById(id)
              ? "uk"
              : getSwissPartnershipById(id)
                ? "switzerland"
                : "france"
      }
    />
  )
}
