import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { query, Row } from "../../../utils/history";
import { LayoutPage } from "../../../layouts/page";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCallback, useState } from "react";
import { WordTiles } from "../../../components/WordTiles";
import { SEO } from "../../../components/SEO";

type Props = {
  row: Row;
};
type PathParams = {
  userName: string;
  wordleId: string;
};

const Home: NextPage<Props> = (props) => {
  const router = useRouter();
  const [showWords, setShowWords] = useState(false);
  const userName = router.query.userName as string;
  const wordleId = router.query.wordleId as string;
  const { row } = props;
  const seconds = (row.duration / 1000).toFixed(3);

  const toggleWordsVisibility = useCallback(() => {
    setShowWords((prev) => !prev);
  }, [setShowWords]);

  return (
    <LayoutPage title={`${userName} #${wordleId}` ?? ""}>
      <SEO
        title={`${userName} #${wordleId}`}
        description={
          row.success
            ? `Solved in ${row.turns} turns, in ${seconds} seconds`
            : `Failed to solve`
        }
      />

      <ul style={{ color: "white" }}>
        <li>
          <Typography>success: {JSON.stringify(row.success)}</Typography>
        </li>
        <li>
          <Typography>turns: {JSON.stringify(row.turns)}</Typography>
        </li>
        <li>
          <Typography>aborted: {JSON.stringify(row.aborted)}</Typography>
        </li>
        <li>
          <Typography>duration: {seconds}s</Typography>
        </li>
      </ul>

      <Typography variant="h2">Result</Typography>
      <WordTiles
        words={row.words}
        evaluations={row.evaluations}
        showWords={showWords}
      />
      <Box mt={1}>
        <Button variant="text" onClick={toggleWordsVisibility}>
          Show/Hide actual words
        </Button>
      </Box>

      <Box mt={2} maxWidth="100%">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            Click to open log
          </AccordionSummary>
          <AccordionDetails>
            <Box
              bgcolor="action.hover"
              style={{ padding: 16, overflowX: "scroll" }}
            >
              <Typography component="pre">{row.log?.trim() ?? null}</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </LayoutPage>
  );
};

export const getStaticProps: GetStaticProps<Props, PathParams> = async (
  context
) => {
  const { userName, wordleId: _wordleId } = context.params ?? {};
  const wordleId = parseInt(_wordleId ?? "", 10);
  if (!userName || !wordleId) {
    // TODO: 404
    throw new Error("userName must be present as a path param");
  }
  const { rows } = await query();
  const row = rows.find(
    (r) => r.userName === userName && r.wordleId === wordleId
  );
  if (!row) {
    // TODO: 404
    throw new Error("unrecognized wordle ID and userName");
  }

  return {
    props: {
      row,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { rows } = await query();
  return {
    paths: rows.map(
      (r) =>
        `/history/` + [r.userName, r.wordleId].map(encodeURIComponent).join("/")
    ),
    fallback: false,
  };
};

export default Home;
