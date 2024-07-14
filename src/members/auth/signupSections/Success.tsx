import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";

const Success = ({ watch }: { watch: UseFormWatch<FieldValues> }) => {
  const [loading, setLoading] = useState(false);

  const handleGeneratePaymentLink = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/payment/registrationPayment", {
        contributionAmount: watch("contributionAmount"),
        email: watch("email"),
        firstName: watch("firstName"),
        lastName: watch("lastName"),
        phone: watch("phone"),
        institutionName: watch("institutionName"),
      });

      if (res.data.success) {
        window.open(res.data.value.data.checkout_url);
      }
    } catch (err) {
      console.log({ err });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center w-full justify-center">
      <div className="flex flex-col gap-1">
        <span className="text-5xl text-primaryColor tracking-tight font-black">
          Success
        </span>
        <br />
        <span className="tracking-tight text-[rgb(0,0,0,0.7)]">
          {`You've Successfully Registered.`}
          <br /> Please pay your contribuition amount.
          <br /> Click here if you are not redirected to payment link.
          <br />
        </span>
        <Button
          onClick={handleGeneratePaymentLink}
          variant="contained"
          size="small"
          className="min-w-[200px] mt-6"
        >
          {loading ? <CircularProgress className="text-white" /> : "Pay"}
        </Button>
      </div>
    </div>
  );
};

export default Success;
