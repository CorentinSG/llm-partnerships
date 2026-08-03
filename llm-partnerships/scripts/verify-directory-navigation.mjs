import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

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
assert.match(
  header,
  /className="hidden items-center gap-1 min-\[1600px\]:flex"/,
  "desktop navigation must not appear before the 1600px breakpoint",
)
assert.match(
  header,
  /className="flex min-w-0 items-center gap-1\.5 min-\[1600px\]:hidden"/,
  "sheet navigation must remain available below the 1600px breakpoint",
)
assert.doesNotMatch(
  header,
  /<Link href="\/">\{t\.home\}<\/Link>/,
  "the mobile sheet must not duplicate the France directory destination",
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
  /Cinq annuaires distincts[\s\S]*Suisse–États-Unis/,
  "metadata must describe all five separate directories",
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

const hostname = "127.0.0.1"
const port = 4174
const baseUrl = `http://${hostname}:${port}`
const require = createRequire(import.meta.url)
const nextCli = require.resolve("next/dist/bin/next")
const server = spawn(
  process.execPath,
  [nextCli, "dev", "--hostname", hostname, "--port", String(port)],
  { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"] },
)
let serverOutput = ""
server.stdout.on("data", (chunk) => {
  serverOutput += chunk
})
server.stderr.on("data", (chunk) => {
  serverOutput += chunk
})

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) {
      throw new Error(`Next server exited early:\n${serverOutput}`)
    }
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // The development server is still starting.
    }
    await delay(250)
  }
  throw new Error(`Timed out waiting for Next server:\n${serverOutput}`)
}

const navigationCopy = {
  fr: {
    menu: "Menu",
    franceUs: "France–États-Unis",
    germanyUs: "Allemagne–États-Unis",
  },
  en: {
    menu: "Menu",
    franceUs: "France–United States",
    germanyUs: "Germany–United States",
  },
  es: {
    menu: "Menú",
    franceUs: "Francia–Estados Unidos",
    germanyUs: "Alemania–Estados Unidos",
  },
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })

  for (const width of [768, 1024, 1280, 1440, 1680]) {
    for (const [language, copy] of Object.entries(navigationCopy)) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      await page.addInitScript(
        (storedLanguage) =>
          window.localStorage.setItem(
            "llm-partnerships-language",
            storedLanguage,
          ),
        language,
      )
      await page.goto(baseUrl)
      await page.waitForFunction(
        (expectedLanguage) => document.documentElement.lang === expectedLanguage,
        language,
      )
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
        `${language} header must not create horizontal overflow at ${width}px`,
      )

      if (width < 1600) {
        const menu = page.getByRole("button", { name: copy.menu, exact: true })
        await menu.click()
        const sheet = page.getByRole("dialog")
        await sheet.waitFor({ state: "visible" })
        const franceDirectory = sheet.getByRole("link", {
          name: copy.franceUs,
          exact: true,
        })
        const germanyDirectory = sheet.getByRole("link", {
          name: copy.germanyUs,
          exact: true,
        })
        assert.equal(await franceDirectory.count(), 1)
        assert.equal(await germanyDirectory.count(), 1)
        assert.equal(await franceDirectory.getAttribute("href"), "/")
        assert.equal(await germanyDirectory.getAttribute("href"), "/germany")
      } else {
        await assert.doesNotReject(
          page
            .getByRole("link", { name: copy.franceUs, exact: true })
            .waitFor({ state: "visible" }),
          `${language} France directory link must be accessible at ${width}px`,
        )
        await assert.doesNotReject(
          page
            .getByRole("link", { name: copy.germanyUs, exact: true })
            .waitFor({ state: "visible" }),
          `${language} Germany directory link must be accessible at ${width}px`,
        )
      }

      await page.close()
    }
  }
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}

console.log("Directory navigation and global scope copy verified")
