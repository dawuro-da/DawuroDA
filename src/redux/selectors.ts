import { GammodaAppState } from "./store";

export const selectSubscribers = (state: GammodaAppState) =>
  state.contact.subscriber;
export const selectContactUs = (state: GammodaAppState) =>
  state.contact.contactUs;
