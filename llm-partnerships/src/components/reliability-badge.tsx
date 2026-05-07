import { Badge } from "@/components/ui/badge"
import type { ReliabilityStatus } from "@/lib/types"

const map: Record<
  ReliabilityStatus,
  { label: string; variant: "default" | "secondary" | "muted" | "outline" }
> = {
  confirmed: { label: "Confirmé", variant: "default" },
  to_confirm: { label: "À confirmer", variant: "secondary" },
  incomplete: { label: "Information incomplète", variant: "muted" }
}

export function ReliabilityBadge({ status }: { status: ReliabilityStatus }) {
  const item = map[status]
  return <Badge variant={item.variant}>{item.label}</Badge>
}

