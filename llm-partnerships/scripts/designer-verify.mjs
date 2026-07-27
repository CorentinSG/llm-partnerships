import { chromium } from "playwright";

const baseURL = process.env.DESIGNER_VERIFY_URL || "http://127.0.0.1:3000";
const routes = [
  "/",
  "/germany",
  "/partnership/mannheim-vanderbilt-scholarship",
  "/alternatives",
  "/guide",
  "/submit"
];
const viewports = [
  { name: "mobile", width: 375, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 1000 }
];

const browser = await chromium.launch();
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (!text.includes("Failed to fetch RSC payload")) {
        consoleErrors.push(text);
      }
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  for (const route of routes) {
    const url = new URL(route, baseURL).toString();
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 45000
    });
    await page.waitForTimeout(750);
    const status = response?.status() ?? 0;
    if (status >= 400 || status === 0) {
      failures.push(`${viewport.name} ${route}: HTTP ${status}`);
      continue;
    }

    const title = await page.title();
    const bodyText = (await page.locator("body").innerText()).trim();
    if (!title) failures.push(`${viewport.name} ${route}: missing page title`);
    if (bodyText.length < 80) failures.push(`${viewport.name} ${route}: suspiciously little body text`);

    const overflowReport = await page.evaluate(() => {
      const pageOverflow = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth
      ) - window.innerWidth;
      const elements = Array.from(document.querySelectorAll("body *"));
      const visibleElementOverflow = elements.filter((element) => {
        const style = window.getComputedStyle(element);
        if (style.overflowX === "hidden" || style.overflowX === "clip") return false;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return element.scrollWidth > Math.ceil(rect.width) + 1;
      }).length;
      return { pageOverflow, visibleElementOverflow };
    });
    if (overflowReport.pageOverflow > 1) {
      failures.push(
        `${viewport.name} ${route}: page overflow ${overflowReport.pageOverflow}px, ${overflowReport.visibleElementOverflow} visible overflowing elements`
      );
    }
  }

  if (consoleErrors.length > 0) {
    failures.push(`${viewport.name}: console errors:\n${consoleErrors.join("\n")}`);
  }
  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Designer verification passed for ${baseURL}`);
