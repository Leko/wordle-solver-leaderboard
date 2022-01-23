import readline from "node:readline";
import { spawn } from "node:child_process";
import type { Page } from "puppeteer";
import { WordlePage } from "./pageObjects/WordlePage";

interface Project {
  repository: string;
  launch: string[];
}
interface RunResult {}

export async function run(
  page: Page,
  project: Project,
  { signal }: { signal: AbortSignal }
): Promise<RunResult> {
  const wordle = await WordlePage.open(page);
  await wordle.dismissDialog();

  const words: string[] = [];
  const evaluations: string[][] = [];
  let turns = 1;
  let log = "";

  performance.mark("RUNNER_START");
  const child = spawn(project.launch[0], project.launch.slice(1), {
    cwd: project.repository,
  });
  child.stderr.on("data", (chunk) => (log += chunk));
  signal.addEventListener("abort", () => {
    child.kill();
  });
  const rl = readline.createInterface({
    input: child.stdout,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (child.killed || turns > 6) {
      turns = -1;
      break;
    }
    const word = line.toString().trim();
    if (word.length !== 5) {
      console.error("invalid line:", JSON.stringify(line));
      continue;
    }
    try {
      const result = await wordle.type(word);
      words.push(word);
      evaluations.push(result);
      if (result.every((res) => res === "correct")) {
        break;
      }
      child.stdin.write(result.join(",") + "\n");
      turns++;
    } catch (e) {
      if ((e as Error)?.message === "Not in word list") {
        child.stdin.write("NOT_IN_WORD_LIST");
        child.stdin.write("\n");
        continue;
      }
      throw e;
    }
  }
  rl.close();
  child.stdin.end();
  child.kill();
  performance.mark("RUNNER_END");

  return {
    wordleId: await wordle.getWordleID(),
    aborted: signal.aborted,
    turns,
    words,
    evaluations,
    log: log.slice(0, 1024 * 5), // up to 5kb
    duration: performance.measure("RUN", "RUNNER_START", "RUNNER_END").duration,
  };
}
