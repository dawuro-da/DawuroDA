"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { initGammodaState } from "@/redux/store";
import { ThemeProvider, createTheme } from "@mui/material";
import { NextFont } from "next/dist/compiled/@next/font";
import Notifications from "@/components/shared/Notifications";

type Props = {
  children?: React.ReactNode;
  session: any;
  font: NextFont;
};

export const NextAuthAndStoreProvider = ({
  children,
  session,
  font,
}: Props) => {
  const store = initGammodaState();

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
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Notifications />
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};
