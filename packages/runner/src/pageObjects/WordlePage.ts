import type { Page } from "puppeteer";

export class WordlePage {
  constructor(private page: Page) {}

  static async open(page: Page) {
    await page.goto("https://www.powerlanguage.co.uk/wordle/", {
      waitUntil: "load",
    });
    await page.waitForSelector("pierce/[icon='close']", { visible: true });
    return new WordlePage(page);
  }

  async dismissDialog() {
    await this.page.click("pierce/[icon='close']");
    await this.page.waitForSelector("pierce/[icon='close']", { hidden: true });
  }

  async type(word: string): Promise<string[]> {
    await this.page.type("body", word);
    await this.page.keyboard.press("Enter");
    await this.waitForAnimation(5000);

    const rows = await this.page.$$('pierce/game-row:not([letters=""])');
    const el = rows[rows.length - 1];
    const result = await el.$$eval("pierce/game-tile", (tiles) =>
      tiles.map((tile) => tile.getAttribute("evaluation")!)
    );
    await Promise.all(rows.map((row) => row.dispose()));
    return result;
  }

  async getWordleID() {
    const id = await this.page.evaluate(
      // @ts-expect-error web components
      () => document.querySelector("game-app")?.dayOffset
    );
    if (!id) {
      throw new Error("Failed to fetch wordle ID from: " + JSON.stringify(id));
    }
    return id;
  }

  private async waitForAnimation(timeout: number) {
    let startedAt = Date.now();
    while (1) {
      if (Date.now() - startedAt >= timeout) {
        throw new Error("Animation timeout");
      }
      const rows = await this.page.$$('pierce/game-row:not([letters=""])');
      const el = rows[rows.length - 1];
      const invalid = await el.evaluate((el) => el.hasAttribute("invalid"));
      if (invalid) {
        for (let i = 0; i < 5; i++) {
          await this.page.keyboard.press("Backspace");
        }
        throw new Error("Not in word list");
      }
      const finished = await el?.$$eval("pierce/game-tile", (els) =>
        els.every(
          (el) => !!el.shadowRoot?.querySelector("[data-animation='idle']")
        )
      );
      await Promise.all(rows.map((row) => row.dispose()));
      if (finished) {
        break;
      }
      await this.page.waitForTimeout(200);
    }
  }
}
