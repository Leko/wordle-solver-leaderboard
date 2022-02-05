export type Project = { repository: string } & (
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
    }
);

export const contestants: Record<string, Project> = {
  example_rust: {
    repository: "https://gist.github.com/Leko/125e92a263043debc36f5aa895bfd015",
    runtime: "rust",
    cargo: "leko-wordle-solver-example",
    bin: "wordle-solver",
  },
  example_node: {
    repository: "https://gist.github.com/Leko/098674d7a571fd139bcffd73eedff707",
    runtime: "nodejs",
    npm: "wordle-solver-example",
  },
  Leko: {
    repository: "https://github.com/Leko/wordle-solver",
    runtime: "nodejs",
    npm: "@lekoleko/wordle-solver",
    bin: "wordle-solver",
  },
  yamatatsu: {
    repository: "https://github.com/yamatatsu/wordle-cli",
    runtime: "deno",
    entrypoint:
      "https://raw.githubusercontent.com/Leko/wordle-cli/repl/repl.ts",
  },
  nkowne63: {
		repository: "https://github.com/neutron63zf/wordle-solver-rs",
		runtime: "rust",
    cargo: "nkowne63-wordle-solver-rs-01",
    bin: "wordle-solver",
	},
};
