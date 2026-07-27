"use client"

import * as React from "react"

import type { UiLanguage } from "@/lib/text-utils"

type LanguageContextValue = {
  language: UiLanguage
  setLanguage: (language: UiLanguage) => void
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<UiLanguage>("fr")
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const stored = window.localStorage.getItem("llm-partnerships-language")
    if (
      stored === "fr" ||
      stored === "en" ||
      stored === "es" ||
      stored === "de"
    ) {
      setLanguage(stored)
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = language
    if (!hydrated) return
    window.localStorage.setItem("llm-partnerships-language", language)
  }, [hydrated, language])

  const value = React.useMemo(() => ({ language, setLanguage }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
