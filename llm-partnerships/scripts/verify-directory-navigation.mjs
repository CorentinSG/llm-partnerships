import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const readSource = (...path) => readFileSync(join(projectRoot, ...path), "utf8")

const header = readSource("src", "components", "site-header.tsx")
const homePage = readSource("src", "components", "pages", "home-page.tsx")
const aboutPage = readSource("src", "app", "about", "page.tsx")
const layout = readSource("src", "app", "layout.tsx")

for (const [language, franceUs, germanyUs] of [
  ["fr", "France–États-Unis", "Allemagne–États-Unis"],
  ["en", "France–United States", "Germany–United States"],
  ["es", "Francia–Estados Unidos", "Alemania–Estados Unidos"],
]) {
  assert.match(header, new RegExp(`${language}:\\s*\\{[\\s\\S]*?franceUs: "${franceUs}"`))
  assert.match(header, new RegExp(`${language}:\\s*\\{[\\s\\S]*?germanyUs: "${germanyUs}"`))
}

assert.match(header, /<Link href="\/">\{t\.franceUs\}<\/Link>/)
assert.match(header, /<Link href="\/germany">\{t\.germanyUs\}<\/Link>/)
assert.equal(
  (header.match(/\{t\.franceUs\}/g) ?? []).length,
  2,
  "France–U.S. navigation must be available on desktop and mobile",
)
assert.equal(
  (header.match(/\{t\.germanyUs\}/g) ?? []).length,
  2,
  "Germany–U.S. navigation must be available on desktop and mobile",
)

for (const [language, germanyCta] of [
  ["fr", "Découvrir l’annuaire Allemagne–États-Unis"],
  ["en", "Explore the Germany–U.S. directory"],
  ["es", "Explorar el directorio Alemania–Estados Unidos"],
]) {
  assert.match(homePage, new RegExp(`${language}:\\s*\\{[\\s\\S]*?germanyCta: "${germanyCta}"`))
}
assert.match(homePage, /<a href="\/germany">\{t\.germanyCta\}<\/a>/)

assert.match(
  layout,
  /France–États-Unis et Allemagne–États-Unis/,
  "metadata must describe both separate directories",
)

for (const paragraph of [
  "partenariats entre universités françaises et universités américaines",
  "partenariats entre universités allemandes et universités américaines",
  "partnerships between French universities and U.S. universities",
  "partnerships between German universities and U.S. universities",
  "convenios entre universidades francesas y estadounidenses",
  "convenios entre universidades alemanas y estadounidenses",
]) {
  assert.match(aboutPage, new RegExp(paragraph))
}

console.log("Directory navigation and global scope copy verified")
