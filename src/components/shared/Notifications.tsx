"use client";

import { DawuroDAAppState } from "@/redux/store";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Portal from "@mui/material/Portal";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const selectToast = (state: DawuroDAAppState) => state.notifications.currentToast;
const selectModal = (state: DawuroDAAppState) =>
  state.notifications.currentModalSpinner;

const Notifications = () => {
  const lastToast = useSelector(selectToast);
  const [shownToastID, setShownToastID] = useState<number | undefined>(
    undefined
  );

  const currentModal = useSelector(selectModal);

  const currentToast = shownToastID === lastToast?.id ? lastToast : undefined;

  useEffect(() => {
    setShownToastID(lastToast?.id);
  }, [lastToast?.id]);

  const onClose = () => setShownToastID(undefined);

  return (
    <>
      {currentToast && (
        <Portal>
          <Snackbar
            open={true}
            onClose={onClose}
            autoHideDuration={6000}
            anchorOrigin={
              currentToast.anchorOrigin ?? {
                vertical: "top",
                horizontal: "center",
              }
            }
          >
            <Alert severity={currentToast.type}>{currentToast.message}</Alert>
          </Snackbar>
        </Portal>
      )}
      {currentModal && (
        <>
          <Dialog open={true} aria-describedby="alert-dialog-description">
            <DialogContent style={dialogContentStyle}>
              <DialogContentText id="modal-dialog-description">
                {currentModal.message}
              </DialogContentText>

              <CircularProgress />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

const dialogContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "32px",
} as React.CSSProperties;

export default Notifications;
