export type Project =
  | {
      runtime: "nodejs";
      npm: string;
    }
  | {
      runtime: "deno";
      entrypoint: string;
    };

export const contestants: Record<string, Project> = {
  Leko: {
    runtime: "nodejs",
    npm: "@lekoleko/wordle-solver",
  },
  example_node: {
    runtime: "nodejs",
    npm: "wordle-solver-example",
  },
  yamatatsu: {
    runtime: "deno",
    entrypoint:
      "https://raw.githubusercontent.com/Leko/wordle-cli/repl/repl.ts",
  },
};
