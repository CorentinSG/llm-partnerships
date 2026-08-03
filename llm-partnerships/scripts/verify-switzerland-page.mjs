import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright"

const hostname = "127.0.0.1"
const port = 4177
const baseUrl = `http://${hostname}:${port}`
const require = createRequire(import.meta.url)
const nextCli = require.resolve("next/dist/bin/next")
const server = spawn(process.execPath, [nextCli, "dev", "--hostname", hostname, "--port", String(port)], {
  cwd: new URL("..", import.meta.url),
  stdio: ["ignore", "pipe", "pipe"],
})
let output = ""
server.stdout.on("data", (chunk) => { output += chunk })
server.stderr.on("data", (chunk) => { output += chunk })

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) throw new Error(`Next server exited early:\n${output}`)
    try { if ((await fetch(`${baseUrl}/switzerland`)).ok) return } catch {}
    await delay(250)
  }
  throw new Error(`Timed out waiting for Next server:\n${output}`)
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
  await page.goto(`${baseUrl}/switzerland`)
  await page.getByRole("heading", { level: 1, name: "Trouvez un LL.M américain via une université suisse." }).waitFor()
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 6)
  await expectText(page.locator("main"), /6 partenariats/, "French summary exposes six partnerships")

  const swissMap = page.getByRole("img", { name: "Carte de la Suisse avec points des universités" })
  assert.equal(await swissMap.locator('[tabindex="0"]').count(), 4)
  const zurich = swissMap.getByRole("button", { name: "Universität Zürich (UZH)", exact: true })
  await zurich.press("Enter")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 2)
  await zurich.press("Enter")

  await page.getByRole("button", { name: "Frais réduits", exact: true }).click()
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await expectText(page.locator("main"), /Benjamin N. Cardozo School of Law/, "Reduced-tuition shortcut returns Cardozo")
  await page.getByRole("button", { name: "Réinitialiser", exact: true }).first().click()

  await page.getByRole("button", { name: "English" }).click()
  await page.getByRole("heading", { level: 1, name: "Find a U.S. LL.M. through a Swiss university." }).waitFor()
  const search = page.getByRole("textbox", { name: "Global search" })
  await search.fill("California")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await page.locator('main a[href^="/partnership/"]').click()
  await page.waitForURL(/\/partnership\/uzh-berkeley$/)
  assert.equal(await page.getByRole("link", { name: "Back to search", exact: true }).getAttribute("href"), "/switzerland")
  await expectText(page.locator("main"), /California.*New York|New York.*California/s, "Berkeley bar caveat is translated")

  await page.goto(`${baseUrl}/switzerland`)
  await page.getByRole("button", { name: "Español" }).click()
  await page.getByRole("heading", { level: 1, name: /universidad suiza/ }).waitFor()
  await expectText(page.locator("main"), /6 convenios/, "Spanish summary is complete")
  await page.getByRole("button", { name: "Deutsch" }).click()
  await page.getByRole("heading", { level: 1, name: /Schweizer Universität/ }).waitFor()
  await expectText(page.locator("main"), /6 Partnerschaften/, "German summary is complete")
  await page.getByRole("button", { name: "Italiano" }).click()
  await page.getByRole("heading", { level: 1, name: /università svizzera/ }).waitFor()
  await expectText(page.locator("main"), /6 partnership/, "Italian summary is complete")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Menu" }).click()
  assert.equal(await page.getByRole("link", { name: "Svizzera–Stati Uniti", exact: true }).getAttribute("href"), "/switzerland")
  console.log("Swiss browser integration verified across five languages")
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
