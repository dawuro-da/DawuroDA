import { AlertColor } from "@mui/material/Alert";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShowToastPayload {
  type: AlertColor;
  message: string;
  anchorOrigin?: SnackbarOrigin;
}

export type ShownToast = ShowToastPayload & { id: number };

interface ShownModalSpinner {
  message: string;
}

interface NotificationsState {
  currentToast?: ShownToast;
  /** Non-interactive modal with spinner that blocks user interaction */
  currentModalSpinner?: ShownModalSpinner;
}

let shownToastID = 0;

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {} as NotificationsState,
  reducers: {
    showToast: (state, { payload }: PayloadAction<ShowToastPayload>) => {
      shownToastID++;
      state.currentToast = { id: shownToastID, ...payload };
    },

    showModalSpinner: (
      state,
      { payload }: PayloadAction<ShownModalSpinner>
    ) => {
      state.currentModalSpinner = payload;
    },

    clearModalSpinner: (state) => {
      delete state.currentModalSpinner;
    },
  },
});

export default notificationsSlice;
