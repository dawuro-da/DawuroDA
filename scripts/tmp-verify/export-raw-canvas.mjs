import { chromium } from "playwright";
import fs from "fs";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
const txRef = process.argv[2];
const outFile = process.argv[3];
await page.goto(`http://localhost:3100/donation-certificate?tx_ref=${txRef}`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const dataUrl = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  return canvas ? canvas.toDataURL("image/png") : null;
});
if (dataUrl) {
  fs.writeFileSync(outFile, Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64"));
  console.log("saved");
}
await browser.close();
