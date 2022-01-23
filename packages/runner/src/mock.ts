import readline from "node:readline";

const words = ["brink", "xxxxx", "blank", "audio", "rales", "count", "prank"];

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    console.error(line);
    console.log(words.shift());
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

console.log(words.shift());
main();
