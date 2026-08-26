"use client";

import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../footer/Footer";
import Navigation from "../navigation/Navigation";
import useLanguageStore from "@/redux/languageStore";
import { useEffect, useState } from "react";
import i18n from "../../../i18n";
import { Call, Email, LocationOn, Send } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { email_regex } from "@/constants/regex";

const ContactPage = () => {
  const { i18n: i18nn, t } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="w-full">
        <Navigation />
        <ContactContent t={t} />
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default ContactPage;

const ContactContent = ({ t }: { t: any }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (values: FieldValues) => {
    setLoading(true);
    setStatus("idle");
    try {
      const res = await axios.post("/api/contact/send", values);
      if (res.data.success) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <div className="w-full py-16 pt-40">
      <div className="text-center mb-14 xl:lg:px-40 md:px-20 px-10">
        <span className="block text-primaryColor font-semibold text-sm uppercase tracking-wide mb-2">
          {t("contact_page.label")}
        </span>
        <h1 className="font-bold lg:text-4xl text-2xl mb-3">
          {t("contact_page.heading")}
        </h1>
        <span className="block w-16 h-1 bg-primaryColor mx-auto mb-4" />
        <p className="text-titleColor font-light max-w-xl mx-auto">
          {t("contact_page.subheading")}
        </p>
      </div>

      <div className="xl:lg:px-40 md:px-20 px-10 grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#F7F7F7] rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="bg-primaryColor text-white rounded-full h-14 w-14 flex items-center justify-center mb-4">
            <Call />
          </div>
          <h3 className="font-bold text-lg mb-2">
            {t("contact_page.phone_label")}
          </h3>
          <a href="tel:251473450258" className="text-titleColor hover:text-primaryColor">
            +251 47 345 0258
          </a>
          <a href="tel:251964565825" className="text-titleColor hover:text-primaryColor">
            +251 96 456 5825
          </a>
          <a href="tel:251917832637" className="text-titleColor hover:text-primaryColor">
            +251 91 783 2637
          </a>
        </div>

        <div className="bg-[#F7F7F7] rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="bg-primaryColor text-white rounded-full h-14 w-14 flex items-center justify-center mb-4">
            <Email />
          </div>
          <h3 className="font-bold text-lg mb-2">
            {t("contact_page.email_label")}
          </h3>
          <a
            href="mailto:info@dawuroda.org"
            className="text-titleColor hover:text-primaryColor"
          >
            info@dawuroda.org
          </a>
        </div>

        <div className="bg-[#F7F7F7] rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="bg-primaryColor text-white rounded-full h-14 w-14 flex items-center justify-center mb-4">
            <LocationOn />
          </div>
          <h3 className="font-bold text-lg mb-2">
            {t("contact_page.address_label")}
          </h3>
          <p className="text-titleColor">{t("contact_page.address_value")}</p>
        </div>
      </div>

      <div className="xl:lg:px-40 md:px-20 px-10">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 md:p-12 max-w-3xl mx-auto">
          <h2 className="font-bold text-2xl mb-8 text-center">
            {t("contact_page.form_heading")}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-titleColor text-sm font-bold">
                  {t("contact_page.name")}
                </label>
                <TextField
                  {...register("name", { required: "Name is required" })}
                  variant="outlined"
                  error={Boolean(errors.name)}
                  helperText={errors.name && errors.name.message?.toString()}
                  inputProps={{ style: { padding: 12 } }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-titleColor text-sm font-bold">
                  {t("contact_page.email_field")}
                </label>
                <TextField
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: email_regex,
                      message: "Email is not valid",
                    },
                  })}
                  variant="outlined"
                  error={Boolean(errors.email)}
                  helperText={errors.email && errors.email.message?.toString()}
                  inputProps={{ style: { padding: 12 } }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-titleColor text-sm font-bold">
                {t("contact_page.subject")}
              </label>
              <TextField
                {...register("subject")}
                variant="outlined"
                inputProps={{ style: { padding: 12 } }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-titleColor text-sm font-bold">
                {t("contact_page.message")}
              </label>
              <TextField
                {...register("message", { required: "Message is required" })}
                variant="outlined"
                multiline
                minRows={5}
                error={Boolean(errors.message)}
                helperText={errors.message && errors.message.message?.toString()}
                inputProps={{ style: { padding: 12 } }}
              />
            </div>

            {status === "success" && (
              <p className="text-primaryColor text-sm">
                {t("contact_page.success_message")}
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm">
                {t("contact_page.error_message")}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="bg-primaryColor hover:bg-primaryColor/90 text-white capitalize font-semibold py-3 rounded flex items-center justify-center gap-2"
            >
              {loading ? (
                <CircularProgress size={22} className="text-white" />
              ) : (
                <>
                  {t("contact_page.send_button")}
                  <Send fontSize="small" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
