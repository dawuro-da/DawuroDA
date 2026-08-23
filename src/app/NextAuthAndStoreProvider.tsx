"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { initDawuroDAState } from "@/redux/store";
import { ThemeProvider, createTheme } from "@mui/material";
import { NextFont } from "next/dist/compiled/@next/font";
import Notifications from "@/components/shared/Notifications";

type Props = {
  children?: React.ReactNode;
  font: NextFont;
};

export const NextAuthAndStoreProvider = ({ children, font }: Props) => {
  const store = initDawuroDAState();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#34A858",
      },
    },
    typography: {
      fontFamily: font.style.fontFamily,
    },
  });

  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Notifications />
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};
