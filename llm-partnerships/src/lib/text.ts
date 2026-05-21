export function normalizeText(value: string) {
  // Keep this intentionally defensive: some environments/browsers may not support
  // Unicode property escapes (\p{Diacritic}).
  const v = (value ?? "").toString()
  const nfd = v.normalize("NFD")
  // Strip combining marks (covers accents) without relying on \p{}.
  const noMarks = nfd.replace(/[\u0300-\u036f]/g, "")
  return noMarks.toLowerCase().trim()
}

export function includesQuery(haystack: string, query: string) {
  if (!query) return true
  return normalizeText(haystack).includes(normalizeText(query))
}
