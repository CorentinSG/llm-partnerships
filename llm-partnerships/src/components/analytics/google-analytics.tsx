import * as React from "react"

import { GA4PageView } from "@/components/analytics/ga4"

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID || ""
  if (!measurementId) return null

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        id="ga4-init"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `
        }}
      />
      <React.Suspense fallback={null}>
        <GA4PageView measurementId={measurementId} />
      </React.Suspense>
    </>
  )
}
