import { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Event } from "@prisma/client";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { getDay, getMonth, getTime } from "date-fns";
import {
  getFormattedDate,
  getFormattedMonthAndDay,
  getFormattedhourAndMinute,
} from "@/util/date";

const WhatsHappening = () => {
  const [events, setEvents] = useState<Event[]>();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="md:py-24 py-12 ">
      <h2 className="font-bold md:w-full w-4/5 mx-auto lg:text-4xl md:text-2xl text-xl mb-6 text-center">
        {`What's Happening Next: Key Events`}
      </h2>
      <p className="md:mb-20 mb-10 font-light lg:w-[23%] mx-auto text-center">
        {`Don't Miss These Exciting Events`}
      </p>
      {loading ? (
        <Skeleton className="min-h-[300px]" />
      ) : events?.length === 0 ? (
        <div className="text-center min-w-full text-3xl text-titleColor">
          No upcoming events
        </div>
      ) : (
        events?.map((event, index) => {
          const isActive = Boolean(selectedIndex === index);
          return (
            <div key={index} className="flex flex-col mb-12">
              <div className="w-4/5 space-y-10 mx-auto grid md:grid-cols-4 bg-gradient-to-b from-blue-100 to-white px-14 xl:lg:px-14 md:px-0 py-20 border border-[#13A6D9]">
                <div className="text-[#000000] md:text-left text-center lg:max-w-full max-w-[80%] mx-auto items-center flex justify-center">
                  <h2 className="text-sm font-normal md:max-w-[50%]">
                    {event.headline}
                  </h2>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                  <p className="md:text-5xl text-xl font-bold mb-2">
                    {getFormattedMonthAndDay(event.startDate)}
                    {`-`}
                  </p>
                  <p className="text-lg font-light">
                    {getFormattedDate(event.endDate)}
                    {``}
                  </p>
                </div>
                {/* <div className="text-center md:max-w-[70%]">
                <p className="text-xl font-bold mb-2">
                  Arbamich, Paradise Hotel
                </p>
                <p className="text-lg font-light">Venue</p>
              </div> */}
                <div className="text-center md:col-span-2 w-full flex flex-col items-end justify-center">
                  <p className="text-sm mb-2">
                    {isActive ? event.body : event.body.slice(0, 300)}
                  </p>
                  <span
                    onClick={() => {
                      if (isActive) {
                        setSelectedIndex(-1);
                      } else {
                        setSelectedIndex(index);
                      }
                    }}
                    className="w-full text-right text-titleColor capitalize hover:text-black cursor-pointer"
                  >
                    {isActive ? "see less" : "see more"}
                  </span>
                </div>
              </div>
              <CountdownTimer date={event.startDate} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default WhatsHappening;
