import path from "node:path";
import { createReadStream } from "node:fs";
import { orderBy, map } from "lodash-es";
import ndjson from "ndjson";

const SRC = path.join(process.cwd(), "data", "history.ndjson");

// FIXME: type
export type Row = {
  id: string;
  aborted: string;
  wordleId: number;
  userName: string;
  turns: number;
  duration: number;
  success: boolean;
  words?: string[];
  evaluations?: ("present" | "absent" | "correct")[][];
};

export async function query(): Promise<{ maxWordleId: number; rows: Row[] }> {
  const parseStream = createReadStream(SRC).pipe(ndjson.parse());
  const rows: Row[] = [];
  let maxWordleId: number = 0;
  for await (const row of parseStream) {
    maxWordleId = Math.max(maxWordleId, row.wordleId);
    rows.push({
      id: [row.wordleId, row.userName].join(":"),
      success: !row.aborted && row.turns > 0 && row.exitCode === 0,
      ...row,
    });
  }
  return {
    maxWordleId,
    rows,
  };
}

export const sortByScore = (rows: Row[]): Row[] =>
  orderBy(
    rows,
    ["wordleId", "success", "turns", "duration"],
    ["desc", "desc", "asc", "asc"]
  );

export const pluckSummary = (rows: Row[]): Row[] =>
  rows.map((row) => ({
    id: row.id,
    aborted: row.aborted,
    userName: row.userName,
    duration: row.duration,
    turns: row.turns,
    wordleId: row.wordleId,
    success: row.success,
  }));
