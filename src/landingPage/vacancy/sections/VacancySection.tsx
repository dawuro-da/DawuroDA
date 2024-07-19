"use client";

import Naviagtion from "@/landingPage/navigation/Navigation";
import VacancyCard from "./VacancyCard";
import Footer from "@/landingPage/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "@prisma/client";
import { Skeleton } from "@mui/material";
import { getRelativeTimeSinceDate } from "@/util/date";

const VacancySection = () => {
  const [jobs, setJobs] = useState<Job[]>();
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/job/fetch", {
        page: 1,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestJobs = res.data.value.jobs;
        setJobs(latestJobs);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
      <div className="mb-48 min-h-[400px]">
        {loading ? (
          <Skeleton className="min-h-[300px]" />
        ) : (
          jobs?.map((item, index) => <VacancyCard key={index} job={item} />)
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VacancySection;
