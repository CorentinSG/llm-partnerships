import type { Metadata } from "next"

import { UkHomePage } from "@/components/pages/uk-home-page"

export const metadata: Metadata = {
  title: "United Kingdom–United States LL.M Partnerships",
  description:
    "Explore verified LL.M pathways between UK universities and U.S. law schools.",
}

export default function UkPage() {
  return <UkHomePage />
}
