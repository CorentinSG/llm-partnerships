import type { Metadata } from "next"

import { GermanyHomePage } from "@/components/pages/germany-home-page"

export const metadata: Metadata = {
  title: "German–U.S. LL.M. partnerships",
  description:
    "Search and compare LL.M. pathways between German universities and U.S. law schools.",
}

export default function GermanyPage() {
  return <GermanyHomePage />
}
