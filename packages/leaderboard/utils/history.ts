import path from "node:path";
import { createReadStream } from "node:fs";
import { orderBy, map } from "lodash-es";
import ndjson from "ndjson";

const SRC = path.join(process.cwd(), "data", "history.ndjson");

// FIXME: type
export type Row = {
  id: string;
  aborted: boolean;
  wordleId: number;
  userName: string;
  turns: number;
  duration: number;
  success: number;
  log?: string;
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

export const groupByUser = (rows: Row[]): Record<string, Row[]> =>
  rows.reduce(
    (groups, row) => ({
      ...groups,
      [row.userName]: (groups[row.userName] ?? []).concat(row),
    }),
    {} as Record<string, Row[]>
  );

export const aggregate = (rows: Row[], userName: string): Row => {
  const successRows = rows.filter((r) => r.success);
  return {
    id: userName,
    aborted: rows.some((r) => r.aborted),
    wordleId: -1,
    userName,
    turns: successRows.reduce((sum, r) => sum + r.turns, 0),
    duration: successRows.reduce((sum, r) => sum + r.duration, 0),
    success: successRows.length,
  };
};

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
