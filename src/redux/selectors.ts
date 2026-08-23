import { DawuroDAAppState } from "./store";

export const selectSubscribers = (state: DawuroDAAppState) =>
  state.contact.subscriber;
export const selectContactUs = (state: DawuroDAAppState) =>
  state.contact.contactUs;
