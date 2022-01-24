import { createReadStream } from "fs";
import path from "path";
import { sortBy } from "lodash-es";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import ndjson from "ndjson";
import { useRouter } from "next/router";
import { ScoreBoard, Row } from "../components/ScoreBoard";
import { LayoutPage } from "../layouts/page";

type Props = {
  today: Row[];
  last7days: Row[];
  all: Row[];
};

const Home: NextPage<Props> = (props) => {
  const { today, last7days, all } = props;
  const router = useRouter();
  const hash = router.asPath.includes("#")
    ? router.asPath.slice(router.asPath.indexOf("#"))
    : null;

  function handleChange(_: unknown, hash: string) {
    router.push(hash);
  }

  return (
    <LayoutPage title="Leaderboard">
      <Head>
        <title>Leaderboard | Wordle solver contest</title>
        <meta name="description" content="TODO" />
      </Head>

      <TabContext value={hash ?? "#today"}>
        <Box>
          <TabList aria-label="lab API tabs example" onChange={handleChange}>
            <Tab label={`Today (#${today[0].wordleId})`} value="#today" />
            <Tab label="Last 7 days" value="#last7days" />
            <Tab label="All" value="#all" />
          </TabList>
        </Box>
        <TabPanel value="#today">
          <ScoreBoard rows={today} autoHeight />
        </TabPanel>
        <TabPanel value="#last7days">
          <ScoreBoard rows={last7days} autoHeight />
        </TabPanel>
        <TabPanel value="#all">
          <ScoreBoard rows={all} autoHeight />
        </TabPanel>
      </TabContext>
    </LayoutPage>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const parseStream = createReadStream(
    path.join(process.cwd(), "data", "history.ndjson")
  ).pipe(ndjson.parse());
  const _rows = [];
  let maxWordleId: number = 0;
  for await (const row of parseStream) {
    maxWordleId = Math.max(maxWordleId, row.wordleId);
    _rows.push({
      id: [row.wordleId, row.userName].join(":"),
      aborted: row.aborted,
      userName: row.userName,
      duration: row.duration,
      turns: row.turns,
      wordleId: row.wordleId,
      success: !row.aborted && row.turns > 0 ? -1 : 0, // for sort reason
    });
  }
  const rows = sortBy(_rows, ["wordleId", "success", "turns", "duration"]);
  return {
    props: {
      today: rows.filter((row) => row.wordleId === maxWordleId).slice(0, 20),
      last7days: rows
        .filter((row) => row.wordleId + 7 > maxWordleId)
        .slice(0, 20),
      all: rows,
    },
  };
};

export default Home;
