"use client";

import Naviagtion from "@/landingPage/navigation/Navigation";
import VacancyCard from "./VacancyCard";
import Footer from "@/landingPage/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "@prisma/client";
import { CircularProgress, Skeleton } from "@mui/material";
import { getRelativeTimeSinceDate } from "@/util/date";

const VacancySection = () => {
  const [jobs, setJobs] = useState<Job[]>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchJobs = async () => {
    page === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await axios.post("/api/cms/job/fetch", {
        page: page,
        pageSize: 10,
      });
      if (res.data.success) {
        const latestJobs = res.data.value.jobs;
        const oldJobs = jobs?.length ? jobs : [];
        setJobs([...oldJobs, ...latestJobs]);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <div className="z-40 absolute top-0 w-full">
        <Naviagtion />
      </div>
      <div className="w-4/5 mx-auto">
        <div className="text-center lg:mt-[180px] mt-[100px] mb-16">
          <h1 className="lg:text-4xl md:text-2xl text-lg font-extrabold mb-6">
            Vacancies
          </h1>
          <p className="font-light text-[#7C7C7C]">Our Job Openings</p>
        </div>
      </div>
      <div className="mb-48 min-h-[300px]">
        {loading ? (
          <Skeleton className="min-h-[300px]" />
        ) : (
          jobs?.map((item, index) => <VacancyCard key={index} job={item} />)
        )}
      </div>
      <div className="w-full mb-20">
        <div
          onClick={() => setPage(page + 1)}
          className="cursor-pointer px-10 border border-[#1E1E1E] w-fit font-light mx-auto h-[50px] flex flex-row items-center justify-center"
        >
          {loadingMore ? <CircularProgress className="h-full" /> : "Load More"}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VacancySection;
