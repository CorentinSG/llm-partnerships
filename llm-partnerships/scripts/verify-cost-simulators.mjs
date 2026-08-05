import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as delay } from "node:timers/promises"

import jitiModule from "jiti"
import { chromium } from "playwright"

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptsDirectory, "..")
const require = createRequire(import.meta.url)
const jiti = jitiModule(import.meta.url, {
  alias: { "@": join(projectRoot, "src") },
})
const cost = jiti(join(projectRoot, "src", "lib", "us-cost-estimates.ts"))

const countries = [
  {
    name: "France",
    route: "/",
    partnerships: jiti(join(projectRoot, "src", "lib", "data.ts"))
      .getAllPartnerships(),
    originFeeLabel: "Frais éventuels à l'université française",
    originFee: "$700",
  },
  {
    name: "Allemagne",
    route: "/germany",
    partnerships: jiti(join(projectRoot, "src", "lib", "germany-data.ts"))
      .getAllGermanPartnerships(),
    originFeeLabel: "Frais éventuels à l'université allemande",
    originFee: "$0",
  },
  {
    name: "Italie",
    route: "/italy",
    partnerships: jiti(join(projectRoot, "src", "lib", "italy-data.ts"))
      .getAllItalianPartnerships(),
    originFeeLabel: "Frais éventuels à l'université italienne",
    originFee: "$0",
  },
  {
    name: "Royaume-Uni",
    route: "/uk",
    partnerships: jiti(join(projectRoot, "src", "lib", "uk-data.ts"))
      .getAllUkPartnerships(),
    originFeeLabel: "Frais éventuels à l'université britannique",
    originFee: "$0",
  },
  {
    name: "Suisse",
    route: "/switzerland",
    partnerships: jiti(
      join(projectRoot, "src", "lib", "switzerland-data.ts"),
    ).getAllSwissPartnerships(),
    originFeeLabel: "Frais éventuels à l'université suisse",
    originFee: "$0",
  },
]

for (const country of countries) {
  const resolutions = cost.getPartnershipCostResolutions(country.partnerships)
  assert.equal(
    resolutions.length,
    country.partnerships.length,
    `${country.name}: every partnership must have a simulator resolution`,
  )
  assert.equal(
    new Set(resolutions.map(({ partnership }) => partnership.id)).size,
    country.partnerships.length,
    `${country.name}: every partnership must appear exactly once`,
  )
  assert.ok(
    resolutions.every(({ status }) =>
      status === "supported" || status === "unsupported"
    ),
    `${country.name}: every destination must expose an explicit status`,
  )
  country.resolutions = resolutions
}

const hostname = "127.0.0.1"
const port = 4182
const baseUrl = `http://${hostname}:${port}`
const nextCli = require.resolve("next/dist/bin/next")
const server = spawn(
  process.execPath,
  [nextCli, "dev", "--hostname", hostname, "--port", String(port)],
  {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
  },
)
let serverOutput = ""
server.stdout.on("data", (chunk) => { serverOutput += chunk })
server.stderr.on("data", (chunk) => { serverOutput += chunk })

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode != null) {
      throw new Error(`Next server exited early:\n${serverOutput}`)
    }
    try {
      if ((await fetch(baseUrl)).ok) return
    } catch {}
    await delay(250)
  }
  throw new Error(`Timed out waiting for Next server:\n${serverOutput}`)
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })

  for (const country of countries) {
    const context = await browser.newContext({
      viewport: { width: 1365, height: 900 },
    })
    const page = await context.newPage()
    await page.goto(`${baseUrl}${country.route}`)

    const simulator = page.locator("#cost-estimator")
    await simulator.waitFor({ state: "visible" })
    const supported = country.resolutions.find(
      ({ status }) => status === "supported",
    )
    assert.ok(supported?.estimate, `${country.name}: needs a supported fixture`)

    const citySelect = simulator.getByRole("combobox", { name: "1. Ville" })
    await citySelect.click()
    await page
      .getByRole("option", { name: supported.displayCity, exact: true })
      .click()

    const partnershipSelect = simulator.getByRole("combobox", {
      name: "2. Partenariat",
    })
    await partnershipSelect.click()
    await page
      .locator(`[data-partnership-id="${supported.partnership.id}"]`)
      .click()
    assert.match(
      await simulator
        .getByRole("combobox", { name: "École de référence" })
        .innerText(),
      new RegExp(
        supported.estimate.referenceSchool.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ),
      `${country.name}: partnership selection must use its matching estimate`,
    )

    const originFeeRow = simulator
      .getByText(country.originFeeLabel, { exact: true })
      .first()
      .locator("../..")
    assert.match(
      await originFeeRow.innerText(),
      new RegExp(country.originFee.replace("$", "\\$")),
      `${country.name}: origin-university fee must use the country default`,
    )

    const slider = simulator.locator('input[type="range"]').first()
    await slider.waitFor({ state: "visible" })
    const sliderRow = slider.locator("..")
    const before = await sliderRow.innerText()
    const current = Number(await slider.inputValue())
    const max = Number(await slider.getAttribute("max"))
    const min = Number(await slider.getAttribute("min"))
    const next = current < max ? Math.min(max, current + 100) : Math.max(min, current - 100)
    assert.notEqual(next, current, `${country.name}: slider needs an editable range`)
    await slider.fill(String(next))
    assert.equal(Number(await slider.inputValue()), next)
    assert.notEqual(
      await sliderRow.innerText(),
      before,
      `${country.name}: changing a cost must update the displayed amount`,
    )

    const unsupported = country.resolutions.find(
      ({ status }) => status === "unsupported",
    )
    if (unsupported) {
      await citySelect.click()
      await page
        .getByRole("option", { name: unsupported.displayCity, exact: true })
        .click()
      assert.match(
        await simulator.getByRole("status").innerText(),
        /Aucune estimation annuelle n[’']est disponible/,
        `${country.name}: unsupported destinations must remain explicit`,
      )
    }

    await page.setViewportSize({ width: 390, height: 844 })
    await simulator.scrollIntoViewIfNeeded()
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `${country.name}: simulator must not overflow on mobile`,
    )
    await context.close()
  }

  console.log(
    `Cost simulators verified for ${countries.map(({ name }) => name).join(", ")}`,
  )
} finally {
  await browser?.close()
  server.kill("SIGTERM")
}
