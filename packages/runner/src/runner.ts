import events from "node:events";
import readline from "node:readline";
import type { Page } from "puppeteer";
import { WordlePage } from "./pageObjects/WordlePage";
import { baseLogger } from "./logger";
import { spawnRuntime } from "./runtime";
import type { Project } from "./contestants";

const MAX_TURNS = 6;
const WORD_LENGTH = 5;

interface RunResult {
  wordleId: number;
  aborted: boolean;
  exitCode: number;
  turns: number;
  words: string[];
  evaluations: string[][];
  log: string;
  duration: number;
}

export async function run(
  page: Page,
  project: Project,
  { userName }: { userName: string }
): Promise<RunResult> {
  const debug = baseLogger.extend("project").extend(userName);
  const abort = new AbortController();
  const words: string[] = [];
  const evaluations: string[][] = [];
  let turns = 1;
  let log = "";
  let uiInteraction = 0;

  const [wordle, child] = await Promise.all([
    WordlePage.open(page).then(async (w) => {
      await w.dismissDialog();
      return w;
    }),
    spawnRuntime(project, userName),
  ]);
  const rl = readline.createInterface({
    input: child.stdout,
    crlfDelay: Infinity,
  });
  child.stderr.on("data", (chunk) => (log += chunk));
  child.stderr.on("data", (chunk) => debug("" + chunk));

  abort.signal.addEventListener("abort", () => {
    child.kill();
  });
  const abortTimeout = setTimeout(() => abort.abort(), 300 * 1000);
  const runnerStartedAt = Date.now();

  for await (const line of rl) {
    if (turns > MAX_TURNS) {
      turns = -1;
      break;
    }
    const word = line.toString().trim();
    if (word.length !== WORD_LENGTH) {
      console.error("invalid line:", JSON.stringify(line));
      continue;
    }
    try {
      const uiStartedAt = Date.now();
      const result = await wordle.type(word);
      uiInteraction += Date.now() - uiStartedAt;
      words.push(word);
      evaluations.push(result);
      child.stdin.write(result.join(",") + "\n");
      if (result.some((r) => r !== "correct")) {
        turns++;
      }
    } catch (e) {
      if ((e as Error)?.message === "Not in word list") {
        child.stdin.write("NOT_IN_WORD_LIST\n");
        continue;
      }
      throw e;
    }
  }
  clearTimeout(abortTimeout);
  child.stdin.end();
  rl.close();
  await events.once(child, "exit");

  const duration = Date.now() - runnerStartedAt;
  return {
    wordleId: await wordle.getWordleID(),
    aborted: abort.signal.aborted,
    exitCode: child.exitCode!,
    turns,
    words,
    evaluations,
    log: log.slice(0, 1024 * 5), // up to 5kb
    duration: duration - uiInteraction,
  };
}
