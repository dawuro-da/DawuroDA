import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContactSlice } from "./types";
import { ContactUs, Subscriber } from "@prisma/client";

export const defaultContactSlice: ContactSlice = {
  contactUs: [],
  subscriber: [],
};

const contactSlice = createSlice({
  name: "contact",
  initialState: defaultContactSlice,
  reducers: {
    setContactUs(state, { payload }: PayloadAction<ContactUs[]>) {
      return {
        ...state,
        contactUs: payload,
      };
    },
    setSubscriber(state, { payload }: PayloadAction<Subscriber[]>) {
      return {
        ...state,
        subscriber: payload,
      };
    },
  },
});

export default contactSlice;
