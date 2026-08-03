import type { Metadata } from "next"
import "./globals.css"
import type { ReactNode } from "react"
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Annuaire des partenariats LL.M",
  description:
    "Cinq annuaires distincts de partenariats LL.M : France–États-Unis, Allemagne–États-Unis, Italie–États-Unis, Royaume-Uni–États-Unis et Suisse–États-Unis.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-dvh bg-background app-surface">
              <GoogleAnalytics />
              <SiteHeader />
              {children}
              <SiteFooter />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
