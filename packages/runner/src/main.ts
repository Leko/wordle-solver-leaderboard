import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";
import { run } from "./runner";

async function main(browser: Browser) {
  const mock = {
    name: "debug",
    launch: ["npx", "ts-node", "-T", "src/mock.ts"],
  };
  const ctx = await browser.createIncognitoBrowserContext();
  const page = await ctx.newPage();
  const abort = new AbortController();
  const abortTimeout = setTimeout(() => abort.abort(), 120 * 1000);
  const result = await run(page, mock, { signal: abort.signal });
  clearTimeout(abortTimeout);
  console.log(result);
}

puppeteer
  .launch({
    product: "chrome",
    headless: !process.argv.includes("--headed"),
  })
  .then((browser) => main(browser).finally(() => browser.close()))
  .catch((e: Error) => {
    console.error(e.stack);
    process.exit(1);
  });
