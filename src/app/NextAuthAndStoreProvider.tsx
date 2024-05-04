"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { initGammodaState } from "@/redux/store";

type Props = {
  children?: React.ReactNode;
  session: any;
};

export const NextAuthAndStoreProvider = ({ children, session }: Props) => {
  const store = initGammodaState();

  return (
    <SessionProvider session={session}>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
};
