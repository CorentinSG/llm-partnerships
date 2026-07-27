import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright"

const hostname = "127.0.0.1"
const port = 4174
const baseUrl = `http://${hostname}:${port}`
const require = createRequire(import.meta.url)
const nextCli = require.resolve("next/dist/bin/next")
const server = spawn(
  process.execPath,
  [nextCli, "dev", "--hostname", hostname, "--port", String(port)],
  {
    cwd: new URL("..", import.meta.url),
    stdio: ["ignore", "pipe", "pipe"],
  },
)
let serverOutput = ""
server.stdout.on("data", (chunk) => {
  serverOutput += chunk
})
server.stderr.on("data", (chunk) => {
  serverOutput += chunk
})

for (let attempt = 0; attempt < 120; attempt += 1) {
  try {
    const response = await fetch(baseUrl)
    if (response.ok) break
  } catch {
    // The local server is still starting.
  }
  if (attempt === 119) {
    throw new Error(`Timed out waiting for Next server:\n${serverOutput}`)
  }
  await delay(250)
}

const browser = await chromium.launch({ headless: true })
const consoleErrors = []

async function expectText(page, text) {
  const locator = page.getByText(text, { exact: true }).first()
  await locator.waitFor({ state: "visible", timeout: 10_000 })
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("status of 404")
    ) {
      consoleErrors.push(message.text())
    }
  })

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" })
  await page.getByRole("button", { name: "Deutsch" }).click()
  await page.locator("html[lang='de']").waitFor()
  assert.equal(await page.locator("html").getAttribute("lang"), "de")
  assert.equal(
    await page.evaluate(() =>
      window.localStorage.getItem("llm-partnerships-language"),
    ),
    "de",
  )
  await expectText(page, "Frankreich–USA")
  await expectText(
    page,
    "Finden Sie einen US-amerikanischen LL.M. über eine französische Universität.",
  )

  const routes = [
    ["/germany", "Finden Sie einen US-amerikanischen LL.M. über eine deutsche Universität."],
    ["/about", "Über das Projekt"],
    ["/guide", "Leitfaden: Anwalt in den Vereinigten Staaten werden"],
    ["/alternatives", "Alternative Wege zum nordamerikanischen Common Law"],
    ["/submit", "Informationen übermitteln"],
    ["/partnership/assas-boston-university", "Zurück zur Suche"],
    ["/partnership/augsburg-george-washington-exchange-credit", "Zurück zur Suche"],
    ["/german-route-does-not-exist", "Nicht gefunden"],
  ]

  for (const [path, text] of routes) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => document.documentElement.lang === "de")
    assert.equal(await page.locator("html").getAttribute("lang"), "de", path)
    await expectText(page, text)
  }

  await page.reload({ waitUntil: "domcontentloaded" })
  assert.equal(
    await page.evaluate(() =>
      window.localStorage.getItem("llm-partnerships-language"),
    ),
    "de",
  )
  await expectText(page, "Nicht gefunden")
  await context.close()

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await mobile.addInitScript(() => {
    window.localStorage.setItem("llm-partnerships-language", "de")
  })
  const mobilePage = await mobile.newPage()
  mobilePage.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("status of 404")
    ) {
      consoleErrors.push(message.text())
    }
  })
  await mobilePage.goto(baseUrl, { waitUntil: "domcontentloaded" })
  await mobilePage.waitForFunction(() => document.documentElement.lang === "de")
  await mobilePage.getByRole("button", { name: "Menü" }).click()
  await mobilePage.getByRole("button", { name: "Deutsch" }).last().waitFor()
  await mobilePage
    .getByRole("link", { name: "Deutschland–USA", exact: true })
    .last()
    .waitFor()
  await mobile.close()

  assert.deepEqual(consoleErrors, [], `Browser console errors:\n${consoleErrors.join("\n")}`)
  console.log("German browser integration verified across all routes")
} finally {
  await browser.close()
  server.kill()
}
