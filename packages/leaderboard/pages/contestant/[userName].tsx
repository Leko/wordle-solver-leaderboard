import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ScoreBoard } from "../../components/ScoreBoard";
import { pluckSummary, query, Row, sortByScore } from "../../utils/history";
import { LayoutPage } from "../../layouts/page";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { NextLinkComposed } from "../../components/NextLinkComposed";
import { SEO } from "../../components/SEO";

type Props = {
  rows: Row[];
};
type PathParams = {
  userName: string;
};

const Home: NextPage<Props> = (props) => {
  const router = useRouter();
  const userName = router.query.userName as string;
  const { rows } = props;

  return (
    <LayoutPage title={userName ?? ""}>
      <Head>
        <SEO title={userName} description={`View all answers by ${userName}`} />
      </Head>
      <ScoreBoard rows={rows} showWordleId showLinkToDetail />
    </LayoutPage>
  );
};

export const getStaticProps: GetStaticProps<Props, PathParams> = async (
  context
) => {
  const { userName } = context.params ?? {};
  if (!userName) {
    // TODO: 404
    throw new Error("userName must be present as a path param");
  }

  const { maxWordleId, rows } = await query();
  return {
    props: {
      rows: pluckSummary(
        sortByScore(rows.filter((r) => r.userName === userName))
      ),
      maxWordleId,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { rows } = await query();
  const userNameSet = new Set(rows.map((r) => r.userName));
  return {
    paths: Array.from(userNameSet).map(
      (userName) => `/contestant/${encodeURIComponent(userName)}`
    ),
    fallback: false,
  };
};

export default Home;
