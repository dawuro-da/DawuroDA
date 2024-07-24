"use client";

import { ArrowDownward } from "@mui/icons-material";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import { Resource } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const ResourceCard = () => {
  const [resources, setResources] = useState<Resource[]>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchResources = async () => {
    page === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await axios.post("/api/cms/resource/fetch", {
        page: page,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestResources = res.data.value.resources;
        const oldResources = resources?.length ? resources : [];
        setResources([...oldResources, ...latestResources]);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchResources();
  }, [page]);

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? [1, 2, 3].map((item, index) => (
              <Skeleton key={index} className="min-h-[300px]" />
            ))
          : resources?.map((item, index) => (
              <div
                className="w-full shadow-lg space-y-6 py-6 px-4 mb-7"
                key={item.id}
              >
                <h1 className="font-bold text-lg">{item.name}</h1>
                <p className="font-normal h-14">{item.description}</p>
                <div className="flex flex-row gap-2">
                  <Image
                    src={"/images/file.svg"}
                    height={30}
                    width={30}
                    alt=""
                  />
                  <div className="h-full flex flex-row items-center">
                    <p className="font-semibold text-xs mb-1">
                      {item.name + ".pdf"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    downloadPDF({ name: item.name, url: item.document })
                  }
                  variant="outlined"
                  className="text-white w-full flex flex-row py-3 rounded-md bg-primaryColor hover:text-primaryColor justify-center items-center gap-2"
                >
                  <ArrowDownward />
                  <p>Download</p>
                </Button>
              </div>
            ))}
      </div>
      <div className="w-full mt-20">
        <div
          onClick={() => setPage(page + 1)}
          className="cursor-pointer px-10 border border-[#1E1E1E] w-fit font-light mx-auto h-[50px] flex flex-row items-center justify-center"
        >
          {loadingMore ? <CircularProgress className="h-full" /> : "Load More"}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
