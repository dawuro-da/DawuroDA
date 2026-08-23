import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { DawuroDAState as initialDataType } from "./types";
import contactSlice from "./contactSlice";
import notificationsSlice from "./notificationSlice";

const reducer = {
  [contactSlice.name]: contactSlice.reducer,
  [notificationsSlice.name]: notificationsSlice.reducer,
};

export const initDawuroDAState = () => {
  const configureMiddleware = (getDefaultMiddleware: any) => {
    return getDefaultMiddleware();
  };

  return configureStore({
    reducer,
    middleware: configureMiddleware,
  });
};

export type DawuroDAAppState = StateFromReducersMapObject<typeof reducer>;

type DawuroDAStore = ReturnType<typeof initDawuroDAState>;

export type DawuroDADispatch = DawuroDAStore["dispatch"];

/** Typed hook to access the chatbot store */
export const useDawuroDADispatch = () => useDispatch<DawuroDADispatch>();
