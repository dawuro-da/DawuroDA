import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Modal,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import axios from "axios";
import { showToastAction } from "@/redux/actions";
import { useDispatch } from "react-redux";

const DonationForm = ({
  open,
  handleClose,
  designation,
}: {
  open: boolean;
  handleClose: () => void;
  designation?: string;
}) => {
  const dispatch = useDispatch();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
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
      setValue("donationDesignation", designation);
    }
  }, [designation]);
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex flex-row items-center justify-center"
    >
      <div className="bg-white px-6 py-6 rounded-lg xl:lg:w-1/2 md:w-2/3 w-full xl:lg:h-fit md:h-fit h-full overflow-y-auto">
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
            <TextField
              {...register("phone", { required: "Phone number is required" })}
              variant="outlined"
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message?.toString()}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-2 text-titleColor h-full">
            <label>Donation Designation</label>
            <TextField
              {...register("donationDesignation", {
                required: "Donation designation is required",
              })}
              defaultValue={designation}
              variant="outlined"
              error={Boolean(errors.donationDesignation)}
              disabled={Boolean(designation)}
              helperText={errors.donationDesignation?.message?.toString()}
              inputProps={{ style: { padding: 10 } }}
            />
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
