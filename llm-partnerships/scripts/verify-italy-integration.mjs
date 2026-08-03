import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright"

const hostname = "127.0.0.1"
const port = 4175
const baseUrl = `http://${hostname}:${port}`
const require = createRequire(import.meta.url)
const nextCli = require.resolve("next/dist/bin/next")
const server = spawn(process.execPath, [nextCli, "dev", "--hostname", hostname, "--port", String(port)], {
  cwd: new URL("..", import.meta.url),
  stdio: ["ignore", "pipe", "pipe"],
})
let serverOutput = ""
server.stdout.on("data", (chunk) => { serverOutput += chunk })
server.stderr.on("data", (chunk) => { serverOutput += chunk })

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) throw new Error(`Next server exited early:\n${serverOutput}`)
    try {
      const response = await fetch(`${baseUrl}/italy`)
      if (response.ok) return
    } catch {}
    await delay(250)
  }
  throw new Error(`Timed out waiting for Next server:\n${serverOutput}`)
}

async function expectText(locator, expected, message) {
  await locator.waitFor({ state: "visible" })
  assert.match(await locator.innerText(), expected, message)
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1680, height: 1000 } })
  await page.goto(`${baseUrl}/italy`)

  await page.getByRole("heading", {
    level: 1,
    name: "Trouvez un LL.M américain via une université italienne.",
  }).waitFor()
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 12)
  assert.match(
    await page.getByRole("combobox", { name: /^Pays/ }).getAttribute("aria-label"),
    /Italie–États-Unis/,
    "Italy must be active in country navigation",
  )

  const italyMap = page.getByRole("img", { name: "Carte d'Italie avec points des universités" })
  assert.equal(await italyMap.locator('[tabindex="0"]').count(), 5)
  const luissMarker = italyMap.getByRole("button", { name: "LUISS Guido Carli", exact: true })
  await luissMarker.focus()
  await luissMarker.locator('[data-focus-ring="true"]').waitFor({ state: "visible" })
  await luissMarker.press("Enter")
  await expectText(page.locator("main"), /Sélection : LUISS Guido Carli/, "Italy markers filter with the keyboard")
  await luissMarker.press("Enter")

  const frenchSimulator = page.locator("#cost-estimator")
  await frenchSimulator.getByRole("combobox", { name: "1. Ville" }).click()
  await page.getByRole("option", { name: "New York, NY", exact: true }).click()
  await expectText(frenchSimulator, /Billets d'avion Italie - États-Unis/, "Italy simulator uses Italy copy")

  await page.getByRole("button", { name: "English" }).click()
  await page.getByRole("heading", {
    level: 1,
    name: "Find a U.S. LL.M. through an Italian university.",
  }).waitFor()
  await expectText(page.locator("main"), /United States/, "English translates Italian directory data")
  const search = page.getByRole("textbox", { name: "Global search" })
  await search.fill("United States")
  await expectText(page.locator("main"), /12 result\(s\)/, "Translated country participates in search")
  await search.fill("Roma Tre")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await page.locator('main a[href^="/partnership/"]').click()
  await page.waitForURL(/\/partnership\/roma-tre-cardozo$/)
  assert.equal(
    await page.getByRole("link", { name: "Back to search", exact: true }).getAttribute("href"),
    "/italy",
    "Italian details return to the Italy directory",
  )
  await expectText(page.locator("main"), /The Cardozo agreement guarantees neither admission/, "Detail text is translated")

  await page.goto(`${baseUrl}/italy`)
  await page.getByRole("button", { name: "Español" }).click()
  await page.getByRole("heading", { level: 1, name: /universidad italiana/ }).waitFor()
  await expectText(page.locator("main"), /Estados Unidos/, "Spanish Italy page is translated")
  await page.getByRole("button", { name: "Deutsch" }).click()
  await page.getByRole("heading", { level: 1, name: /italienische Universität/ }).waitFor()
  await expectText(page.locator("main"), /Vereinigte Staaten/, "German Italy page is translated")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Menü" }).click()
  const mobileCountrySelector = page.getByRole("dialog").getByRole("combobox", { name: /^Land/ })
  assert.match(await mobileCountrySelector.getAttribute("aria-label"), /Italien–USA/)
  await mobileCountrySelector.click()
  await page.getByRole("option", { name: "Italien–USA", exact: true }).waitFor()

  console.log("Italy browser integration verified")
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
