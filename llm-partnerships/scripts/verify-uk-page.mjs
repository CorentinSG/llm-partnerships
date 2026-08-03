import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright"

const hostname = "127.0.0.1"
const port = 4176
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
      const response = await fetch(`${baseUrl}/uk`)
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
  await page.goto(`${baseUrl}/uk`)

  await page.getByRole("heading", {
    level: 1,
    name: "Trouvez un LL.M américain via une université britannique.",
  }).waitFor()
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 6)
  assert.match(
    await page.getByRole("combobox", { name: /^Pays/ }).getAttribute("aria-label"),
    /Royaume-Uni–États-Unis/,
    "UK must be active in country navigation",
  )
  await expectText(page.locator("main"), /6 parcours actifs dans 5 universités britanniques/, "French summary exposes the active scope")
  await expectText(page.locator("main"), /Georgetown indique explicitement.*New York Bar/s, "The dual-degree bar warning is visible")
  await expectText(page.locator("main"), /ne nomme pas Bristol.*page partenaire dédiée/s, "The Bristol evidence limitation is visible")
  assert.equal((await page.locator("main").innerText()).includes("Dundee"), false)
  assert.equal((await page.locator("main").innerText()).includes("Hull"), false)

  const ukMap = page.getByRole("img", { name: "Carte du Royaume-Uni avec points des universités" })
  assert.equal(await ukMap.locator('[tabindex="0"]').count(), 5)
  assert.equal(await ukMap.locator('[data-marker-leader]').count(), 4)
  const landFill = await ukMap.locator('[data-uk-land]').getAttribute("fill")
  assert.ok(landFill && landFill !== "transparent", "UK land must have a visible fill")
  const middlesexMarker = ukMap.getByRole("button", { name: "Middlesex University London", exact: true })
  await middlesexMarker.press("Enter")
  await expectText(page.locator("main"), /Sélection : Middlesex University London/, "UK map markers filter by keyboard")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await middlesexMarker.press("Enter")

  await page.getByRole("button", { name: "Frais réduits", exact: true }).click()
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 2, "The reduced-fee filter returns CTLS and Cardozo")
  await expectText(page.locator("main"), /CTLS Alumni Scholarship/, "Reduced-tuition shortcut returns CTLS")
  await expectText(page.locator("main"), /Benjamin N. Cardozo School of Law/, "Reduced-tuition shortcut returns Cardozo")
  await page.getByRole("button", { name: "Réinitialiser", exact: true }).first().click()

  await page.getByRole("button", { name: "English" }).click()
  await page.getByRole("heading", { level: 1, name: "Find a U.S. LL.M. through a UK university." }).waitFor()
  const search = page.getByRole("textbox", { name: "Global search" })
  await search.fill("United States")
  await expectText(page.locator("main"), /6 result\(s\)/, "Translated country participates in search")
  await search.fill("Middlesex")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await page.locator('main a[href^="/partnership/"]').click()
  await page.waitForURL(/\/partnership\/middlesex-case-western$/)
  assert.equal(
    await page.getByRole("link", { name: "Back to search", exact: true }).getAttribute("href"),
    "/uk",
    "UK details return to the UK directory",
  )
  await expectText(page.locator("main"), /suitable for U\.S\. bar preparation.*without guaranteeing/s, "Middlesex bar caveat is translated")

  await page.goto(`${baseUrl}/uk`)
  await page.getByRole("button", { name: "Español" }).click()
  await page.getByRole("heading", { level: 1, name: /universidad británica/ }).waitFor()
  await expectText(page.locator("main"), /6 itinerarios activos en 5 universidades británicas/, "Spanish summary is complete")
  await page.getByRole("button", { name: "Deutsch" }).click()
  await page.getByRole("heading", { level: 1, name: /britische Universität/ }).waitFor()
  await expectText(page.locator("main"), /6 aktive Studienwege an 5 britischen Universitäten/, "German summary is complete")
  await page.getByRole("button", { name: "Italiano" }).click()
  await page.getByRole("heading", { level: 1, name: /università britannica/ }).waitFor()
  await expectText(page.locator("main"), /6 percorsi attivi in 5 università britanniche/, "Italian summary is complete")

  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    "The UK page must not overflow horizontally on mobile",
  )
  await page.getByRole("button", { name: "Menu" }).click()
  const countrySelector = page.getByRole("dialog").getByRole("combobox", { name: /^Paese/ })
  assert.match(await countrySelector.getAttribute("aria-label"), /Regno Unito–Stati Uniti/)
  await countrySelector.click()
  await page.getByRole("option", { name: "Regno Unito–Stati Uniti", exact: true }).waitFor()

  console.log("UK browser integration verified across five languages")
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
