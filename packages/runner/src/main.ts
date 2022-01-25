import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";
import { run } from "./runner";
import { contestants } from "./contestants";

async function main(browser: Browser) {
  const results = await Promise.all(
    Object.entries(contestants).map(async ([userName, project]) => {
      const page = await browser.newPage();
      const result = await run(page, project, { userName });
      return { userName, ...result };
    })
  );
  results.forEach((result) => {
    console.log(JSON.stringify(result));
  });
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
