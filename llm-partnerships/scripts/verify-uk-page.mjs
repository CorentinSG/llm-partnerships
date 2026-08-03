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
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 5)
  assert.ok(await page.locator('header a[href="/uk"]').count(), "UK must be present in navigation")
  await expectText(page.locator("main"), /4 partenariats et 5 parcours/, "French summary distinguishes partnerships and pathways")

  const ukMap = page.getByRole("img", { name: "Carte du Royaume-Uni avec points des universités" })
  assert.equal(await ukMap.locator('[tabindex="0"]').count(), 4)
  const dundeeMarker = ukMap.getByRole("button", { name: "University of Dundee", exact: true })
  await dundeeMarker.press("Enter")
  await expectText(page.locator("main"), /Sélection : University of Dundee/, "UK map markers filter by keyboard")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await dundeeMarker.press("Enter")

  await page.getByRole("button", { name: "Frais réduits", exact: true }).click()
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1, "The useful UK quick filter selects Bristol–Cardozo")
  await expectText(page.locator("main"), /Benjamin N. Cardozo School of Law/, "Reduced-tuition shortcut returns Cardozo")
  await page.getByRole("button", { name: "Réinitialiser", exact: true }).first().click()

  await page.getByRole("button", { name: "English" }).click()
  await page.getByRole("heading", { level: 1, name: "Find a U.S. LL.M. through a UK university." }).waitFor()
  const search = page.getByRole("textbox", { name: "Global search" })
  await search.fill("United States")
  await expectText(page.locator("main"), /5 result\(s\)/, "Translated country participates in search")
  await search.fill("Dundee")
  assert.equal(await page.locator('main a[href^="/partnership/"]').count(), 1)
  await page.locator('main a[href^="/partnership/"]').click()
  await page.waitForURL(/\/partnership\/dundee-auwcl-exchange$/)
  assert.equal(
    await page.getByRole("link", { name: "Back to search", exact: true }).getAttribute("href"),
    "/uk",
    "UK details return to the UK directory",
  )
  await expectText(page.locator("main"), /does not award an LL\.M.*Separate admission/s, "Dundee warning is translated")

  await page.goto(`${baseUrl}/uk`)
  await page.getByRole("button", { name: "Español" }).click()
  await page.getByRole("heading", { level: 1, name: /universidad británica/ }).waitFor()
  await expectText(page.locator("main"), /4 convenios y 5 itinerarios/, "Spanish summary is complete")
  await page.getByRole("button", { name: "Deutsch" }).click()
  await page.getByRole("heading", { level: 1, name: /britische Universität/ }).waitFor()
  await expectText(page.locator("main"), /4 Partnerschaften und 5 Studienwege/, "German summary is complete")
  await page.getByRole("button", { name: "Italiano" }).click()
  await page.getByRole("heading", { level: 1, name: /università britannica/ }).waitFor()
  await expectText(page.locator("main"), /4 partnership e 5 percorsi/, "Italian summary is complete")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Menu" }).click()
  assert.equal(
    await page.getByRole("link", { name: "Regno Unito–Stati Uniti", exact: true }).getAttribute("href"),
    "/uk",
    "Mobile navigation includes the UK directory",
  )

  console.log("UK browser integration verified across five languages")
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
