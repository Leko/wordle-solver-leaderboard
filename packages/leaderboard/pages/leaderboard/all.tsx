import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ScoreBoard } from "../../components/ScoreBoard";
import { query, Row, sortByScore } from "../../utils/history";
import { LayoutLeaderboard } from "../../layouts/Leaderboard";

type Props = {
  rows: Row[];
  maxWordleId: number;
};

const Home: NextPage<Props> = (props) => {
  const { rows, maxWordleId } = props;

  return (
    <LayoutLeaderboard title="Leaderboard" maxWordleId={maxWordleId}>
      <Head>
        <title>All | Leaderboard | Wordle solver contest</title>
        <meta name="description" content="TODO" />
      </Head>
      <ScoreBoard rows={rows} />
    </LayoutLeaderboard>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { maxWordleId, rows } = await query();
  return {
    props: {
      rows: sortByScore(rows),
      maxWordleId,
    },
  };
};

export default Home;
