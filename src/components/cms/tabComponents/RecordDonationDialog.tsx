import { showToastAction } from "@/redux/actions";
import { Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { Campaign } from "@prisma/client";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

// Offline/cash donations get recorded here rather than by hand-typing a new
// raisedAmount — the campaign's total moves by exactly this donation's
// amount, the same way a real Chapa donation would move it.
const RecordDonationDialog = ({
  open,
  onClose,
  campaign,
  onRecorded,
}: {
  open: boolean;
  onClose: () => void;
  campaign: Campaign;
  onRecorded: (amount: number) => void;
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleRecord = async (values: FieldValues) => {
    try {
      const res = await axios.post("/api/cms/donation/create", {
        amount: values.amount,
        fullName: values.fullName,
        phone: values.phone,
        branch: values.branch,
        donationDesignation: campaign.headline,
        campaignId: campaign.id,
      });

      if (res.data.success) {
        dispatch(
          showToastAction({ message: "Donation recorded", type: "success" })
        );
        reset();
        onRecorded(Number(values.amount));
        onClose();
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "something went wrong",
          type: "error",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex flex-col p-6 w-[380px]">
        <div className="w-full flex flex-row justify-between items-center mb-4">
          <span className="font-bold text-xl">Record Donation</span>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <span className="text-titleColor text-sm mb-4">
          For: {campaign.headline}
        </span>
        <form
          onSubmit={handleSubmit(handleRecord)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-titleColor text-sm">Donor Full Name</label>
            <TextField
              {...register("fullName", { required: "Full name is required" })}
              size="small"
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message?.toString()}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-titleColor text-sm">
              Donor Phone (optional)
            </label>
            <TextField {...register("phone")} size="small" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-titleColor text-sm">
              Branch (optional)
            </label>
            <TextField {...register("branch")} size="small" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-titleColor text-sm">Amount (ETB)</label>
            <TextField
              {...register("amount", {
                required: "Amount is required",
                validate: (value) =>
                  Number(value) > 0 || "Amount must be greater than zero",
              })}
              type="number"
              size="small"
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message?.toString()}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="capitalize mt-2"
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              "Record Donation"
            )}
          </Button>
        </form>
      </div>
    </Dialog>
  );
};

export default RecordDonationDialog;
