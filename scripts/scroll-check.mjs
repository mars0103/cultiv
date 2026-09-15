import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
console.log("scrollHeight:", scrollHeight);

const fractions = [0, 0.06, 0.14, 0.22, 0.30, 0.42, 0.5, 0.58, 0.68, 0.78, 0.86, 0.93, 0.98];
for (const f of fractions) {
  const y = Math.round(f * (scrollHeight - 1000));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1200);
  const file = `scroll-${String(Math.round(f * 100)).padStart(3, "0")}.png`;
  await page.screenshot({ path: file });
  console.log(`f=${f} y=${y} -> ${file}`);
}

console.log(errors.length ? "--- console errors ---\n" + errors.join("\n") : "No console errors.");
await browser.close();
