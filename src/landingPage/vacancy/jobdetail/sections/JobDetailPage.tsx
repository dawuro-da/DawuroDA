"use client";

import { showToastAction } from "@/redux/actions";
import { getFormattedDate } from "@/util/date";
import { ArrowDownward } from "@mui/icons-material";
import { Button, Skeleton } from "@mui/material";
import { Job } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const JobDetailPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [job, setJob] = useState<Job>();
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/cms/job/fetch/${params.id}`, {
        page: 1,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestJobs = res.data.value.job;
        setJob(latestJobs);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      dispatch(showToastAction({ message: "Link copied", type: "success" }));
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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

  return (
    <div className="min-h-screen p-8">
      <Link href="/vacancies" className="w-fit font-light flex flex-row gap-4">
        <Image src={"/images/back.svg"} height={20} width={20} alt="" />
        <p>Back to Vacancies</p>
      </Link>
      {loading ? (
        <Skeleton className="min-h-[500px]" />
      ) : (
        <>
          <h1 className="text-3xl font-bold mt-4 mb-8">{job?.jobTitle}</h1>
          <div className="flex flex-row gap-20 items-center">
            <p className="font-light">
              Posted on: {job?.updated_at && getFormattedDate(job.updated_at)}
            </p>
            <Button
              onClick={copyToClipboard}
              variant="outlined"
              className="font-light border border-[#8E8E8E] text-[#8E8E8E] px-4 py-2 flex flex-row items-center rounded-md gap-2"
            >
              <Image
                src={"/images/sharebtn.svg"}
                height={15}
                width={15}
                alt=""
              />
              <p>Share</p>
            </Button>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Description:</h2>
            <div className="mt-2">
              <p>{job?.jobDescription}</p>
              <Button
                onClick={() =>
                  job && downloadPDF({ name: job.jobTitle.slice(0,40), url: job.document })
                }
                variant="outlined"
                className="text-white w-fit px-12 mt-6 flex flex-row py-3 rounded-md bg-primaryColor hover:text-primaryColor justify-center items-center gap-2"
              >
                <ArrowDownward />
                <p>Download Detail</p>
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-black text-xs">Apply via email</p>
            <span>
              <Link href="mailto:">
                <Button variant="contained" className="px-10 shadow-none">
                  Apply
                </Button>
              </Link>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default JobDetailPage;
