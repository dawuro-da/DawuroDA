"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { PaymentReceipt } from "@prisma/client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Check, ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import PageHeader from "../shared/PageHeader";

const PAGE_SIZE = 20;

const statusColor: Record<string, string> = {
  Pending: "text-amber-700 bg-amber-100",
  Approved: "text-green-700 bg-green-100",
  Rejected: "text-red-700 bg-red-100",
};

const PaymentReceipts = () => {
  const dispatch = useDispatch();
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string>();
  const [rejectingReceipt, setRejectingReceipt] = useState<PaymentReceipt>();
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/paymentReceipt/fetch", {
        page,
        pageSize: PAGE_SIZE,
        status: statusFilter || undefined,
      });
      if (res.data.success) {
        setReceipts(res.data.value.receipts);
        setTotal(res.data.value.total);
      }
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleApprove = async (receipt: PaymentReceipt) => {
    setApprovingId(receipt.id);
    try {
      const res = await axios.post(
        `/api/cms/paymentReceipt/approve/${receipt.id}`
      );
      if (res.data.success) {
        dispatch(
          showToastAction({ message: "Receipt approved", type: "success" })
        );
        fetchReceipts();
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "Unable to approve receipt",
          type: "error",
        })
      );
    }
    setApprovingId(undefined);
  };

  const handleReject = async () => {
    if (!rejectingReceipt) return;
    setRejecting(true);
    try {
      const res = await axios.post(
        `/api/cms/paymentReceipt/reject/${rejectingReceipt.id}`,
        { rejectionReason: rejectionReason || undefined }
      );
      if (res.data.success) {
        dispatch(
          showToastAction({ message: "Receipt rejected", type: "success" })
        );
        setRejectingReceipt(undefined);
        setRejectionReason("");
        fetchReceipts();
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "Unable to reject receipt",
          type: "error",
        })
      );
    }
    setRejecting(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="p-10 flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-titleColor font-bold text-3xl">
              Payment Receipts
            </span>
            <span className="text-[#7C7C7C] text-sm max-w-xl">
              Manual bank transfer receipts submitted by members. Approving a
              registration receipt activates the member; approving a
              contribution receipt records the payment and advances their
              due date.
            </span>
          </div>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            sx={{ minWidth: 160, backgroundColor: "white" }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="">All</MenuItem>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          {loading && (
            <div className="flex justify-center py-10">
              <CircularProgress size={24} />
            </div>
          )}
          {!loading && receipts.length === 0 && (
            <span className="text-sm text-[#7C7C7C] py-10 text-center">
              No {statusFilter ? statusFilter.toLowerCase() : ""} receipts.
            </span>
          )}
          {receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="flex flex-col gap-2 bg-white rounded-xl p-4"
            >
              <div className="flex flex-row items-center justify-between flex-wrap gap-2">
                <div className="flex flex-row items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-md ${
                      statusColor[receipt.status] ?? "text-gray-700 bg-gray-100"
                    }`}
                  >
                    {receipt.status}
                  </span>
                  <span className="text-xs bg-[#f1f1f1] px-2 py-1 rounded-md">
                    {receipt.paymentType}
                  </span>
                  <span className="font-semibold">{receipt.fullName}</span>
                  <span className="text-sm text-[#7C7C7C]">
                    {receipt.phone}
                  </span>
                </div>
                <span className="text-xs text-[#7C7C7C]">
                  {new Date(receipt.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-[#555555] flex flex-row flex-wrap gap-x-6 gap-y-1">
                <span>
                  Bank: <strong>{receipt.bankName}</strong>
                </span>
                <span>
                  Amount: <strong>{receipt.amount.toLocaleString()} ETB</strong>
                </span>
                <span>
                  Reference: <strong>{receipt.receiptReferenceNumber}</strong>
                </span>
              </div>
              {receipt.status === "Rejected" && receipt.rejectionReason && (
                <span className="text-xs text-red-600">
                  Reason: {receipt.rejectionReason}
                </span>
              )}
              {receipt.reviewedByName && (
                <span className="text-xs text-[#7C7C7C]">
                  Reviewed by {receipt.reviewedByName}
                  {receipt.reviewedAt &&
                    ` on ${new Date(receipt.reviewedAt).toLocaleString()}`}
                </span>
              )}
              {receipt.status === "Pending" && (
                <div className="flex flex-row gap-3 mt-1">
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Check />}
                    onClick={() => handleApprove(receipt)}
                    disabled={approvingId === receipt.id}
                    className="bg-primaryColor shadow-none capitalize"
                  >
                    {approvingId === receipt.id ? (
                      <CircularProgress size={16} className="text-white" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={() => setRejectingReceipt(receipt)}
                    className="capitalize text-red-600 border-red-600"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-row items-center justify-center gap-4 pt-2">
            <IconButton
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft />
            </IconButton>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <IconButton
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight />
            </IconButton>
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(rejectingReceipt)}
        onClose={() => setRejectingReceipt(undefined)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reject Receipt</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <span className="text-sm text-[#7C7C7C]">
            Rejecting {rejectingReceipt?.fullName}&apos;s receipt
            won&apos;t affect their membership or contribution — they can
            submit a new one.
          </span>
          <TextField
            label="Reason (optional)"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setRejectingReceipt(undefined)}
            className="capitalize"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReject}
            disabled={rejecting}
            className="bg-red-600 hover:bg-red-700 shadow-none capitalize"
          >
            {rejecting ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentReceipts;
