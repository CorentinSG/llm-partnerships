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
  const page = await browser.newPage({ viewport: { width: 1680, height: 1000 } })

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

  const germanyMap = page.getByRole("img", {
    name: "Map of Germany with university points",
  })
  const freieBerlinMarker = germanyMap.getByRole("button", {
    name: "Freie Universität Berlin",
    exact: true,
  })
  const humboldtBerlinMarker = germanyMap.getByRole("button", {
    name: "Humboldt-Universität zu Berlin",
    exact: true,
  })
  assert.equal(await freieBerlinMarker.getAttribute("tabindex"), "0")
  await freieBerlinMarker.focus()
  assert.equal(
    await freieBerlinMarker.evaluate(
      (element) => element === document.activeElement,
    ),
    true,
    "Germany markers must receive keyboard focus",
  )
  await freieBerlinMarker
    .locator('[data-focus-ring="true"]')
    .waitFor({ state: "visible" })
  const freieBox = await freieBerlinMarker.boundingBox()
  const humboldtBox = await humboldtBerlinMarker.boundingBox()
  assert.ok(freieBox && humboldtBox, "Berlin markers must be rendered")
  const freieCenter = {
    x: freieBox.x + freieBox.width / 2,
    y: freieBox.y + freieBox.height / 2,
  }
  const humboldtCenter = {
    x: humboldtBox.x + humboldtBox.width / 2,
    y: humboldtBox.y + humboldtBox.height / 2,
  }
  assert.ok(
    Math.hypot(
      freieCenter.x - humboldtCenter.x,
      freieCenter.y - humboldtCenter.y,
    ) >= 12,
    "nearby Berlin points must be separated by proximity, not exact rounding",
  )
  await freieBerlinMarker.press("Enter")
  await expectText(
    page.locator("main"),
    /Selection: Freie Universität Berlin/,
    "Germany marker activates with Enter",
  )
  await freieBerlinMarker.press("Enter")

  await usMapTab.click()
  const usMap = page.getByRole("img", {
    name: "Map of the contiguous United States with clickable states",
  })
  const californiaState = usMap.getByRole("button", {
    name: /California/,
  })
  assert.equal(await californiaState.getAttribute("tabindex"), "0")
  assert.equal(await californiaState.getAttribute("aria-pressed"), "false")
  await californiaState.focus()
  await californiaState
    .locator('[data-focus-ring="true"]')
    .waitFor({ state: "visible" })
  await californiaState.press(" ")
  assert.equal(
    await californiaState.getAttribute("aria-pressed"),
    "true",
    "U.S. state activates with Space",
  )
  await californiaState.press(" ")
  for (const marker of await usMap.locator('[tabindex="0"]').all()) {
    assert.ok(
      (await marker.getAttribute("aria-label"))?.trim(),
      "every focusable U.S. map marker must have an accessible name",
    )
  }
  await germanyMapTab.click()

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

  const simulator = page.locator("#cost-estimator")
  const citySelect = simulator.getByRole("combobox", { name: "1. City" })
  await citySelect.click()
  const germanSimulatorCities = await page.getByRole("option").allTextContents()
  assert.equal(
    germanSimulatorCities.includes("New York, NY"),
    false,
    "German simulator excludes irrelevant global cost cities",
  )
  assert.ok(
    germanSimulatorCities.includes("Hartford"),
    "unsupported German destinations remain selectable",
  )
  await page.getByRole("option", { name: "Hartford", exact: true }).click()
  await expectText(
    simulator.getByRole("status"),
    /No annual cost estimate is available for this destination/,
    "unsupported destinations show an explicit state",
  )

  await citySelect.click()
  await page
    .getByRole("option", { name: "Washington, DC", exact: true })
    .click()
  const germanPartnershipSelect = simulator.getByRole("combobox", {
    name: "2. Partnership",
  })
  await germanPartnershipSelect.click()
  await page
    .locator(
      '[data-partnership-id="augsburg-george-washington-exchange-credit"]',
    )
    .waitFor()
  await page.keyboard.press("Escape")
  const germanOfferSelect = simulator.getByRole("combobox", {
    name: "3. Applied offer",
  })
  assert.doesNotMatch(
    (await germanOfferSelect.innerText()) || "",
    /\$0/,
    "exchange-only waiver must not zero annual LL.M. tuition",
  )

  await citySelect.click()
  await page.getByRole("option", { name: "Boston, MA", exact: true }).click()
  await germanPartnershipSelect.click()
  await page
    .locator(
      '[data-partnership-id="duesseldorf-suffolk-graduate-scholarship"]',
    )
    .click()
  await expectText(
    germanOfferSelect,
    /Public rate/,
    "conditional or historical benefits default to public tuition",
  )
  await germanOfferSelect.click()
  await page
    .getByRole("option", { name: /Scenario — / })
    .first()
    .waitFor()
  await page.keyboard.press("Escape")

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
  const franceMap = page.getByRole("img", {
    name: "Carte de France avec points des universités",
  })
  const frenchMarkers = await franceMap.locator('[tabindex="0"]').all()
  assert.ok(frenchMarkers.length > 0)
  for (const marker of frenchMarkers) {
    assert.ok(
      (await marker.getAttribute("aria-label"))?.trim(),
      "every focusable French map marker must have an accessible name",
    )
  }
  await frenchMarkers[0].focus()
  await frenchMarkers[0]
    .locator('[data-focus-ring="true"]')
    .waitFor({ state: "visible" })
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
