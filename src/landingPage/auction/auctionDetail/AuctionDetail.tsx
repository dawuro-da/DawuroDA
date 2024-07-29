"use client";

import Footer from "@/landingPage/footer/Footer";
import Naviagtion from "@/landingPage/navigation/Navigation";
import { showToastAction } from "@/redux/actions";
import { getFormattedDate } from "@/util/date";
import { ArrowDownward } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Auction, Bidder, UserRole } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

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
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

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
        firstName: member?.firstName,
        lastName: member?.lastName,
        phone: member?.phone,
        auctionId: auction.id,
      });
      if (res.data.success) {
        window.open(res.data.value.data.checkout_url, "_blank");
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({ message: err.response.data.error, type: "error" })
      );
    }
  };
  return (
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
          <p>Back to auctions</p>
        </div>
        {!bidder?.hasPaidNRP && (
          <div className="grid xl:lg:grid-cols-3 md:grid-cols-3 gap-6 mt-6">
            <div className="flex flex-col gap-3 col-span-2 xl:lg:max-w-[90%] md:max-w-[96%]">
              <span className="font-bold text-4xl ">Auction Detail</span>
              <span className="flex flex-col gap-1">
                <span className="text-2xl">{auction.title}</span>
                <small className="text-titleColor">
                  Start Date: {getFormattedDate(auction.startDate)}
                </small>
                <small className="text-titleColor">
                  End Date: {getFormattedDate(auction.endDate)}
                </small>
              </span>
              <span className="text-titleColor">{auction.description}</span>
            </div>
            <div className="flex flex-col gap-3 ">
              <span className="font-bold">
                To Apply Please Follow the following{" "}
              </span>
              <span className="text-sm mt-2 text-titleColor">
                First pay and download the auction form appropriately{" "}
              </span>
              <span className="text-sm text-titleColor">
                then fill the form and upload it by scanning or capturing a
                clear photo.
              </span>
              <Button
                onClick={payForForm}
                variant="contained"
                className=" max-w-[240px] mt-4"
              >
                Pay
              </Button>
            </div>
          </div>
        )}
        {bidder?.hasPaidNRP && (
          <div className="grid xl:lg:grid-cols-2 md:grid-cols-2 gap-6 mt-6 ">
            <div className="xl:lg:order-first md:order-first order-last flex flex-col gap-3 xl:lg:max-w-[500px] md:max-w-[400px]">
              <span className="font-bold">
                To Apply Please Follow The Following
              </span>
              <span className="flex flex-col gap-2">
                <span>Step 1:</span>
                <span className="text-sm text-titleColor">
                  {`Fill this form and upload the filled document. click on the
                  below button if you didn't downlod it`}
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
                <p>Download</p>
              </Button>
              <div className="flex flex-col gap-2 mt-8">
                <span>Step 2:</span>
                <span className="text-sm text-titleColor">
                  {`Fill this form and upload the filled document. click on the
                  below button if you didn't downlod it`}
                </span>
                <div className="flex flex-col gap-1 text-titleColor my-4">
                  <small>Offer</small>
                  <TextField
                    {...register("offer", { required: "required" })}
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
                  <small>Document</small>
                  <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                    <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                      <Image
                        src={"/icons/greyGallery.svg"}
                        alt=""
                        height={20}
                        width={20}
                      />
                      <span>
                        {typeof watch("profileImage") === "string"
                          ? watch("profileImage").slice(0, 40)
                          : watch("profileImage")?.[0]?.name
                          ? watch("profileImage")?.[0]?.name
                          : "Upload"}
                      </span>
                    </span>
                    <input
                      id="profileImage"
                      {...register("doc")}
                      type="file"
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
                      <span>Upload</span>
                    </Button>
                  </span>
                </div>
              </div>
              <span className="flex flex-col gap-2 mt-4">
                <span>Step 3:</span>
                <span className="text-sm text-titleColor">
                  {`Fill this form and upload the filled document. click on the
                  below button if you didn't downlod it`}
                </span>
              </span>
              <Button
                onClick={() =>
                  downloadPDF({
                    name: auction.title.slice(0, 100) + ".pdf",
                    url: auction.formFile,
                  })
                }
                variant="outlined"
                className="text-white mt-2 capitalize w-full flex flex-row py-3 rounded-md bg-primaryColor hover:text-primaryColor justify-center items-center gap-2"
              >
                <p>Submit your bid</p>
              </Button>
            </div>
            <div className="flex flex-col gap-3  xl:lg:max-w-[500px] md:max-w-[400px]">
              <span className="font-bold text-titleColor">Instruction</span>
              <span className="text-titleColor">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum
                sequi eveniet quam possimus aut commodi optio, in adipisci
                inventore quae voluptas incidunt asperiores, iusto facere quia,
                rem velit illum minus. <br />
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Accusantium, ullam nemo sed doloribus architecto a alias sint
                voluptas magnam unde. Quidem autem totam enim minus cupiditate.
                Repellendus consectetur voluptatem fugit.
                <br />
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Accusantium, ullam nemo sed doloribus architecto a alias sint
                voluptas magnam unde. Quidem autem totam enim minus cupiditate.
                Repellendus consectetur voluptatem fugit.
              </span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AuctionDetail;
