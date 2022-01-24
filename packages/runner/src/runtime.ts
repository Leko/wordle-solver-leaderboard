import { spawn } from "node:child_process";
import type { Project } from "./contestants";

export function spawnRuntime(project: Project) {
  switch (project.runtime) {
    case "nodejs":
      return spawn("docker", [
        "run",
        "-i",
        "--rm",
        "--memory=128m",
        "node:16-alpine",
        "npx",
        project.npm,
      ]);
    case "deno":
      return spawn("docker", [
        "run",
        "-i",
        "--rm",
        "--memory=128m",
        "denoland/deno:alpine-1.18.0",
        "run",
        project.entrypoint,
      ]);
    default:
      throw new Error(`Unrecognized runtime`);
  }
}
