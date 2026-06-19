import { Badge } from "@/components/ui/badge"
import type { TuitionCategory } from "@/lib/types"

export function TuitionBadges({
  tuitionCategory
}: {
  tuitionCategory?: TuitionCategory | string
}) {
  if (!tuitionCategory || tuitionCategory === "Non communiqué") return null

  const labelMap: Record<string, string> = {
    "sans frais": "Sans frais",
    "frais réduits": "Frais réduits",
    "frais complets": "Frais complets",
    "bourse possible": "Bourse possible"
  }
  const label = labelMap[tuitionCategory] || tuitionCategory

  const variant =
    tuitionCategory === "sans frais"
      ? "default"
      : tuitionCategory === "frais réduits"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{label}</Badge>
}
