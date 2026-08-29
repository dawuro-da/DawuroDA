import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Modal,
  IconButton,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import axios from "axios";
import { showToastAction } from "@/redux/actions";
import { useDispatch } from "react-redux";
import { Dawuro_Branches } from "@/constants/datas";
import { international_phone_regex } from "@/constants/regex";
import { PhoneNumberInput } from "@/components/shared/PhoneNumberInput";

const DonationForm = ({
  open,
  handleClose,
  designation,
}: {
  open: boolean;
  handleClose: () => void;
  designation?: {
    title: string;
    description: string;
    campaignId?: string;
  };
}) => {
  const dispatch = useDispatch();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/payment/donationPayment", {
        paymentAmount: data.amount,
        fullName: `${data?.fullName}`,
        phone: data?.phone,
        donationDesignation: data?.donationDesignation,
        branch: data.branch,
        campaignId: designation?.campaignId,
      });
      if (res.data.success) {
        window.open(res.data.value.data.checkout_url, "_parent");
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({ message: err.response.data.error, type: "error" })
      );
    }
    setLoading(false);
  };

  const handleAmountClick = (amount: any) => {
    setSelectedAmount(amount);
    setValue("amount", amount);
  };

  useEffect(() => {
    if (designation) {
      setValue("donationDesignation", designation.title);
    }
  }, [designation]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex flex-row items-center justify-center"
    >
      <div className="outline-none bg-white px-6 py-6 rounded-lg xl:lg:w-1/2 md:w-2/3 w-full xl:lg:h-fit md:h-fit h-full max-h-full hiddenscrollbar overflow-y-auto">
        <div className="flex flex-row items-center justify-between text-titleColor">
          <span className="font-bold text-2xl">Donation Form</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-10"
        >
          {designation ? (
            <div className="flex flex-col gap-2 text-titleColor h-full">
              <label>Donation Designation</label>
              <div className="bg-primaryColor/5 border border-primaryColor/20 rounded-lg px-4 py-3 font-semibold text-[#1E1E1E]">
                {designation.title}
              </div>
              <input
                type="hidden"
                {...register("donationDesignation")}
                defaultValue={designation.title}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-titleColor h-full">
              <label>Donation Designation</label>
              <TextField
                {...register("donationDesignation", {
                  required: "Donation designation is required",
                })}
                multiline
                rows={2}
                maxRows={3}
                variant="outlined"
                error={Boolean(errors.donationDesignation)}
                helperText={errors.donationDesignation?.message?.toString()}
                inputProps={{ style: { padding: 2 } }}
              />
            </div>
          )}
          {designation?.description && (
            <div className="flex flex-col gap-2 text-titleColor h-full">
              <label>Campaign Description</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1E1E1E]">
                {designation.description}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 text-titleColor h-full">
            <label>Full Name</label>
            <TextField
              {...register("fullName", { required: "Full Name is required" })}
              variant="outlined"
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message?.toString()}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-2 text-titleColor h-full">
            <label>Phone Number</label>
            <PhoneNumberInput
              size="small"
              {...register("phone", {
                required: "Phone Number is required",
                pattern: {
                  message: "Phone is not valid",
                  value: international_phone_regex,
                },
              })}
              variant="outlined"
              inputProps={{
                style: {
                  padding: 10,
                },
              }}
              value={watch("phone")}
              onChange={(value) => setValue("phone", value.replace(/\s+/g, ""))}
              type="text"
              placeholder=""
              error={Boolean(!!errors.phone)}
              helperText={!!errors.phone && errors.phone.message?.toString()}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-titleColor text-sm">DaDA Branch</span>
            <TextField
              size="small"
              {...register("branch")}
              type="text"
              placeholder=""
              className="border-2 rounded-[16px] py-2"
              inputProps={{ style: { padding: 10 } }}
              error={Boolean(!!errors.branch)}
              helperText={!!errors.branch && errors.branch.message?.toString()}
              select
            >
              {Dawuro_Branches.map((branch, index) => (
                <MenuItem key={index} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="flex flex-col gap-2 text-titleColor h-full col-span-2">
            <label>Donation Amount</label>
            <div className="grid xl:lg:grid-cols-5 md:grid-cols-5 grid-cols-3 gap-4">
              {[100, 200, 500, 1000, 2000].map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleAmountClick(amount)}
                >
                  {amount} ETB
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-titleColor h-full">
            <TextField
              {...register("amount", {
                required: "Amount is required",
                validate: (value) =>
                  value > 0 || "Amount must be greater than zero",
              })}
              variant="outlined"
              type="number"
              placeholder="Other amount"
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message?.toString()}
              inputProps={{ style: { padding: 10 } }}
              onChange={() => setSelectedAmount(null)}
            />
          </div>
          <div className="col-span-2 flex justify-end mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="capitalize"
            >
              {loading ? <CircularProgress className="text-white" /> : "Donate"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DonationForm;
