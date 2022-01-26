import type { GetStaticProps, NextPage } from "next";
import {
  ScoreBoard,
  rankColumn,
  userLinkColumn,
  statusColumn,
  turnsColumn,
  durationColumn,
} from "../../components/ScoreBoard";
import {
  aggregate,
  groupByUser,
  pluckSummary,
  query,
  Row,
  sortByScore,
} from "../../utils/history";
import { LayoutLeaderboard } from "../../layouts/Leaderboard";
import { SEO } from "../../components/SEO";
import { Typography } from "@mui/material";

type Props = {
  rows: Row[];
  maxWordleId: number;
};

const Home: NextPage<Props> = (props) => {
  const { rows, maxWordleId } = props;

  return (
    <LayoutLeaderboard title="Leaderboard" maxWordleId={maxWordleId}>
      <SEO title="All | Leaderboard" />
      <Typography></Typography>
      <ScoreBoard
        rows={rows}
        columns={[
          rankColumn(),
          userLinkColumn(),
          {
            ...statusColumn(),
            valueFormatter({ value }) {
              return value ? `${value} ✅` : "❌";
            },
          },
          {
            ...turnsColumn(),
            width: 120,
            valueFormatter({ api, id, value: _v }) {
              const value = _v as number;
              const success = api.getRow(id!)?.success;
              return success
                ? `${value} (avg. ${(value / success).toFixed(1)})`
                : "-";
            },
          },
          {
            ...durationColumn(),
            width: 200,
            valueFormatter({ api, id, value: _v }) {
              const value = (_v as number) / 1000;
              const success = api.getRow(id!)?.success;
              return success
                ? `${value.toFixed(0)}s (avg. ${(value / success).toFixed(3)}s)`
                : "-";
            },
          },
        ]}
      />
    </LayoutLeaderboard>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { maxWordleId, rows } = await query();
  const groups = groupByUser(rows);
  const aggregated = Object.entries(groups).map(([userName, rows]) =>
    aggregate(rows, userName)
  );
  return {
    props: {
      rows: pluckSummary(sortByScore(aggregated)),
      maxWordleId,
    },
  };
};

export default Home;
