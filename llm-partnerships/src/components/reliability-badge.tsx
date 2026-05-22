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

export function ReliabilityBadge({
  status,
  sourceType
}: {
  status: ReliabilityStatus
  sourceType?: string
}) {
  const isRecentStudent = (sourceType || "").includes("recent_student_confirmation")
  const item = map[status]
  if (status === "confirmed" && isRecentStudent) {
    return <Badge variant="outline">Confirmé (retour étudiant récent)</Badge>
  }
  return <Badge variant={item.variant}>{item.label}</Badge>
}
