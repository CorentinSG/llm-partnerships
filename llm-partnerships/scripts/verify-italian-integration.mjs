import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright"

const hostname = "127.0.0.1"
const port = 4176
const baseUrl = `http://${hostname}:${port}`
const require = createRequire(import.meta.url)
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--hostname", hostname, "--port", String(port)], {
  cwd: new URL("..", import.meta.url),
  stdio: ["ignore", "pipe", "pipe"],
})
let output = ""
server.stdout.on("data", (chunk) => { output += chunk })
server.stderr.on("data", (chunk) => { output += chunk })

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) throw new Error(`Next server exited early:\n${output}`)
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {}
    await delay(250)
  }
  throw new Error(`Timed out waiting for Next server:\n${output}`)
}

async function expectText(page, text) {
  await page.getByText(text, { exact: true }).first().waitFor({ state: "visible", timeout: 10_000 })
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1680, height: 1000 } })
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" })
  await page.getByRole("button", { name: "Italiano" }).click()
  await page.locator("html[lang='it']").waitFor()
  assert.equal(await page.evaluate(() => localStorage.getItem("llm-partnerships-language")), "it")
  await page.getByRole("heading", { level: 1, name: "Trova un LL.M statunitense tramite un'università francese." }).waitFor()
  await expectText(page, "Francia–Stati Uniti")

  const search = page.getByRole("textbox", { name: "Ricerca globale" })
  await search.fill("Stati Uniti")
  const resultCounter = page.locator("main").getByText(/risultati/).last()
  await resultCounter.waitFor()
  assert.match(await resultCounter.innerText(), /42/, "Italian translated country must participate in search")
  await search.fill("")

  const routes = [
    ["/germany", "Trova un LL.M. statunitense attraverso un'università tedesca."],
    ["/italy", "Trova un LL.M. statunitense tramite un'università italiana."],
    ["/about", "Informazioni sul progetto"],
    ["/guide", "Guida: diventare avvocato negli Stati Uniti"],
    ["/alternatives", "Percorsi alternativi nel diritto comune nordamericano"],
    ["/submit", "Invia informazioni"],
    ["/partnership/assas-boston-university", "Torna alla ricerca"],
    ["/partnership/augsburg-george-washington-exchange-credit", "Torna alla ricerca"],
    ["/partnership/roma-tre-uc-law-sf", "Torna alla ricerca"],
    ["/italian-route-does-not-exist", "Non trovato"],
  ]
  for (const [path, text] of routes) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => document.documentElement.lang === "it")
    await expectText(page, text)
  }
  await page.reload({ waitUntil: "domcontentloaded" })
  await expectText(page, "Non trovato")
  await context.close()

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await mobile.addInitScript(() => localStorage.setItem("llm-partnerships-language", "it"))
  const mobilePage = await mobile.newPage()
  await mobilePage.goto(baseUrl)
  await mobilePage.locator("html[lang='it']").waitFor()
  await mobilePage.getByRole("button", { name: "Menu" }).click()
  const italianButton = mobilePage.getByRole("button", { name: "Italiano" })
  await italianButton.waitFor({ state: "visible" })
  assert.equal(await italianButton.getAttribute("aria-pressed"), "true")
  await mobile.close()

  console.log("Italian browser integration verified across all routes")
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
