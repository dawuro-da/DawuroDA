"use client";
import { useEffect, useState } from "react";

const CountdownTimer = ({ date }: { date: Date }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    let timeLeft = {};

    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex items-center flex-row justify-center md:space-x-11 space-x-8 w-4/5 mx-auto bg-[#13A6D9] text-white p-6">
      {Object.keys(timeLeft).map((interval, index) => (
        <div key={index} className="text-center w-10">
          <p className="text-lg font-bold text-white">{timeLeft[interval]}</p>
          <p className="text-sm capitalize text-white">{interval}</p>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
