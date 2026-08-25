"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CountdownTimer = ({ date }: { date: Date }) => {
  const { t } = useTranslation();
  const calculateTimeLeft = () => {
    const difference = Math.max(+new Date(date) - +new Date(), 0);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const units: { key: keyof typeof timeLeft; label: string }[] = [
    { key: "days", label: t("home.days") },
    { key: "hours", label: t("home.hours") },
    { key: "minutes", label: t("home.minutes") },
    { key: "seconds", label: t("home.seconds") },
  ];

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {units.map((unit) => (
        <div
          key={unit.key}
          className="flex flex-col items-center justify-center bg-primaryColor text-white rounded-lg w-14 h-14 md:w-16 md:h-16 shrink-0"
        >
          <span className="text-lg md:text-xl font-bold leading-none">
            {String(timeLeft[unit.key]).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wide mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
