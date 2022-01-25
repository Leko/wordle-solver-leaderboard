import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { query, Row } from "../../../utils/history";
import { LayoutPage } from "../../../layouts/page";
import { Box, Typography } from "@mui/material";
import { theme } from "../../../theme";

type Props = {
  row: Row;
};
type PathParams = {
  userName: string;
  wordleId: string;
};

const styleMap = {
  correct: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main,
  },
  present: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.warning.main,
  },
  absent: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.text.disabled,
  },
};

const Home: NextPage<Props> = (props) => {
  const router = useRouter();
  const userName = router.query.userName as string;
  const wordleId = router.query.wordleId as string;
  const { row } = props;

  return (
    <LayoutPage title={`${userName} #${wordleId}` ?? ""}>
      <Head>
        <title>
          {userName} #{wordleId} | Wordle solver contest
        </title>
        <meta name="description" content="TODO" />
      </Head>

      <Typography>
        <ul>
          <li>success: {JSON.stringify(row.success)}</li>
          <li>turns: {JSON.stringify(row.turns)}</li>
          <li>aborted: {JSON.stringify(row.aborted)}</li>
          <li>duration: {(row.duration / 1000).toFixed(3)}s</li>
        </ul>
      </Typography>

      <Typography variant="h2">Result</Typography>
      <ul>
        {
          // @ts-expect-error
          row.evaluations.map((evaluation, i) => (
            <li key={i}>
              <Typography>
                {evaluation.map((e, j) => (
                  <span
                    key={j}
                    style={{
                      display: "inline-block",
                      width: "24px",
                      height: "24px",
                      textAlign: "center",
                      verticalAlign: "center",
                      ...styleMap[e],
                    }}
                  >
                    {row.words[i][j]}
                  </span>
                ))}
              </Typography>
            </li>
          ))
        }
      </ul>

      <Typography variant="h2">Log</Typography>
      <Box
        bgcolor="action.hover"
        style={{ padding: 16, width: "100%", overflowX: "scroll" }}
      >
        <Typography>
          <pre style={{ margin: 0 }}>
            {
              // @ts-expect-error
              row.log.trim()
            }
          </pre>
        </Typography>
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
