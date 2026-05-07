export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

export function includesQuery(haystack: string, query: string) {
  if (!query) return true
  return normalizeText(haystack).includes(normalizeText(query))
}

