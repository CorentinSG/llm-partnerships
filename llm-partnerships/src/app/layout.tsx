import type { Metadata } from "next"
import "./globals.css"
import type { ReactNode } from "react"
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google"

import { SiteHeader } from "@/components/site-header"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { ThemeProvider } from "@/components/theme-provider"

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "Annuaire des partenariats LL.M",
  description:
    "Un annuaire clair des partenariats LL.M entre universités françaises et universités partenaires étrangères."
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <ThemeProvider>
          <div className="min-h-dvh bg-background app-surface">
            <GoogleAnalytics />
            <SiteHeader />
            {children}
            <footer className="container pb-10 pt-12">
              <div className="rounded-2xl border bg-card/82 px-5 py-4 text-xs leading-relaxed text-muted-foreground shadow-[0_1px_1px_hsl(222_47%_10%/0.04)]">
                <span className="font-medium text-foreground/80">
                  Avertissement :
                </span>{" "}
                ce site est un MVP informatif (focus : partenariats LL.M vers des law
                schools américaines). Les informations peuvent être incomplètes ou
                évoluer. Vérifie toujours les sources officielles (universités, LSAC,
                barreaux) avant toute candidature. Ce contenu ne constitue pas un
                conseil juridique.

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-[11px]">
                  <span className="text-foreground/75">
                    Créé par Corentin Saint‑Girons, avocat au barreau de New York.
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                  <a
                    className="underline underline-offset-4 hover:text-foreground"
                    href="https://www.instagram.com/corentin_sg/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                  <span className="text-muted-foreground/60">•</span>
                  <a
                    className="underline underline-offset-4 hover:text-foreground"
                    href="https://www.linkedin.com/in/corentin-saint-girons/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
