import { Badge } from "@/components/ui/badge"
import type { ReliabilityStatus } from "@/lib/types"
import { reliabilityCopy, type UiLanguage } from "@/lib/text-utils"

const variants: Record<
  ReliabilityStatus,
  "default" | "secondary" | "muted" | "outline"
> = {
  confirmed: "default",
  to_confirm: "secondary",
  incomplete: "muted"
}

export function ReliabilityBadge({
  status,
  sourceType,
  language = "fr"
}: {
  status: ReliabilityStatus
  sourceType?: string
  language?: UiLanguage
}) {
  const isRecentStudent = (sourceType || "").includes("recent_student_confirmation")
  const item = reliabilityCopy[language][status]

  if (status === "confirmed" && isRecentStudent) {
    return (
      <Badge variant="outline">
        {item.label}
        {language === "fr"
          ? " (retour étudiant récent)"
          : language === "en"
            ? " (recent student feedback)"
            : " (testimonio reciente)"}
      </Badge>
    )
  }

  return <Badge variant={variants[status]}>{item.label}</Badge>
}
