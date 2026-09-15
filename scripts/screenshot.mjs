import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000";
const out = process.argv[3] || "screenshot.png";
const width = Number(process.argv[4] || 1600);
const height = Number(process.argv[5] || 1000);

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: out, fullPage: true });

console.log("Saved:", out);
if (errors.length) {
  console.log("--- console errors ---");
  for (const e of errors) console.log(e);
} else {
  console.log("No console errors.");
}
await browser.close();
