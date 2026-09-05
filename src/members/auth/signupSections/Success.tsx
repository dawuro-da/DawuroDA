import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PaymentMethodModal from "@/components/shared/PaymentMethodModal";

const Success = ({
  watch,
  onPaymentInitiated,
}: {
  watch: UseFormWatch<FieldValues>;
  onPaymentInitiated?: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

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
        membershipLevel: watch("membershipLevel"),
      });

      if (res.data.success) {
        window.open(res.data.value.data.checkout_url, "_blank");
      }
    } catch (err) {
      console.error({ err });
    }
    setLoading(false);
  };

  const fullName = watch("firstName")
    ? `${watch("firstName")} ${watch("lastName") ?? ""}`.trim()
    : watch("institutionName") ?? "";

  return (
    <div className="min-h-[400px] flex flex-col items-center w-full justify-center">
      <div className="flex flex-col gap-1">
        <span className="text-5xl text-primaryColor tracking-tight font-black">
          {`${t("members_dashboard.login.sign_up.progress_bar_1.success")}`}
        </span>
        <br />
        <span className="tracking-tight text-[rgb(0,0,0,0.7)]">
          {`${t(
            "members_dashboard.login.sign_up.progress_bar_1.success_subheading"
          )}`}
          <br />{" "}
          {`${t(
            "members_dashboard.login.sign_up.progress_bar_1.success_subheading1"
          )}`}
          <br />{" "}
          {`${t(
            "members_dashboard.login.sign_up.progress_bar_1.success_subheading2"
          )}`}
          <br />
        </span>
        <Button
          onClick={() => setModalOpen(true)}
          variant="contained"
          size="small"
          className="min-w-[200px] mt-6"
        >
          {loading ? (
            <CircularProgress className="text-white" />
          ) : (
            `${t("members_dashboard.login.sign_up.progress_bar_1.pay_button")}`
          )}
        </Button>
      </div>
      <PaymentMethodModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        paymentType="Registration"
        phone={watch("phone") ?? ""}
        fullName={fullName}
        amount={Number(watch("contributionAmount")) || 0}
        onPayWithChapa={handleGeneratePaymentLink}
        chapaLoading={loading}
        onPaymentInitiated={onPaymentInitiated}
      />
    </div>
  );
};

export default Success;
