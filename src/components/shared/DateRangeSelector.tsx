"use client";

import * as React from "react";
import { addDays } from "date-fns";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function BasicRangeShortcuts({
  setDateFilter,
  dateFilter,
}: {
  setDateFilter: any;
  dateFilter: any;
}) {
  const [state, setState] = useState<any>([
    {
      startDate: dateFilter?.startDate ? dateFilter?.startDate : new Date(),
      endDate: dateFilter?.endDate
        ? dateFilter?.endDate
        : addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  React.useEffect(() => {
    setDateFilter({
      startDate: state[0].startDate,
      endDate: state[0].endDate,
    });
  }, [state]);

  return (
    <div className="overflow-x-auto">
      <DateRangePicker
        onChange={(item) => setState([item.selection])}
        color="#34A858"
        className="border-primaryColor outline-primaryColor"
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        inputRanges={[]}
        rangeColors={['#34a858', '#34a858', '#34a858']}
      />
    </div>
  );
}
