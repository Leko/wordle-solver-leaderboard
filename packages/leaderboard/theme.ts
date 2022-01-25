import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    allVariants: {
      letterSpacing: "initial",
      fontFamily: `"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;`,
      color: "#fff",
    },
    h1: {
      fontWeight: "bold",
      lineHeight: "1.15",
      fontSize: "4rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          textTransform: "none",
        },
      },
    },
  },
});
