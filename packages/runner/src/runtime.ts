import { spawn } from "node:child_process";
import path from "node:path";
import type { Project } from "./contestants";

async function build(tag: string, base: string, ...args: string[]) {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", [
      `build`,
      `-t`,
      `${tag}`,
      ...args.flatMap((arg) => [`--build-arg`, arg]),
      `--file`,
      `${base}/Dockerfile`,
      `${base}`,
    ]);
    child.once("error", (e) => {
      child.removeAllListeners("exit");
      reject(e);
    });
    child.once("exit", () => {
      child.removeAllListeners("error");
      resolve(null);
    });
  });
}

export async function spawnRuntime(p: Project, userName: string) {
  const base = path.join(__dirname, "runtimes");
  const image = `${userName.toLowerCase()}:latest`;

  switch (p.runtime) {
    case "nodejs":
      await build(
        image,
        path.join(base, "nodejs"),
        `pkg=${p.npm}`,
        `bin=${p.bin ?? p.npm}`
      );
      break;
    case "deno":
      await build(image, path.join(base, "deno"), `entrypoint=${p.entrypoint}`);
      break;
    case "rust":
      await build(
        image,
        path.join(base, "rust"),
        `cargo=${p.cargo}`,
        `bin=${p.bin ?? p.cargo}`
      );
      break;
    default:
      throw new Error(`Unrecognized runtime`);
  }

  return spawn("docker", ["run", ...getRunOptions(), image]);
}

function getRunOptions(): string[] {
  return [
    "-i",
    "--rm",
    ...getNetworkRestrictions(),
    ...getResouceRestrictions(),
  ];
}
function getNetworkRestrictions(): string[] {
  return [];
}
function getResouceRestrictions(): string[] {
  return ["--memory=128m"];
}
