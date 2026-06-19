"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

const Provider = NextThemesProvider as React.ComponentType<
  React.ComponentProps<typeof NextThemesProvider> & { children: React.ReactNode }
>

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </Provider>
  )
}
