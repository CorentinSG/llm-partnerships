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
const countryMenuPath = join(projectRoot, "src", "components", "country-directory-menu.tsx")
const homePage = readSource("src", "components", "pages", "home-page.tsx")
const aboutPage = readSource("src", "app", "about", "page.tsx")
const layout = readSource("src", "app", "layout.tsx")

assert.match(header, /import \{ CountryDirectoryMenu \}/)
assert.equal(
  (header.match(/<CountryDirectoryMenu/g) ?? []).length,
  2,
  "One country selector must be rendered for desktop and one inside the mobile sheet",
)
assert.doesNotMatch(
  header,
  /<Link href="\/(?:germany|italy|uk|switzerland)?">\{t\.(?:franceUs|germanyUs|italyUs|ukUs|switzerlandUs)\}<\/Link>/,
  "Country directories must no longer be rendered as five separate links",
)

const countryMenu = readSource("src", "components", "country-directory-menu.tsx")
for (const route of ["/", "/germany", "/italy", "/uk", "/switzerland"]) {
  assert.match(header, new RegExp(`href: "${route === "/" ? "\\/" : route}"`))
}
assert.match(countryMenu, /usePathname/)
assert.match(countryMenu, /useRouter/)
assert.match(countryMenu, /onNavigate\?\.\(\)/)
assert.match(countryMenu, /min-h-11/)
assert.match(countryMenu, /max-w-\[calc\(100vw-2rem\)\]/)

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

for (const [language, germanyCta] of [
  ["fr", "Découvrir l’annuaire Allemagne–États-Unis"],
  ["en", "Explore the Germany–U.S. directory"],
  ["es", "Explorar el directorio Alemania–Estados Unidos"],
]) {
  assert.match(homePage, new RegExp(`${language}:\\s*\\{[\\s\\S]*?germanyCta: "${germanyCta}"`))
}
assert.match(homePage, /<a href="\/germany">\{t\.germanyCta\}<\/a>/)
assert.match(layout, /Cinq annuaires distincts[\s\S]*Suisse–États-Unis/)

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
server.stdout.on("data", (chunk) => { serverOutput += chunk })
server.stderr.on("data", (chunk) => { serverOutput += chunk })

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) throw new Error(`Next server exited early:\n${serverOutput}`)
    try { if ((await fetch(baseUrl)).ok) return } catch {}
    await delay(250)
  }
  throw new Error(`Timed out waiting for Next server:\n${serverOutput}`)
}

const navigationCopy = {
  fr: { menu: "Menu", country: "Pays", directories: ["France–États-Unis", "Allemagne–États-Unis", "Italie–États-Unis", "Royaume-Uni–États-Unis", "Suisse–États-Unis"] },
  en: { menu: "Menu", country: "Country", directories: ["France–United States", "Germany–United States", "Italy–United States", "United Kingdom–United States", "Switzerland–United States"] },
  es: { menu: "Menú", country: "País", directories: ["Francia–Estados Unidos", "Alemania–Estados Unidos", "Italia–Estados Unidos", "Reino Unido–Estados Unidos", "Suiza–Estados Unidos"] },
  de: { menu: "Menü", country: "Land", directories: ["Frankreich–USA", "Deutschland–USA", "Italien–USA", "Vereinigtes Königreich–USA", "Schweiz–USA"] },
  it: { menu: "Menu", country: "Paese", directories: ["Francia–Stati Uniti", "Germania–Stati Uniti", "Italia–Stati Uniti", "Regno Unito–Stati Uniti", "Svizzera–Stati Uniti"] },
}

async function newLocalizedPage(browser, { language = "fr", theme = "dark", width = 1680 } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.addInitScript(({ storedLanguage, storedTheme }) => {
    window.localStorage.setItem("llm-partnerships-language", storedLanguage)
    window.localStorage.setItem("theme", storedTheme)
  }, { storedLanguage: language, storedTheme: theme })
  await page.goto(baseUrl)
  await page.waitForFunction((expectedLanguage) => document.documentElement.lang === expectedLanguage, language)
  return page
}

async function assertNoOverflow(page, context) {
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    `${context} must not create horizontal overflow`,
  )
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })

  for (const [language, copy] of Object.entries(navigationCopy)) {
    const page = await newLocalizedPage(browser, { language, width: 1680 })
    const selector = page.getByRole("combobox", { name: new RegExp(`^${copy.country}`) })
    await selector.waitFor({ state: "visible" })
    assert.match(await selector.getAttribute("aria-label"), new RegExp(copy.directories[0]))
    await selector.click()
    const options = page.getByRole("option")
    assert.equal(await options.count(), 5)
    assert.deepEqual(await options.allTextContents(), copy.directories)
    await page.keyboard.press("Escape")
    await assertNoOverflow(page, `${language} desktop header`)
    await page.close()
  }

  const keyboardPage = await newLocalizedPage(browser, { language: "fr", width: 1680 })
  const keyboardSelector = keyboardPage.getByRole("combobox", { name: /^Pays/ })
  await keyboardSelector.focus()
  await keyboardPage.keyboard.press("Enter")
  await keyboardPage.getByRole("option", { name: "France–États-Unis", exact: true }).waitFor()
  await keyboardPage.keyboard.press("ArrowDown")
  const highlightedOption = keyboardPage.locator('[role="option"][data-highlighted]')
  await keyboardPage.waitForFunction(
    () => document.querySelector('[role="option"][data-highlighted]')?.textContent === "Allemagne–États-Unis",
  )
  assert.equal(await highlightedOption.innerText(), "Allemagne–États-Unis")
  await keyboardPage.keyboard.press("Enter")
  await keyboardPage.waitForURL(`${baseUrl}/germany`)
  assert.match(await keyboardSelector.getAttribute("aria-label"), /Allemagne–États-Unis/)
  await keyboardPage.close()

  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    const page = await newLocalizedPage(browser, { language: "fr", width })
    await page.getByRole("button", { name: "Menu", exact: true }).click()
    const sheet = page.getByRole("dialog")
    await sheet.waitFor({ state: "visible" })
    const selector = sheet.getByRole("combobox", { name: /^Pays/ })
    await selector.waitFor({ state: "visible" })
    assert.ok((await selector.boundingBox()).height >= 44, `Mobile trigger must be at least 44px at ${width}px`)
    await selector.click()
    assert.equal(await page.getByRole("option").count(), 5)
    await assertNoOverflow(page, `mobile menu at ${width}px`)

    if (width === 320) {
      await page.getByRole("option", { name: "Allemagne–États-Unis", exact: true }).click()
      await page.waitForURL(`${baseUrl}/germany`)
      await sheet.waitFor({ state: "hidden" })
    } else {
      await page.keyboard.press("Escape")
    }
    await page.close()
  }

  for (const theme of ["light", "dark"]) {
    for (const width of [320, 1680]) {
      const page = await newLocalizedPage(browser, { language: "fr", theme, width })
      await assertNoOverflow(page, `${theme} theme at ${width}px`)
      await page.close()
    }
  }
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}

console.log("Country directory selector verified across five languages and mobile/desktop viewports")
