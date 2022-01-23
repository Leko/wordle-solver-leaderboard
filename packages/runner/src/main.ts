import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";
import { run } from "./runner";

const projects = {
  Leko: {
    repository: "/Users/leko/ghq/github.com/Leko/wordle-solver",
    launch: ["npm", "run", "--silent", "dev:evaluate"],
  },
};

async function main(browser: Browser) {
  const results = await Promise.all(
    Object.entries(projects).map(async ([userName, project]) => {
      const page = await browser.newPage();
      const abort = new AbortController();
      const abortTimeout = setTimeout(() => abort.abort(), 300 * 1000);
      const result = await run(page, project, { signal: abort.signal });
      clearTimeout(abortTimeout);
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
