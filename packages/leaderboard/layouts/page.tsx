import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./page.module.css";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
  NextLinkComposed,
  NextLinkComposedProps,
} from "../components/NextLinkComposed";

type Props = {
  title: string;
};

const links: NextLinkComposedProps[] = [
  { children: "Leaderboard", to: "/" },
  {
    children: "How to participate",
    to: "https://github.com/Leko/wordle-solver-leaderboard/blob/main/CONTRIBUTING.md",
    target: "_blank",
    rel: "noreferer noopener",
  },
];

export const LayoutPage: React.FC<Props> = ({ children, title }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = useCallback(
    (event) => {
      setAnchorElNav(event.currentTarget);
    },
    [setAnchorElNav]
  );
  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, [setAnchorElNav]);

  return (
    <Box bgcolor="background.default" className={styles.root}>
      <AppBar position="static">
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <Link href="/">Wordle solver contest</Link>
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {links.map(({ children, ...rest }, i) => (
                  <MenuItem key={i} component={NextLinkComposed} {...rest}>
                    <Typography textAlign="center">{children}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <Link href="/">Wordle solver contest</Link>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {links.map(({ children, ...rest }, i) => (
                // @ts-expect-error 'component' doesn't exist
                <Button
                  key={i}
                  component={NextLinkComposed}
                  sx={{ my: 2, color: "white", display: "block" }}
                  {...rest}
                >
                  {children}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }} />
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="md" className={styles.main}>
        <Typography variant="h1" className={styles.title}>
          {title}
        </Typography>
        {children}
      </Container>
      <Container component="footer" className={styles.footer}>
        <Typography component="small">
          &copy;{" "}
          <a href="https://leko.jp" target="_blank" rel="noreferrer noopener">
            Leko
          </a>{" "}
          2022
        </Typography>
      </Container>
    </Box>
  );
};
