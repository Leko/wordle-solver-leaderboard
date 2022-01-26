import { Typography } from "@mui/material";
import { theme } from "../theme";
import { Row } from "../utils/history";
import styles from "./WordTiles.module.css";

type Props = Pick<Row, "words" | "evaluations"> & {
  showWords: boolean;
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

export function WordTiles(props: Props) {
  const { words, evaluations, showWords } = props;

  return (
    <table className={styles.table}>
      <tbody>
        {evaluations!.map((evaluation, i) => (
          <tr key={i}>
            {evaluation!.map((e, j) => (
              <td key={j} className={styles.cell} style={styleMap[e]}>
                {showWords ? (
                  <Typography variant="button">{words![i][j]}</Typography>
                ) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
