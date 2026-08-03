import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"

const root = new URL("../", import.meta.url)
const read = (path) => readFileSync(new URL(path, root), "utf8")

function sourceFiles(directory) {
  return readdirSync(new URL(directory, root), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name).replaceAll("\\", "/")
    return entry.isDirectory()
      ? sourceFiles(`${path}/`)
      : /\.[cm]?[jt]sx?$/.test(entry.name)
        ? [path]
        : []
  })
}

const missingObjects = []
for (const path of sourceFiles("src/")) {
  const source = read(path)
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const names = new Set(node.properties.map((property) => property.name?.text).filter(Boolean))
      if (["fr", "en", "es", "de"].every((name) => names.has(name)) && !names.has("it")) {
        missingObjects.push(`${path}:${file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1}`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
}
assert.deepEqual(missingObjects, [], `Localized objects missing it:\n${missingObjects.join("\n")}`)

const textUtils = read("src/lib/text-utils.ts")
assert.match(
  textUtils,
  /export type UiLanguage\s*=\s*"fr"\s*\|\s*"en"\s*\|\s*"es"\s*\|\s*"de"\s*\|\s*"it"/,
  "UiLanguage must include it",
)

const provider = read("src/components/language-provider.tsx")
assert.match(provider, /stored === "it"/)

const header = read("src/components/site-header.tsx")
assert.match(header, /it:\s*"IT"/)
assert.match(header, /it:\s*"Italiano"/)
assert.match(header, /Francia–Stati Uniti/)
assert.match(header, /Germania–Stati Uniti/)
assert.match(header, /Italia–Stati Uniti/)

const localizedFiles = [
  "src/app/about/page.tsx",
  "src/app/guide/page.tsx",
  "src/app/not-found.tsx",
  "src/components/alternative-card.tsx",
  "src/components/cost-simulator.tsx",
  "src/components/founder-faq.tsx",
  "src/components/france-map.tsx",
  "src/components/filters/filters-panel.tsx",
  "src/components/filters/multi-select-filter.tsx",
  "src/components/germany-map.tsx",
  "src/components/italy-map.tsx",
  "src/components/pages/alternatives-page.tsx",
  "src/components/pages/germany-home-page.tsx",
  "src/components/pages/home-page.tsx",
  "src/components/pages/italy-home-page.tsx",
  "src/components/pages/partnership-detail-page.tsx",
  "src/components/pages/submit-information-form.tsx",
  "src/components/partnership-card.tsx",
  "src/components/partnership-dialog.tsx",
  "src/components/site-footer.tsx",
  "src/components/site-header.tsx",
  "src/components/stats-bar.tsx",
  "src/components/theme-toggle.tsx",
  "src/components/tuition-badges.tsx",
  "src/components/us-lawyer-path.tsx",
  "src/components/us-map.tsx",
  "src/lib/partnership-details-copy.ts",
  "src/lib/text-utils.ts",
  "src/lib/tuition-offers.ts",
]

for (const path of localizedFiles) {
  assert.match(read(path), /\bit\s*:/, `${path} must contain Italian copy`)
}

const corpus = localizedFiles.map(read).join("\n")
for (const phrase of [
  "Informazioni sul progetto",
  "Cerca una partnership",
  "Torna alla ricerca",
  "Nessun risultato",
  "Preventivo annuale LL.M.",
]) {
  assert.ok(corpus.includes(phrase), `Missing Italian semantic phrase: ${phrase}`)
}

console.log(`Italian locale structure verified across ${localizedFiles.length} files`)
