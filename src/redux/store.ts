import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { GammodaState as initialDataType } from "./types";
import contactSlice from "./contactSlice";
import notificationsSlice from "./notificationSlice";

const reducer = {
  [contactSlice.name]: contactSlice.reducer,
  [notificationsSlice.name]: notificationsSlice.reducer,
};

export const initGammodaState = () => {
  const configureMiddleware = (getDefaultMiddleware: any) => {
    return getDefaultMiddleware();
  };

  return configureStore({
    reducer,
    middleware: configureMiddleware,
  });
};

export type GammodaAppState = StateFromReducersMapObject<typeof reducer>;

type GammodaStore = ReturnType<typeof initGammodaState>;

export type GammodaDispatch = GammodaStore["dispatch"];

/** Typed hook to access the chatbot store */
export const useGammodaDispatch = () => useDispatch<GammodaDispatch>();
