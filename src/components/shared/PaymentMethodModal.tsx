"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import {
  AccountBalance,
  CheckCircle,
  Close,
  ContentCopy,
  CreditCard,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { BankAccount } from "@prisma/client";
import { useBankAccounts } from "@/util/useBankAccounts";

type Step = "choose" | "banks" | "form" | "submitted";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  paymentType: "Registration" | "Contribution";
  phone: string;
  fullName: string;
  amount: number;
  onPayWithChapa: () => void | Promise<void>;
  chapaLoading?: boolean;
  // Fired once the member has genuinely started/submitted a payment — a
  // successful Chapa redirect, or a bank-transfer receipt that was accepted
  // — as opposed to just opening or cancelling out of the modal. Callers use
  // this to move the user on (e.g. back to the login screen after signup).
  onPaymentInitiated?: () => void;
}

// Lets a member choose between the existing Chapa checkout and paying by
// bank transfer — used both at signup (registration payment) and on the
// member dashboard (recurring contribution payment) so there's exactly one
// implementation of the bank-transfer flow to keep in sync.
const PaymentMethodModal = ({
  open,
  onClose,
  paymentType,
  phone,
  fullName,
  amount,
  onPayWithChapa,
  chapaLoading,
  onPaymentInitiated,
}: PaymentMethodModalProps) => {
  const dispatch = useDispatch();
  const { accounts, loading: accountsLoading } = useBankAccounts();
  const [step, setStep] = useState<Step>("choose");
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep("choose");
    setSelectedBank(null);
    setReferenceNumber("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCopy = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      dispatch(
        showToastAction({ message: "Account number copied", type: "success" })
      );
    } catch {
      dispatch(
        showToastAction({ message: "Unable to copy — copy it manually", type: "error" })
      );
    }
  };

  const handleSubmitReceipt = async () => {
    if (!selectedBank) return;
    if (!referenceNumber.trim()) {
      dispatch(
        showToastAction({
          message: "Please enter the receipt reference number",
          type: "error",
        })
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/payment/receipt/create", {
        phone,
        fullName,
        paymentType,
        bankName: selectedBank.bankName,
        receiptReferenceNumber: referenceNumber.trim(),
      });
      if (res.data.success) {
        setStep("submitted");
        onPaymentInitiated?.();
      } else {
        dispatch(
          showToastAction({
            message: res.data.error ?? "Unable to submit payment info",
            type: "error",
          })
        );
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "Unable to submit payment info",
          type: "error",
        })
      );
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex flex-row items-center justify-between">
        {step === "choose" && "Choose Payment Method"}
        {step === "banks" && "Select a Bank"}
        {step === "form" && "Confirm Your Payment"}
        {step === "submitted" && "Submitted"}
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 pb-6">
        {step === "choose" && (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={async () => {
                await onPayWithChapa();
                onPaymentInitiated?.();
              }}
              disabled={chapaLoading}
              className="flex flex-row items-center gap-4 border-2 border-primaryColor rounded-xl p-4 hover:bg-primaryColor/5 text-left disabled:opacity-60"
            >
              <CreditCard className="text-primaryColor" fontSize="large" />
              <div className="flex flex-col">
                <span className="font-bold text-titleColor">
                  Pay Online (Chapa)
                </span>
                <span className="text-sm text-[#7C7C7C]">
                  Pay instantly by card or mobile money
                </span>
              </div>
              {chapaLoading && (
                <CircularProgress size={20} className="ml-auto" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep("banks")}
              className="flex flex-row items-center gap-4 border-2 border-[#dadada] rounded-xl p-4 hover:bg-[#f5f5f5] text-left"
            >
              <AccountBalance className="text-titleColor" fontSize="large" />
              <div className="flex flex-col">
                <span className="font-bold text-titleColor">
                  Pay by Bank Transfer
                </span>
                <span className="text-sm text-[#7C7C7C]">
                  Transfer to one of our bank accounts and submit your
                  receipt
                </span>
              </div>
            </button>
          </div>
        )}

        {step === "banks" && (
          <div className="flex flex-col gap-3">
            {accountsLoading && (
              <div className="flex justify-center py-6">
                <CircularProgress size={24} />
              </div>
            )}
            {!accountsLoading && accounts.length === 0 && (
              <span className="text-sm text-[#7C7C7C] text-center py-6">
                No bank accounts are available right now. Please try Chapa
                instead, or contact us.
              </span>
            )}
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-col gap-2 border-2 border-[#dadada] rounded-xl p-4"
              >
                <div className="flex flex-row items-center gap-3">
                  {account.logo ? (
                    <Image
                      src={account.logo}
                      alt=""
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-md object-contain bg-[#f5f5f5]"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-[#f5f5f5] flex items-center justify-center text-titleColor font-bold">
                      {account.bankName?.[0]}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-titleColor">
                      {account.bankName}
                    </span>
                    {account.accountHolderName && (
                      <span className="text-sm text-[#7C7C7C]">
                        {account.accountHolderName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between bg-[#f5f5f5] rounded-lg px-3 py-2">
                  <span className="font-mono tracking-wide">
                    {account.accountNumber}
                  </span>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(account.accountNumber)}
                    title="Copy account number"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </div>
                <Button
                  variant="outlined"
                  className="capitalize self-end"
                  onClick={() => {
                    setSelectedBank(account);
                    setStep("form");
                  }}
                >
                  I paid using this account
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setStep("choose")}
              className="capitalize self-start"
            >
              Back
            </Button>
          </div>
        )}

        {step === "form" && selectedBank && (
          <div className="flex flex-col gap-4">
            <span className="text-sm text-[#7C7C7C]">
              Transfer the exact amount below to {selectedBank.bankName}, then
              enter the receipt/transaction reference number so we can verify
              it. The amount is fixed to your membership level and can&apos;t
              be changed.
            </span>
            <div className="flex flex-col gap-2 bg-[#f5f5f5] rounded-lg p-3">
              <div className="flex flex-row items-center justify-between">
                <span className="text-xs text-[#7C7C7C]">Account Number</span>
                <div className="flex flex-row items-center gap-1">
                  <span className="font-mono tracking-wide font-semibold">
                    {selectedBank.accountNumber}
                  </span>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(selectedBank.accountNumber)}
                    title="Copy account number"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="text-xs text-[#7C7C7C]">
                  Amount to Pay (ETB)
                </span>
                <div className="flex flex-row items-center gap-1">
                  <span className="font-mono tracking-wide font-semibold">
                    {amount.toLocaleString()}
                  </span>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(String(amount))}
                    title="Copy amount"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </div>
            <TextField
              label="Receipt Reference Number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. FT24XXXXXXXX"
              fullWidth
              autoFocus
            />
            <div className="flex flex-row items-center justify-between mt-2">
              <Button
                onClick={() => setStep("banks")}
                className="capitalize"
                disabled={submitting}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmitReceipt}
                disabled={submitting}
                className="bg-primaryColor capitalize"
              >
                {submitting ? (
                  <CircularProgress size={20} className="text-white" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "submitted" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle className="text-primaryColor" style={{ fontSize: 48 }} />
            <span className="font-bold text-lg text-titleColor">
              Payment info received
            </span>
            <span className="text-sm text-[#7C7C7C] max-w-sm">
              Our team will verify your bank transfer and{" "}
              {paymentType === "Registration"
                ? "activate your membership"
                : "update your account"}{" "}
              shortly.
            </span>
            <Button
              variant="contained"
              onClick={handleClose}
              className="bg-primaryColor capitalize mt-2"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodModal;
