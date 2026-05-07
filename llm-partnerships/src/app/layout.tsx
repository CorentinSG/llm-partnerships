import type { Metadata } from "next"
import "./globals.css"
import type { ReactNode } from "react"
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google"

import { SiteHeader } from "@/components/site-header"

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans"
})

const serif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif"
})

export const metadata: Metadata = {
  title: "Annuaire des partenariats LL.M",
  description:
    "Un annuaire clair des partenariats LL.M entre universités françaises et universités partenaires étrangères."
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <div className="min-h-dvh bg-background">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  )
}
