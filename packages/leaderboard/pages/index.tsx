import type { GetStaticProps, NextPage } from "next";
import {
  ScoreBoard,
  rankColumn,
  userLinkColumn,
  statusColumn,
  turnsColumn,
  durationColumn,
  detailLinkColumn,
} from "../components/ScoreBoard";
import { pluckSummary, query, Row, sortByScore } from "../utils/history";
import { LayoutLeaderboard } from "../layouts/Leaderboard";
import { SEO } from "../components/SEO";

type Props = {
  rows: Row[];
  maxWordleId: number;
};

const Home: NextPage<Props> = (props) => {
  const { rows, maxWordleId } = props;

  return (
    <LayoutLeaderboard title="Leaderboard" maxWordleId={maxWordleId}>
      <SEO title="Leaderboard" />
      <ScoreBoard
        rows={rows}
        columns={[
          rankColumn(),
          userLinkColumn(),
          statusColumn(),
          turnsColumn(),
          durationColumn(),
          detailLinkColumn(),
        ]}
      />
    </LayoutLeaderboard>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { maxWordleId, rows } = await query();
  return {
    props: {
      rows: pluckSummary(
        sortByScore(rows.filter((r) => r.wordleId === maxWordleId))
      ),
      maxWordleId,
    },
  };
};

export default Home;
