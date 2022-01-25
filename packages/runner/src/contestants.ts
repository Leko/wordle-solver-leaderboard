export type Project =
  | {
      runtime: "nodejs";
      npm: string;
      bin?: string;
    }
  | {
      runtime: "deno";
      entrypoint: string;
    }
  | {
      runtime: "rust";
      cargo: string;
      bin?: string;
    };

export const contestants: Record<string, Project> = {
  example_rust: {
    runtime: "rust",
    cargo: "leko-wordle-solver-example",
    bin: "wordle-solver",
  },
  example_node: {
    runtime: "nodejs",
    npm: "wordle-solver-example",
  },
  Leko: {
    runtime: "nodejs",
    npm: "@lekoleko/wordle-solver",
    bin: "wordle-solver",
  },
  yamatatsu: {
    runtime: "deno",
    entrypoint:
      "https://raw.githubusercontent.com/Leko/wordle-cli/repl/repl.ts",
  },
};
