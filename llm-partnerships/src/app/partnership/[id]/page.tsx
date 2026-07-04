import { notFound } from "next/navigation"

import { PartnershipDetailPage as PartnershipDetailContent } from "@/components/pages/partnership-detail-page"
import { getPartnershipById } from "@/lib/data"

export default async function PartnershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partnership = getPartnershipById(id)
  if (!partnership) notFound()

  return <PartnershipDetailContent partnership={partnership} />
}
