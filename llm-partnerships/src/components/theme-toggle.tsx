"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { language } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = mounted ? theme === "dark" : false
  const label = {
    fr: isDark ? "Activer le mode clair" : "Activer le mode sombre",
    en: isDark ? "Use light mode" : "Use dark mode",
    es: isDark ? "Activar modo claro" : "Activar modo oscuro",
    de: isDark ? "Verwenden Sie den Lichtmodus" : "Verwenden Sie den Dunkelmodus",
  }[language]

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass-button h-10 min-h-10 w-10 min-w-10 sm:h-11 sm:min-h-11 sm:w-11 sm:min-w-11 md:h-10 md:min-h-10 md:w-10 md:min-w-10"
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  )
}
