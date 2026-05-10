"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function GA4PageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (!measurementId) return
    if (typeof window === "undefined") return
    if (!window.gtag) return

    const search = searchParams?.toString()
    const pagePath = search ? `${pathname}?${search}` : pathname
    window.gtag("event", "page_view", { page_path: pagePath })
  }, [measurementId, pathname, searchParams])

  return null
}

