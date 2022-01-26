import type { GetStaticProps } from "next";
import {
  aggregate,
  groupByUser,
  pluckSummary,
  query,
  Row,
  sortByScore,
} from "../../utils/history";
import All from "./all";

type Props = {
  rows: Row[];
  maxWordleId: number;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { maxWordleId, rows } = await query();
  const groups = groupByUser(rows);
  const aggregated = Object.entries(groups)
    .map(
      ([userName, rows]) =>
        [
          userName,
          rows.filter((row) => row.wordleId + 7 > maxWordleId),
        ] as const
    )
    .map(([userName, rows]) => aggregate(rows, userName));
  return {
    props: {
      rows: pluckSummary(sortByScore(aggregated)),
      maxWordleId,
    },
  };
};

export default All;
