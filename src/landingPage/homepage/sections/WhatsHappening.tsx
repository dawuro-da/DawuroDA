"use client";
import { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Event } from "@prisma/client";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { getFormattedDate } from "@/util/date";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const WhatsHappening = () => {
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [events, setEvents] = useState<Event[]>();
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/event/fetch", {
        page: 1,
        pageSize: 4,
        upcoming: true,
      });
      if (res.data.success) {
        const latestEvents = res.data.value.events;
        setEvents(latestEvents);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="text-center mb-12 xl:lg:px-40 md:px-20 px-10">
        <span className="block text-primaryColor font-semibold text-sm uppercase tracking-wide mb-2">
          {t("home.events_label")}
        </span>
        <h2 className="text-[#1E1E1E] font-bold lg:text-4xl text-lg mb-3">
          {t("home.event_heading")}
        </h2>
        <span className="block w-16 h-1 bg-primaryColor mx-auto mb-4" />
        <p className="text-titleColor font-light max-w-xl mx-auto">
          {t("home.event_subheading")}
        </p>
      </div>
      <div className="xl:lg:px-40 md:px-20 px-10 flex flex-col gap-6">
        {loading ? (
          [1, 2].map((item) => (
            <Skeleton
              key={item}
              className="w-full min-h-[260px] rounded-2xl"
            />
          ))
        ) : !events?.length ? (
          <div className="text-center text-titleColor min-h-[100px] flex items-center justify-center">
            <span>Currently, there are no upcoming events.</span>
          </div>
        ) : (
          events.map((event) => (
              <div
                key={event.id}
                className="bg-[#F7F7F7] rounded-2xl overflow-hidden flex flex-col md:flex-row"
              >
                <div className="relative w-full md:w-[38%] h-[220px] md:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={event.profileImage || "/images/tourism.svg"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                  <h3 className="font-bold text-lg md:text-xl mb-3">
                    {isAmharic ? event.headlineAmharic : event.headline}
                  </h3>
                  <span className="flex items-center gap-1.5 text-titleColor text-xs uppercase tracking-wide mb-4">
                    <CalendarMonth
                      className="text-primaryColor"
                      fontSize="small"
                    />
                    {getFormattedDate(event.startDate)}
                  </span>
                  <p className="text-titleColor text-sm mb-6 line-clamp-2">
                    {isAmharic ? event.bodyAmharic : event.body}
                  </p>
                  <CountdownTimer date={event.startDate} />
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default WhatsHappening;
