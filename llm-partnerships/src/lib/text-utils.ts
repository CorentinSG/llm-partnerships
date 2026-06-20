export type UiLanguage = "fr" | "en" | "es"

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

export const reliabilityCopy = {
  fr: {
    confirmed: {
      label: "Confirmé",
      description: "Information confirmée par une source officielle ou récente."
    },
    to_confirm: {
      label: "À confirmer",
      description: "Information probable, mais source ancienne, partielle ou non officielle."
    },
    incomplete: {
      label: "Information incomplète",
      description: "Données insuffisantes pour comparer sans vérification complémentaire."
    }
  },
  en: {
    confirmed: {
      label: "Confirmed",
      description: "Confirmed by an official or recent source."
    },
    to_confirm: {
      label: "To confirm",
      description: "Likely information, but based on an old, partial, or unofficial source."
    },
    incomplete: {
      label: "Incomplete",
      description: "Not enough data to compare without further verification."
    }
  },
  es: {
    confirmed: {
      label: "Confirmado",
      description: "Confirmado por una fuente oficial o reciente."
    },
    to_confirm: {
      label: "Por confirmar",
      description: "Información probable, pero con fuente antigua, parcial o no oficial."
    },
    incomplete: {
      label: "Información incompleta",
      description: "Faltan datos para comparar sin verificación adicional."
    }
  }
} as const

