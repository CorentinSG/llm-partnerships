import type { Metadata } from "next"
import "./globals.css"
import type { ReactNode } from "react"
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google"

import { SiteHeader } from "@/components/site-header"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { ThemeProvider } from "@/components/theme-provider"

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
    <html lang="fr" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable}`}>
        <ThemeProvider>
          <div className="min-h-dvh bg-background app-surface">
            <GoogleAnalytics />
            <SiteHeader />
            {children}
            <footer className="container pb-10 pt-10">
              <div className="glass-panel rounded-2xl px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  Avertissement :
                </span>{" "}
                ce site est un MVP informatif (focus : partenariats LL.M vers des law
                schools américaines). Les informations peuvent être incomplètes ou
                évoluer. Vérifie toujours les sources officielles (universités, LSAC,
                barreaux) avant toute candidature. Ce contenu ne constitue pas un
                conseil juridique.

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
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
