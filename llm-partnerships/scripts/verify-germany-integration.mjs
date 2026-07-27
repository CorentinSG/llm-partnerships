import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright"

const hostname = "127.0.0.1"
const port = 4173
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

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) {
      throw new Error(`Next server exited early:\n${serverOutput}`)
    }
    try {
      const response = await fetch(`${baseUrl}/germany`)
      if (response.ok) return
    } catch {
      // The dev server is still starting.
    }
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
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

  await page.goto(`${baseUrl}/germany`)
  await page.getByRole("button", { name: "English" }).click()
  await page.getByRole("heading", {
    level: 1,
    name: "Find a U.S. LL.M. through a German university.",
  }).waitFor()

  const germanyMapTab = page.getByRole("button", {
    name: "Germany",
    exact: true,
  })
  const usMapTab = page.getByRole("button", {
    name: "United States",
    exact: true,
  })
  assert.equal(await germanyMapTab.getAttribute("aria-pressed"), "true")
  assert.equal(await usMapTab.getAttribute("aria-pressed"), "false")

  const openLinks = page.getByRole("link", { name: "Open", exact: true })
  const search = page.getByRole("textbox", { name: "Global search" })
  assert.equal(await openLinks.count(), 12, "Germany starts with 12 cards")
  await expectText(
    page.locator("main"),
    /United States/,
    "English cards translate the partner country",
  )
  await expectText(
    page.locator("main"),
    /Creditable exchange toward an LL\.M\./,
    "English cards translate German pathway values",
  )

  await search.fill("United States")
  await expectText(
    page.locator("main"),
    /16 result\(s\)/,
    "English country translation participates in search",
  )
  await search.fill("Creditable exchange toward an LL.M.")
  assert.equal(
    await openLinks.count(),
    5,
    "English pathway translation participates in search",
  )
  await search.fill("")

  const programTypeFilter = page
    .getByText("Program type", { exact: true })
    .last()
    .locator("..")
    .getByRole("combobox")
  await programTypeFilter.click()
  await page
    .getByRole("option", {
      name: "Creditable exchange toward an LL.M.",
      exact: true,
    })
    .click()
  assert.equal(
    await openLinks.count(),
    5,
    "translated filter labels preserve canonical raw filter values",
  )
  await page.getByRole("button", { name: "Reset", exact: true }).first().click()
  await expectText(
    page.locator("main"),
    /16 result\(s\)/,
    "reset restores all German partnerships",
  )

  await page.getByRole("button", { name: "Show 12 more" }).click()
  assert.equal(await openLinks.count(), 16, "pagination reveals all 16 cards")

  await search.fill("Vanderbilt Law School")
  assert.equal(await openLinks.count(), 1, "search filters German partnerships")
  await search.fill("")

  await openLinks.first().click()
  await page.waitForURL(/\/partnership\/[^/]+$/)
  const germanBackLink = page.getByRole("link", {
    name: "Back to search",
    exact: true,
  })
  assert.equal(
    await germanBackLink.getAttribute("href"),
    "/germany",
    "German details return to Germany",
  )
  await expectText(
    page.locator("main"),
    /United States/,
    "German details translate canonical country values",
  )

  await page.goto(`${baseUrl}/germany`)
  await page.getByRole("heading", {
    level: 1,
    name: "Find a U.S. LL.M. through a German university.",
  }).waitFor()
  await expectText(
    page.locator("#cost-estimator"),
    /Germany - U\.S\. flights/,
    "Germany simulator uses Germany–U.S. flight copy",
  )
  await expectText(
    page.locator("#cost-estimator"),
    /Possible fees at the German university/,
    "Germany simulator uses German university fee copy",
  )
  const germanFeeRow = page
    .locator("#cost-estimator")
    .getByText("Possible fees at the German university", { exact: true })
    .first()
    .locator("../..")
  await expectText(
    germanFeeRow,
    /\$0/,
    "Germany university fee default is zero",
  )

  await page.getByRole("button", { name: "Español" }).click()
  await page.getByRole("heading", {
    level: 1,
    name: "Encuentra un LL.M estadounidense a través de una universidad alemana.",
  }).waitFor()
  await expectText(
    page.locator("main"),
    /Estados Unidos/,
    "Spanish cards translate the partner country",
  )
  await expectText(
    page.locator("main"),
    /Intercambio con créditos computables para un LL\.M\./,
    "Spanish cards translate German pathway values",
  )
  const spanishSearch = page.getByRole("textbox", {
    name: "Búsqueda global",
  })
  await spanishSearch.fill("Estados Unidos")
  await expectText(
    page.locator("main"),
    /16 resultado\(s\)/,
    "Spanish country translation participates in search",
  )
  await spanishSearch.fill(
    "Intercambio con créditos computables para un LL.M.",
  )
  assert.equal(
    await page.getByRole("link", { name: "Abrir", exact: true }).count(),
    5,
    "Spanish pathway translation participates in search",
  )
  await spanishSearch.fill("")

  await page.getByRole("button", { name: "Français" }).click()
  await page.goto(`${baseUrl}/`)
  await page.getByRole("heading", {
    level: 1,
    name: /Annuaire des partenariats LL\.M/,
  }).waitFor()
  await expectText(
    page.locator("#cost-estimator"),
    /Billets d'avion France - États-Unis/,
    "French simulator keeps France–U.S. flight copy by default",
  )
  const frenchFeeRow = page
    .locator("#cost-estimator")
    .getByText("Frais éventuels à l'université française", { exact: true })
    .first()
    .locator("../..")
  await expectText(
    frenchFeeRow,
    /\$700/,
    "French simulator keeps its existing university-fee default",
  )
  const frenchOpenLink = page
    .getByRole("link", { name: "Ouvrir", exact: true })
    .first()
  await frenchOpenLink.click()
  await page.waitForURL(/\/partnership\/[^/]+$/)
  assert.equal(
    await page
      .getByRole("link", { name: "Retour à la recherche", exact: true })
      .getAttribute("href"),
    "/",
    "French details keep returning to the French directory",
  )

  console.log("Germany browser integration verified")
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
