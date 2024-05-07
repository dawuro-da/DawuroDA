"use client";
import { Lexend } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const lexend = Lexend({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: {
      main: "#34A858",
    },
  },
  typography: {
    fontFamily: lexend.style.fontFamily,
  },
});

export default theme;
