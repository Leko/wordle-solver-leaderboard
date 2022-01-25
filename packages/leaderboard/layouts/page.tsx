import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./page.module.css";

type Props = {
  title: string;
};

export const LayoutPage: React.FC<Props> = ({ children, title }) => {
  return (
    <Box bgcolor="background.default" className={styles.root}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              Wordle solver contest
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="md" className={styles.main}>
        <Typography variant="h1" className={styles.title}>
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
};
