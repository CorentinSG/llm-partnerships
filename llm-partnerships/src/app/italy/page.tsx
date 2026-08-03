import type { Metadata } from "next"

import { ItalyHomePage } from "@/components/pages/italy-home-page"

export const metadata: Metadata = {
  title: "Italy–United States LL.M Partnerships",
  description:
    "Explore verified LL.M pathways between Italian universities and U.S. law schools.",
}

export default function ItalyPage() {
  return <ItalyHomePage />
}
