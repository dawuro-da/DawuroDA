"use client";

import { showToastAction } from "@/redux/actions";
import { getFormattedDate } from "@/util/date";
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
      console.log(err);
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
              <h3 className="mt-4 font-semibold">Responsibilities:</h3>
              <p>{job?.responsiblities}</p>
              <h3 className="mt-4 font-semibold">Qualifications:</h3>
              <p>{job?.qualification}</p>
              <h3 className="mt-4 font-semibold">Benefits:</h3>
              <p>{job?.benefits}</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-black text-xs">Apply via email</p>
          </div>
        </>
      )}
    </div>
  );
};

export default JobDetailPage;
