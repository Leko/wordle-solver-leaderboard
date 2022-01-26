import type { GetStaticProps, NextPage } from "next";
import { ScoreBoard } from "../components/ScoreBoard";
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
      <ScoreBoard rows={rows} showLinkToDetail />
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
