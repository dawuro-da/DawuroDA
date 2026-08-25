"use client";

import { getFormattedDate } from "@/util/date";
import { CalendarMonth, ArrowOutward } from "@mui/icons-material";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import { Initiative } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 6;

const InitiativesGrid = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [initiatives, setInitiatives] = useState<Initiative[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchInitiatives = async () => {
    page === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await axios.post("/api/cms/initiative/fetch", {
        page,
        pageSize: PAGE_SIZE,
      });
      if (res.data.success) {
        const latest = res.data.value.initiatives;
        const existing = page === 1 ? [] : initiatives ?? [];
        setInitiatives([...existing, ...latest]);
        setTotal(res.data.value.total);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchInitiatives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const hasMore = Boolean(initiatives && initiatives.length < total);

  return (
    <div className="w-full py-16">
      <div className="text-center mb-12 xl:lg:px-40 md:px-20 px-10">
        <span className="block text-primaryColor font-semibold text-sm uppercase tracking-wide mb-2">
          {t("navigation.initiatives")}
        </span>
        <h1 className="font-bold lg:text-4xl text-2xl mb-3">
          {t("home.development_initiatives_heading")}
        </h1>
        <p className="text-titleColor font-light max-w-xl mx-auto">
          {t("home.development_initiatives_subheading")}
        </p>
      </div>

      <div className="xl:lg:px-40 md:px-20 px-10 flex flex-col gap-6 min-h-[300px]">
        {loading ? (
          [1, 2, 3].map((item) => (
            <Skeleton key={item} className="w-full min-h-[220px] rounded-2xl" />
          ))
        ) : initiatives?.length ? (
          initiatives.map((initiative) => (
            <div
              key={initiative.id}
              onClick={() => router.push(`/initiatives/${initiative.id}`)}
              className="group cursor-pointer bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <div className="relative w-full md:w-[280px] h-[220px] md:h-auto shrink-0 overflow-hidden">
                <Image
                  src={initiative.featuredImages?.[0] ?? "/images/tourism.svg"}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="group-hover:text-primaryColor font-bold text-xl mb-3">
                  {!isAmharic
                    ? initiative.nameOfInitiative
                    : initiative.nameOfInitiativeAmharic}
                </h3>
                <span className="flex items-center gap-1.5 text-titleColor text-sm mb-3">
                  <CalendarMonth fontSize="small" />
                  {getFormattedDate(initiative.created_at)}
                </span>
                <p className="text-titleColor text-sm mb-5 line-clamp-2">
                  {!isAmharic ? initiative.body : initiative.bodyAmharic}
                </p>
                <span className="inline-flex items-center gap-1.5 w-fit text-primaryColor font-semibold text-sm px-5 py-2 rounded border-2 border-primaryColor group-hover:bg-primaryColor group-hover:text-white transition-colors">
                  {t("home.learn_more")}
                  <ArrowOutward fontSize="small" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full items-center justify-center text-titleColor min-h-[200px] text-center">
            <span>Currently, there are no initiatives available.</span>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setPage(page + 1)}
              variant="outlined"
              disabled={loadingMore}
              className="border-2 border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white capitalize px-10 py-2.5 rounded"
            >
              {loadingMore ? (
                <CircularProgress size={20} />
              ) : (
                t("news.load_more")
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitiativesGrid;
