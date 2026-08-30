"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { initDawuroDAState } from "@/redux/store";
import { ThemeProvider, createTheme } from "@mui/material";
import { NextFont } from "next/dist/compiled/@next/font";
import Notifications from "@/components/shared/Notifications";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

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
          {/* Initializes i18next once for the whole app. Individual pages
              also wrap themselves in their own I18nextProvider (harmless —
              nested providers just use the nearest one), but any page that
              forgets to do that — like the initiatives detail page did —
              used to crash on a direct/fresh load with "changeLanguage is
              not a function", since react-i18next's default singleton was
              never initialized yet. This root-level provider is the
              permanent fix for that whole class of bug. */}
          <I18nextProvider i18n={i18n}>
            <Notifications />
            {children}
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};
