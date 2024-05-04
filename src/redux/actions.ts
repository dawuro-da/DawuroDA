import contactSlice from "./contactSlice";
import notificationsSlice from "./notificationSlice";

export const {
  setContactUs: setContactUsAction,
  setSubscriber: setSubscriberAction,
} = contactSlice.actions;

export const {
  showToast: showToastAction,
  showModalSpinner: showModalSpinnerAction,
  clearModalSpinner: clearModalSpinnerAction,
} = notificationsSlice.actions;
