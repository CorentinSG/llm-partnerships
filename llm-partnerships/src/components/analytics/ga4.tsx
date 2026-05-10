"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function GA4PageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()

  React.useEffect(() => {
    if (!measurementId) return
    if (typeof window === "undefined") return
    if (!window.gtag) return

    window.gtag("event", "page_view", { page_path: pathname })
  }, [measurementId, pathname])

  return null
}
