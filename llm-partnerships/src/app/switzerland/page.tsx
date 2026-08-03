import type { Metadata } from "next"

import { SwitzerlandHomePage } from "@/components/pages/switzerland-home-page"

export const metadata: Metadata = {
  title: "Switzerland–United States LL.M Partnerships",
  description: "Explore verified LL.M pathways between Swiss institutions and U.S. law schools.",
}

export default function SwitzerlandPage() {
  return <SwitzerlandHomePage />
}

