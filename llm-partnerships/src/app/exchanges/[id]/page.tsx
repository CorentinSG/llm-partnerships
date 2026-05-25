import { notFound } from "next/navigation"

import { ExchangeDetails } from "@/components/exchange-details"
import { getExchangeById } from "@/lib/exchanges"

export default function Page({ params }: { params: { id: string } }) {
  const item = getExchangeById(decodeURIComponent(params.id))
  if (!item) return notFound()
  return <ExchangeDetails item={item} />
}

