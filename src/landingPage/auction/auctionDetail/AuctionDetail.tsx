"use client";

import Footer from "@/landingPage/footer/Footer";
import Naviagtion from "@/landingPage/navigation/Navigation";
import { showToastAction } from "@/redux/actions";
import useLanguageStore from "@/redux/languageStore";
import { getFormattedDate } from "@/util/date";
import { ArrowDownward } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Auction, Bidder, UserRole } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import i18n from "../../../../i18n";

interface AuctionDetailProps {
  auction: Auction;
  bidder: Bidder | null;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
    phone: string;
    profileImage: string;
  };
}

const AuctionDetail = ({ auction, bidder, member }: AuctionDetailProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [successfull, setSuccessfull] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  const { i18n: i18nn, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  const downloadPDF = async ({ name, url }: { name: string; url: string }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = `${name}.pdf`; // Set the file name here
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  const payForForm = async () => {
    try {
      const res = await axios.post("/api/payment/auctionPayment", {
        paymentAmount: auction.CPO + auction.formPayment,
        email: member?.email,
        firstName: `${member?.firstName}`,
        lastName: `${member?.lastName}`,
        phone: member?.phone,
        auctionId: auction.id,
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
  };

  const SubmitBid = async (values: FieldValues) => {
    setLoading(true);
    try {
      if (!values.formFilled) {
        dispatch(
          showToastAction({
            message: "Please attach the filled form",
            type: "error",
          })
        );
        return;
      }
      if (bidder?.id) {
        const formData = new FormData();
        formData.append("offer", values.offer);
        formData.append("formFilled", values.formFilled[0]);
        formData.append("bidderId", bidder.id);

        const res = await axios.post("/api/auction/participate", formData);
        if (res.data.success) {
          setSuccessfull(true);
          dispatch(
            showToastAction({
              message: "Successfully Submitted",
              type: "success",
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({
          message: err.response.data.error,
          type: "error",
        })
      );
    }
    setLoading(false);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className=" w-full">
        <Naviagtion />
        <div className="xl:lg:px-40 md:px-20 px-10 w-full mb-32 mt-20">
          <div
            className="flex flex-row gap-2 cursor-pointer w-fit text-titleColor"
            onClick={() => router.push("/auctions")}
          >
            <Image
              draggable={false}
              src={"/images/back.svg"}
              alt=""
              width={20}
              height={20}
            />
            <p>{t("auctions.back_to_auctions")}</p>
          </div>
          {bidder?.isSubmitted || successfull ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px] font-bold">
              <span className="text-4xl text-primaryColor">
                Submitted Successfully
              </span>
              <div className="max-w-[400px] text-center text-titleColor text-sm mt-6">
                <span>
                  you have successfully applied to this auction. please wait
                  until the final date.
                </span>
                <br />
                <span>Good Luck</span>
              </div>
            </div>
          ) : (
            <>
              {!bidder?.hasPaidNRP && (
                <div className="grid xl:lg:grid-cols-3 md:grid-cols-3 gap-6 mt-6">
                  <div className="flex flex-col gap-3 col-span-2 xl:lg:max-w-[90%] md:max-w-[96%]">
                    <span className="font-bold text-4xl ">
                      {t("auctions.auction_detail_page.auction_detail")}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-2xl">{auction.title}</span>
                      <small className="text-titleColor">
                        {t("auctions.start_date")}:{" "}
                        {getFormattedDate(auction.startDate)}
                      </small>
                      <small className="text-titleColor">
                        {t("auctions.end_date")}:{" "}
                        {getFormattedDate(auction.endDate)}
                      </small>
                    </span>
                    <span className="text-titleColor">
                      {auction.description}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 ">
                    <span className="font-bold">
                      {t("auctions.auction_detail_page.payment_info_heading")}{" "}
                    </span>
                    <span className="text-sm mt-2 text-titleColor max-w-[300px]">
                      {t(
                        "auctions.auction_detail_page.payment_info_subheading"
                      )}
                    </span>
                    <span className="text-sm text-titleColor flex flex-col gap-2 max-w-[300px]">
                      {auction.CPO && (
                        <span className="flex flex-row w-full justify-between">
                          {t("auctions.auction_detail_page.CPO")}:{" "}
                          <span>
                            {auction.CPO}{" "}
                            {t("auctions.auction_detail_page.birr")}
                          </span>
                        </span>
                      )}
                      {auction.formPayment && (
                        <span className="flex flex-row w-full justify-between">
                          {t(
                            "auctions.auction_detail_page.non-refundable_payment"
                          )}
                          :{" "}
                          <span>
                            {auction.formPayment}{" "}
                            {t("auctions.auction_detail_page.birr")}
                          </span>
                        </span>
                      )}
                      {(auction.CPO || auction.formPayment) && (
                        <span className="flex flex-row w-full justify-between">
                          {t("auctions.auction_detail_page.total")}:{" "}
                          <span className="font-bold">
                            {auction.CPO + auction.formPayment}{" "}
                            {t("auctions.auction_detail_page.birr")}
                          </span>
                        </span>
                      )}
                    </span>
                    <Button
                      onClick={payForForm}
                      variant="contained"
                      className=" max-w-[240px] mt-4"
                    >
                      {t("auctions.auction_detail_page.pay")}
                    </Button>
                  </div>
                </div>
              )}
              {bidder?.hasPaidNRP && (
                <form
                  onSubmit={handleSubmit(SubmitBid)}
                  className="grid xl:lg:grid-cols-2 md:grid-cols-2 gap-6 mt-6 "
                >
                  <div className="xl:lg:order-first md:order-first order-last flex flex-col gap-3 xl:lg:max-w-[500px] md:max-w-[400px]">
                    <span className="font-bold">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_heading"
                      )}
                    </span>
                    <span className="text-titleColor">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_subheading"
                      )}
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="text-titleColor font-bold">
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_heading_1"
                        )}
                      </span>
                      <span className="text-sm text-titleColor">
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_subheading_1"
                        )}
                      </span>
                      <div className="flex flex-row gap-2 my-4">
                        <Image
                          src={"/images/file.svg"}
                          height={30}
                          width={30}
                          alt=""
                        />
                        <div className="h-full flex flex-row items-center">
                          <p className="font-semibold text-xs mb-1 max-w-full truncate text-ellipsis">
                            {auction.title.slice(0, 100) + ".pdf"}
                          </p>
                        </div>
                      </div>
                    </span>
                    <Button
                      onClick={() =>
                        downloadPDF({
                          name: auction.title.slice(0, 100) + ".pdf",
                          url: auction.formFile,
                        })
                      }
                      variant="outlined"
                      className="text-white w-full flex flex-row py-3 rounded-md bg-primaryColor hover:text-primaryColor justify-center items-center gap-2"
                    >
                      <ArrowDownward />
                      <p>
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.download"
                        )}
                      </p>
                    </Button>
                    <div className="flex flex-col gap-2 mt-8">
                      <span className="text-titleColor font-bold">
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_heading_2"
                        )}
                      </span>
                      <span className="text-sm text-titleColor">
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_subheading_2"
                        )}
                      </span>
                      <div className="flex flex-col gap-1 text-titleColor my-4">
                        <small>
                          {t(
                            "auctions.auction_detail_page.auction_submission_page.offer"
                          )}
                        </small>
                        <TextField
                          {...register("offer", {
                            required: "Please add your offer",
                          })}
                          variant="outlined"
                          type="number"
                          error={Boolean(!!errors.offer)}
                          helperText={
                            !!errors.offer && errors.offer.message?.toString()
                          }
                          sx={{ backgroundColor: "white" }}
                          inputProps={{ style: { padding: 10 } }}
                        />
                      </div>
                      <div className="flex flex-col gap-1 text-titleColor my-2">
                        <small>
                          {t(
                            "auctions.auction_detail_page.auction_submission_page.filled_document"
                          )}
                        </small>
                        <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                          <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                            <Image
                              src={"/icons/greyGallery.svg"}
                              alt=""
                              height={20}
                              width={20}
                            />
                            <span>
                              {typeof watch("formFilled") === "string"
                                ? watch("formFilled").slice(0, 40)
                                : watch("formFilled")?.[0]?.name
                                ? watch("formFilled")?.[0]?.name
                                : "Upload"}
                            </span>
                          </span>
                          <input
                            id="formFilled"
                            {...register("formFilled")}
                            type="file"
                            accept=".pdf"
                            placeholder=""
                            className="z-10 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button className="flex flex-row items-center justify-center outline-none z-0 gap-2 absolute bg-white text-titleColor right-4 px-4 py-2 cursor-pointer">
                            <Image
                              src={"/icons/uploadIcon.svg"}
                              alt=""
                              height={20}
                              width={20}
                            />
                            <span>
                              {t(
                                "auctions.auction_detail_page.auction_submission_page.upload"
                              )}
                            </span>
                          </Button>
                        </span>
                      </div>
                    </div>
                    <span className="flex flex-col gap-2 mt-4">
                      <span className="text-titleColor font-bold">
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_heading_3"
                        )}
                      </span>
                      <span className="text-sm text-titleColor">
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_subheading_3"
                        )}
                        <br />
                        {t(
                          "auctions.auction_detail_page.auction_submission_page.instructions_subheading_3_1"
                        )}
                      </span>
                    </span>
                    <Button
                      type="submit"
                      variant="outlined"
                      className="text-white mt-2 capitalize w-full flex flex-row py-3 rounded-md bg-primaryColor hover:text-primaryColor justify-center items-center gap-2"
                    >
                      {loading ? (
                        <CircularProgress className="text-white" />
                      ) : (
                        <p>
                          {t(
                            "auctions.auction_detail_page.auction_submission_page.submit_your_bid"
                          )}
                        </p>
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3  xl:lg:max-w-[500px] md:max-w-[400px]">
                    <span className="font-bold text-xl text-titleColor">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_heading"
                      )}
                    </span>
                    <span className="text-titleColor">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_subheading"
                      )}
                    </span>
                    <span className="text-titleColor text-sm font-bold">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_heading_1"
                      )}
                    </span>
                    <span className="text-titleColor text-sm">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_sub_heading_1"
                      )}
                    </span>
                    <span className="text-titleColor text-sm font-bold">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_heading_2"
                      )}
                    </span>
                    <span className="text-titleColor text-sm">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_sub_heading_2"
                      )}
                    </span>
                    <span className="text-titleColor text-sm font-bold">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_heading_3"
                      )}
                    </span>

                    <span className="text-titleColor text-sm">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_subheading_3"
                      )}
                    </span>
                    <span className="text-titleColor text-sm">
                      {t(
                        "auctions.auction_detail_page.auction_submission_page.instructions_subheading_3_1"
                      )}
                    </span>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default AuctionDetail;
