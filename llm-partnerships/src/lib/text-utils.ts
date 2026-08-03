import translationsRaw from "../../data/text-translations.json"
import germanyTranslationsRaw from "../../data/germany-translations.json"
import italyTranslationsRaw from "../../data/italy-translations.json"
import ukTranslationsRaw from "../../data/uk-translations.json"

export type UiLanguage = "fr" | "en" | "es" | "de" | "it"

const dataTranslations = translationsRaw as {
  en: Record<string, string>
  es: Record<string, string>
  de?: Record<string, string>
  it?: Record<string, string>
}
const germanyDataTranslations = germanyTranslationsRaw as {
  en: Record<string, string>
  es: Record<string, string>
  de?: Record<string, string>
  it?: Record<string, string>
}
const italyDataTranslations = italyTranslationsRaw as {
  en: Record<string, string>
  es: Record<string, string>
  de?: Record<string, string>
  it?: Record<string, string>
}
const ukDataTranslations = ukTranslationsRaw as {
  en: Record<string, string>
  es: Record<string, string>
  de?: Record<string, string>
  it?: Record<string, string>
}

export function cleanText(value: unknown) {
  if (value == null) return ""

  return String(value)
    .replaceAll("Ã©", "é")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ãª", "ê")
    .replaceAll("Ã«", "ë")
    .replaceAll("Ã ", "à")
    .replaceAll("Ã¢", "â")
    .replaceAll("Ã¹", "ù")
    .replaceAll("Ã»", "û")
    .replaceAll("Ã´", "ô")
    .replaceAll("Ã®", "î")
    .replaceAll("Ã¯", "ï")
    .replaceAll("Ã§", "ç")
    .replaceAll("Ã‰", "É")
    .replaceAll("Ã€", "À")
    .replaceAll("â€™", "’")
    .replaceAll("â€œ", "“")
    .replaceAll("â€", "”")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â†’", "→")
    .replaceAll("Â·", "·")
    .replaceAll("Â«", "«")
    .replaceAll("Â»", "»")
    .replaceAll("Â ", " ")
}

export function translateDataText(
  value: unknown,
  language: UiLanguage,
): string {
  if (value == null) return ""
  const raw = String(value)
  if (language === "fr") return cleanText(raw)
  return cleanText(
    ukDataTranslations[language]?.[raw] ||
      italyDataTranslations[language]?.[raw] ||
      germanyDataTranslations[language]?.[raw] ||
      dataTranslations[language]?.[raw] ||
      raw,
  )
}

export const reliabilityCopy = {
  fr: {
    confirmed: {
      label: "Confirmé",
      description:
        "Information confirmée par une source officielle ou récente.",
    },
    to_confirm: {
      label: "À confirmer",
      description:
        "Information probable, mais source ancienne, partielle ou non officielle.",
    },
    incomplete: {
      label: "Information incomplète",
      description:
        "Données insuffisantes pour comparer sans vérification complémentaire.",
    },
  },
  en: {
    confirmed: {
      label: "Confirmed",
      description: "Confirmed by an official or recent source.",
    },
    to_confirm: {
      label: "To confirm",
      description:
        "Likely information, but based on an old, partial, or unofficial source.",
    },
    incomplete: {
      label: "Incomplete",
      description: "Not enough data to compare without further verification.",
    },
  },
  es: {
    confirmed: {
      label: "Confirmado",
      description: "Confirmado por una fuente oficial o reciente.",
    },
    to_confirm: {
      label: "Por confirmar",
      description:
        "Información probable, pero con fuente antigua, parcial o no oficial.",
    },
    incomplete: {
      label: "Información incompleta",
      description: "Faltan datos para comparar sin verificación adicional.",
    },
  },
  de: {
    confirmed: {
      label: "Bestätigt",
      description: "Durch eine offizielle oder aktuelle Quelle bestätigt.",
    },
    to_confirm: {
      label: "Zu bestätigen",
      description:
        "Wahrscheinliche Information, die jedoch auf einer älteren, unvollständigen oder nicht offiziellen Quelle beruht.",
    },
    incomplete: {
      label: "Unvollständige Information",
      description:
        "Für einen Vergleich ohne zusätzliche Prüfung liegen nicht genügend Daten vor.",
    },
  },
  it: {
    confirmed: {
      label: "Confermato",
      description: "Confermato da una fonte ufficiale o recente.",
    },
    to_confirm: {
      label: "Da confermare",
      description:
        "Informazione probabile, ma basata su una fonte datata, parziale o non ufficiale.",
    },
    incomplete: {
      label: "Incompleto",
      description: "Dati insufficienti per il confronto senza ulteriore verifica.",
    },
  },
} as const
