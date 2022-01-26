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
      fontWeight: "bold",
    },
    h1: {
      lineHeight: "1.15",
      fontSize: "4rem",
      marginTop: 16,
      marginBottom: 8,
    },
    h2: {
      lineHeight: "1.15",
      fontSize: "3rem",
      marginTop: 16,
      marginBottom: 8,
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
